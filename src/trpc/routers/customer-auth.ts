import {
  createTRPCRouter,
  customerProcedure,
  publicProcedure,
} from "@/trpc/init";
import {
  requestOtpSchema,
  updateProfileSchema,
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

  getProfile: customerProcedure.query(({ ctx }) =>
    container
      .get<ICustomerAuthService>(TYPES.CustomerAuthService)
      .getProfile(ctx.customer.id),
  ),

  updateProfile: customerProcedure
    .input(updateProfileSchema)
    .mutation(({ ctx, input }) =>
      container
        .get<ICustomerAuthService>(TYPES.CustomerAuthService)
        .updateProfile(ctx.customer.id, input),
    ),
});
