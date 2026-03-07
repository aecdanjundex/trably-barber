---
name: nextjs-boilerplate
description: >-
  Create, initialize, or scaffold a new Next.js project with the standard stack:
  Next.js (App Router, TypeScript), Tailwind CSS v4, Shadcn/ui, Bun, Better Auth
  (admin + organization plugins), Drizzle ORM, PostgreSQL, tRPC v11, TanStack
  React Query, Zod, React Hook Form, InversifyJS, Vercel Workflow (WDK), and
  Docker Compose for local database. Use when the user asks to start a new
  full-stack Next.js app, bootstrap a project, or set up an authentication-ready
  boilerplate with end-to-end type-safe APIs, dependency injection, and durable
  workflows.
license: MIT
metadata:
  author: dsntnow
  version: "1.0"
compatibility: Requires bun, docker, and docker-compose installed on the host system.
---

# Next.js Full-Stack Boilerplate

Scaffold a production-ready Next.js project with authentication, database, type-safe APIs, and local development infrastructure.

## Stack

- **Next.js** — App Router, TypeScript, `src/` directory
- **Tailwind CSS v4**
- **Shadcn/ui**
- **Bun** — package manager
- **Better Auth** — email/password authentication with admin + organization plugins
- **Drizzle ORM** — type-safe PostgreSQL access
- **tRPC v11** — end-to-end type-safe RPC layer
- **TanStack React Query** — client-side data fetching and caching
- **SuperJSON** — data transformer for Date, Map, Set, etc.
- **Zod** — schema validation (shared between forms, tRPC, and server)
- **React Hook Form** + `@hookform/resolvers` — performant forms with Zod integration
- **InversifyJS** — inversion of control container for dependency injection
- **Vercel Workflow (WDK)** — durable workflows with `"use workflow"` and `"use step"` directives
- **Docker Compose** — local PostgreSQL instance

## Before starting

Ask the user for the **project name** before doing anything else. Use the project name wherever `<app-name>` appears below (`.env`, `docker-compose.yml`, database URLs). Use kebab-case for file and directory references and the raw name as provided for display purposes.

## Step 1 — Scaffold the Next.js app

```bash
bunx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-bun
```

Answer **No** to the React Compiler prompt.

## Step 2 — Initialize Shadcn

```bash
bunx shadcn@latest init --defaults
bunx shadcn@latest add form input button label
```

The `form` component from Shadcn wraps React Hook Form and provides pre-styled `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, and `<FormMessage>` primitives integrated with Zod validation via `@hookform/resolvers`.

## Step 3 — Install dependencies

```bash
bun add better-auth drizzle-orm postgres @better-auth/drizzle-adapter \
  @trpc/server @trpc/client @trpc/tanstack-react-query \
  @tanstack/react-query zod superjson server-only client-only \
  react-hook-form @hookform/resolvers \
  inversify reflect-metadata \
  workflow
bun add -d drizzle-kit
```

> **Important:** `@better-auth/drizzle-adapter` must be installed explicitly. The `better-auth/adapters/drizzle` path re-exports from it, but Bun does not resolve it as a transitive dependency automatically.

> **Note:** `server-only` and `client-only` are boundary packages that prevent accidental imports across the server/client boundary.

## Step 4 — Configure TypeScript for Inversify

Add the following options to `tsconfig.json` (the `compilerOptions` section):

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "types": ["reflect-metadata"]
  }
}
```

## Step 5 — Create `src/lib/di/types.ts`

Symbols used as service identifiers. Keep all identifiers in a single file to avoid circular dependencies:

```ts
export const TYPES = {
  // Add your service identifiers here, e.g.:
  // UserService: Symbol.for("UserService"),
  // ProductRepository: Symbol.for("ProductRepository"),
} as const;
```

## Step 6 — Create `src/lib/di/container.ts`

The Inversify IoC container. The `reflect-metadata` import **must** appear here, at the top of this file, before any Inversify import. Any module that needs the container imports it from this file, which guarantees the polyfill is loaded first:

