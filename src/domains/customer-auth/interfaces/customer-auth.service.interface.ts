import type {
  RequestOtpInput,
  UpdateProfileInput,
  VerifyOtpInput,
} from "../schemas/customer-auth.schema";
import type { Customer } from "../types";

interface ICustomerAuthService {
  requestOtp(input: RequestOtpInput): Promise<{ success: true }>;
  verifyOtp(
    input: VerifyOtpInput,
  ): Promise<{ token: string; customerId: string }>;
  getProfile(customerId: string): Promise<{
    name: string;
    email: string | null;
    phone: string;
    needsOnboarding: boolean;
  }>;
  updateProfile(
    customerId: string,
    input: UpdateProfileInput,
  ): Promise<Customer>;
}

export type { ICustomerAuthService };
