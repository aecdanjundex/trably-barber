import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import {
  requestOtpSchema,
  verifyOtpSchema,
} from "@/domains/customer-auth/schemas/customer-auth.schema";
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { ICustomerAuthService } from "@/domains/customer-auth/interfaces/customer-auth.service.interface";

export const customerAuthRouter = createTRPCRouter({
  requestOtp: publicProcedure
    .input(requestOtpSchema)
    .mutation(({ input }) =>
      container
        .get<ICustomerAuthService>(TYPES.CustomerAuthService)
        .requestOtp(input),
    ),

  verifyOtp: publicProcedure
    .input(verifyOtpSchema)
    .mutation(({ input }) =>
      container
        .get<ICustomerAuthService>(TYPES.CustomerAuthService)
        .verifyOtp(input),
    ),
});
