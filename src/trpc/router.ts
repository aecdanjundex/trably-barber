import {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  orgProcedure,
  orgAdminProcedure,
  createTRPCRouter,
} from "./init";
import { customerAuthRouter } from "./routers/customer-auth";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(async () => {
    return "Hello from tRPC!";
  }),
  me: protectedProcedure.query(({ ctx }) => {
    return { user: ctx.user };
  }),
  adminOnly: adminProcedure.query(({ ctx }) => {
    return { message: `Admin access granted for ${ctx.user.name}` };
  }),
  customerAuth: customerAuthRouter,
});

export type AppRouter = typeof appRouter;
