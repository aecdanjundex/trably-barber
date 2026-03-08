import "server-only";
import { randomInt, randomBytes } from "crypto";
import { inject, injectable } from "inversify";
import { TRPCError } from "@trpc/server";
import { TYPES } from "@/lib/di/types";
import type { ICustomerAuthRepository } from "../interfaces/customer-auth.repository.interface";
import type { ICustomerAuthService } from "../interfaces/customer-auth.service.interface";
import type {
  RequestOtpInput,
  UpdateProfileInput,
  VerifyOtpInput,
} from "../schemas/customer-auth.schema";

const OTP_EXPIRY_MINUTES = 10;
const SESSION_EXPIRY_DAYS = 30;

function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

@injectable()
class CustomerAuthService implements ICustomerAuthService {
  constructor(
    @inject(TYPES.CustomerAuthRepository)
    private readonly repository: ICustomerAuthRepository,
  ) {}

  async requestOtp(input: RequestOtpInput) {
    const org = await this.repository.findOrgBySlug(input.slug);
    if (!org) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Barbearia não encontrada",
      });
    }

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1_000);

    // Replace any pending OTP for this phone in this org
    await this.repository.deleteOtpByPhone(org.id, input.phone);
    await this.repository.createOtp(org.id, input.phone, code, expiresAt);

    // TODO: send SMS via provider (Twilio, Vonage, etc.)
    console.log(
      `[OTP] ${input.phone} → ${code} (expires in ${OTP_EXPIRY_MINUTES}min)`,
    );

    return { success: true } as const;
  }

  async verifyOtp(input: VerifyOtpInput) {
    const org = await this.repository.findOrgBySlug(input.slug);
    if (!org) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Barbearia não encontrada",
      });
    }

    const otp = await this.repository.findValidOtp(
      org.id,
      input.phone,
      input.code,
    );
    if (!otp) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Código inválido ou expirado",
      });
    }

    // Single-use: consume the OTP immediately
    await this.repository.deleteOtp(otp.id);

    // Ensure the customer record exists (creates on first login)
    const customer = await this.repository.upsertCustomer(org.id, input.phone);

    const token = generateSessionToken();
    const expiresAt = new Date(
      Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1_000,
    );
    await this.repository.createSession(customer.id, org.id, token, expiresAt);

    return { token, customerId: customer.id };
  }

  async getProfile(customerId: string) {
    const customer = await this.repository.findCustomerById(customerId);
    if (!customer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cliente não encontrado",
      });
    }
    return {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      needsOnboarding: customer.name === customer.phone && !customer.email,
    };
  }

  async updateProfile(customerId: string, input: UpdateProfileInput) {
    return this.repository.updateCustomer(customerId, {
      name: input.name,
      email: input.email,
    });
  }
}

export { CustomerAuthService };