```ts
import "reflect-metadata";
import { Container } from "inversify";

const container = new Container();

// Register your bindings here, e.g.:
// container.bind<IUserService>(TYPES.UserService).to(UserService);

export { container };
```

> **Important:** Never import `reflect-metadata` in any other file. This single import in `container.ts` covers both server and client since every DI consumer goes through this module.

## Step 7 — Configure `next.config.ts` with Workflow

Wrap the Next.js config with `withWorkflow()` to enable the `"use workflow"` and `"use step"` directives:

```ts
import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // … rest of your Next.js config
};

export default withWorkflow(nextConfig);
```

## Step 8 — Create an example workflow `src/workflows/example.ts`

A minimal durable workflow to validate the setup. Each function marked with `"use step"` runs in isolation, persists progress, and retries on failure:

```ts
import { sleep } from "workflow";

export async function exampleWorkflow(input: string) {
  "use workflow";

  const result = await processInput(input);
  await sleep("5s");
  await notifyCompletion(result);

  return { status: "done", result };
}

async function processInput(input: string) {
  "use step";
  return `Processed: ${input}`;
}

async function notifyCompletion(result: string) {
  "use step";
  console.log(`Workflow completed with result: ${result}`);
}
```

## Step 9 — Create environment files

### `.env`

```env
POSTGRES_USER="user"
POSTGRES_PASSWORD="password"
POSTGRES_DB="<app-name>"
POSTGRES_PORT=5432
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
BETTER_AUTH_SECRET="change-me-to-a-random-secret-at-least-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Also create `.env.example` with the same keys but placeholder values.

## Step 10 — Create environment validation

Centralized validation with Zod. Todo código server-side importa de `@/env/server` e código client-side de `@/env/client`, eliminando `process.env` direto no restante do projeto.

### `src/env/server.ts`

```ts
import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid server environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid server environment variables");
}

export const env = parsed.data;
```

### `src/env/client.ts`

```ts
import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid client environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid client environment variables");
}

export const clientEnv = parsed.data;
```

> **Note:** `src/env/server.ts` imports `server-only` to prevent accidental client-side usage. `src/env/client.ts` only exposes `NEXT_PUBLIC_*` variables and is safe to import from client components.

## Step 11 — Create `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:17-alpine
    env_file:
      - .env
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Step 12 — Create `drizzle.config.ts`

```ts
import { defineConfig } from "drizzle-kit";
import { env } from "./src/env/server";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
```

## Step 13 — Create `src/db/schema.ts`

This schema contains the tables required by Better Auth (including admin and organization plugin fields):

```ts
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  activeOrganizationId: text("active_organization_id"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
```

> **Tip:** You can also generate this schema automatically by running `bunx @better-auth/cli generate` after configuring auth.ts with all plugins.

## Step 14 — Create `src/lib/db.ts`

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import { env } from "@/env/server";

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });
```

## Step 15 — Create `src/lib/permissions.ts`

Access control definition with `user` and `admin` roles:

```ts
import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const user = ac.newRole({
  // Regular users have no admin permissions
});

const admin = ac.newRole({
  ...adminAc.statements,
});

export { ac, user, admin };
```

## Step 16 — Create `src/lib/auth.ts` (server)

```ts
import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { ac, user, admin as adminRole } from "@/lib/permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac,
      roles: {
        user,
        admin: adminRole,
      },
      defaultRole: "user",
    }),
    organization(),
  ],
});
```

## Step 17 — Create `src/lib/auth-client.ts` (browser)

```ts
import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { clientEnv } from "@/env/client";

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
  plugins: [adminClient(), organizationClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
```

## Step 18 — Create the API route `src/app/api/auth/[...all]/route.ts`

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

## Step 19 — Create `src/trpc/query-client.ts`

TanStack Query client factory with SuperJSON serialization for SSR hydration:

```ts
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
```

## Step 20 — Create `src/trpc/init.ts`

tRPC initialization with Better Auth session in context, plus `protectedProcedure` and `adminProcedure`:

```ts
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
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});
```

## Step 21 — Create `src/trpc/router.ts`

The root app router. Add sub-routers here as the project grows:

```ts
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
```

## Step 22 — Create `src/trpc/server.tsx`

Server-side tRPC helpers for prefetching inside React Server Components:

```ts
import "server-only";
import {
  createTRPCOptionsProxy,
  TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./router";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
```

## Step 23 — Create `src/trpc/utils.ts`

Exports the typed React provider and hooks:

```ts
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "./router";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
```

## Step 24 — Create `src/trpc/client.tsx`

Client-side tRPC + React Query provider:

```tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { TRPCProvider } from "./utils";
import type { AppRouter } from "./router";
import superjson from "superjson";
import { makeQueryClient } from "./query-client";
import { clientEnv } from "@/env/client";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return clientEnv.NEXT_PUBLIC_APP_URL;
}

