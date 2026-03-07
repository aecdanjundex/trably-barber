import type {
  RequestOtpInput,
  VerifyOtpInput,
} from "../schemas/customer-auth.schema";

interface ICustomerAuthService {
  requestOtp(input: RequestOtpInput): Promise<{ success: true }>;
  verifyOtp(
    input: VerifyOtpInput,
  ): Promise<{ token: string; customerId: string }>;
}

export type { ICustomerAuthService };
