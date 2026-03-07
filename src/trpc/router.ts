import {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  createTRPCRouter,
} from "./init";

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
});

export type AppRouter = typeof appRouter;
