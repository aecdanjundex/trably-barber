import { cache } from "react";
import { headers } from "next/headers";
import superjson from "superjson";
import { TRPCError, initTRPC } from "@trpc/server";
import { auth } from "@/lib/auth";

export const createTRPCContext = cache(async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * Protected procedure — requires an authenticated session.
 * The context is narrowed so `ctx.user` and `ctx.session` are non-nullable.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});

/**
 * Admin procedure — requires an authenticated session with role "admin".
 */
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});