let browserQueryClient: ReturnType<typeof makeQueryClient> | undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getBaseUrl() + "/api/trpc",
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

## Step 25 — Create the tRPC API route `src/app/api/trpc/[trpc]/route.ts`

```ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/router";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext(),
  });

export { handler as GET, handler as POST };
```

## Step 26 — Wrap the root layout with `TRPCReactProvider`

In `src/app/layout.tsx`, wrap the children with `TRPCReactProvider`:

```tsx
import { TRPCReactProvider } from "@/trpc/client";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
```

## Running the project

```bash
# Start the database
docker compose up -d

# Push schema to the database
bunx drizzle-kit push

# Start dev server
bun dev
```

## File structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
│   └── layout.tsx
├── db/
│   └── schema.ts
├── env/
│   ├── client.ts
│   └── server.ts
├── lib/
│   ├── auth-client.ts
│   ├── auth.ts
│   ├── db.ts
│   ├── di/
│   │   ├── container.ts
│   │   └── types.ts
│   └── permissions.ts
└── trpc/
    ├── client.tsx
    ├── init.ts
    ├── query-client.ts
    ├── router.ts
    ├── server.tsx
    └── utils.ts
└── workflows/
    └── example.ts
drizzle.config.ts
next.config.ts
docker-compose.yml
.env
.env.example
```

## Common edge cases

- If `bunx create-next-app` prompts for the React Compiler, answer **No**.
- If port 5432 is already in use, stop the existing PostgreSQL instance or change `POSTGRES_PORT` in `.env` — the `docker-compose.yml` and `DATABASE_URL` will usar o novo valor automaticamente.
- If `drizzle-kit push` fails with a connection error, ensure the Docker container is running and healthy before retrying.
- If the app crashes on startup with "Invalid environment variables", check the console output — Zod will list exactly which variables are missing or malformed.
- The `@better-auth/drizzle-adapter` package must be installed explicitly — do not rely on it being resolved transitively.
- Ensure `strict: true` is set in `tsconfig.json` — tRPC relies on strict mode for correct type inference.
- The `server-only` and `client-only` packages have no runtime code; they exist solely to trigger build errors on wrong-boundary imports.
- The first admin user must be promoted manually (e.g., via `drizzle-kit studio` or a SQL `UPDATE user SET role = 'admin' WHERE email = '...'`), since all new users default to the `user` role.
- Import access control utilities from `better-auth/plugins/access` (not `better-auth/plugins`) to keep bundle size small.
- `reflect-metadata` is imported once in `src/lib/di/container.ts`. Never import it in any other file — every DI consumer goes through the container module, which guarantees the polyfill is loaded first.
- Every injectable class must be decorated with `@injectable()`. Without it, TypeScript will not emit metadata and Inversify will fail at runtime.
- Keep `TYPES` symbols in a separate file (`src/lib/di/types.ts`) to avoid circular dependency issues between the container and services.
- Workflows require the `next.config.ts` to be wrapped with `withWorkflow()`. Without it, the `"use workflow"` and `"use step"` directives will not be compiled.
- When deploying to Vercel, enable Fluid Compute for efficient workflow suspension and resumption. Without it, each resume incurs a cold start.
- Use `npx workflow web` during development to inspect workflow runs, steps, and logs visually.