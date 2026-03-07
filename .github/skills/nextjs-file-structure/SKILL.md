---
name: nextjs-file-structure
description: >-
  Guidelines for organizing files and folders in a Next.js project using App Router,
  TypeScript, and a DDD-like domain layer. Use this skill whenever creating, moving,
  or reorganizing files in a Next.js project — including creating new pages, components,
  hooks, services, repositories, or any other project file. Also trigger when the user
  asks where a file should go, how to structure a feature, or when scaffolding new
  routes or domains. If you're about to create a file in a Next.js project and aren't
  sure where it belongs, consult this skill first.
---

# Next.js File Structure Guidelines

These guidelines define how to organize files in a Next.js project with App Router, TypeScript, and a DDD-like domain architecture. Follow them whenever creating, moving, or restructuring files.

This skill **complements** the `nextjs-boilerplate` skill. The boilerplate handles initial scaffolding (tRPC, Better Auth, Drizzle, Docker). This skill takes over once the project exists and defines where every new file should go as the project grows. The boilerplate's initial flat `src/trpc/router.ts` naturally evolves into the `src/trpc/routers/` structure defined here as domains are added.

The guiding principle is **colocation**: things that change together live together. Page-specific code stays with the page. Shared code lives in well-defined global locations. Business logic lives in domain folders, isolated from the UI layer.

## High-level structure

```
src/
├── app/                    # Routes and pages (App Router)
├── components/             # Shared UI components
│   └── ui/                 # Primitives (button, input, dialog, etc.)
├── domains/                # Business logic organized by domain (DDD-like)
├── db/                     # Database schema and migrations
├── lib/                    # Shared utilities and configuration
│   └── env/                # Environment variable validation (client.ts, server.ts)
├── hooks/                  # Shared custom hooks
├── types/                  # Shared global types
├── workflows/              # Vercel Workflow (WDK) definitions
└── trpc/                   # tRPC setup and routers
    └── routers/            # tRPC routers organized by domain
```

---

## Pages and route-specific code

Each route folder inside `src/app/` can contain **private folders** (prefixed with `_`) for code that is specific to that page. Next.js ignores `_`-prefixed folders in routing, so they are safe to use for colocation.

### Convention: use `_` prefix for page-scoped folders

```
src/app/dashboard/
├── page.tsx
├── layout.tsx
├── loading.tsx
├── _components/            # Components used ONLY by this page
│   ├── stats-card.tsx
│   ├── recent-activity.tsx
│   └── revenue-chart.tsx
├── _hooks/                 # Hooks used ONLY by this page
│   └── use-dashboard-filters.ts
├── _types/                 # Types used ONLY by this page
│   └── index.ts
└── _lib/                   # Helpers/utilities used ONLY by this page
    └── format-dashboard-data.ts
```

### When to create a `_` folder vs. use a shared location

Create a `_components/`, `_hooks/`, `_types/`, or `_lib/` folder inside the route when the code is **only used by that page or its direct children**. The moment a second, unrelated page imports from it, move the code to the corresponding shared folder (`src/components/`, `src/hooks/`, `src/types/`, or `src/lib/`).

### Nested routes inherit parent conventions

```
src/app/dashboard/
├── page.tsx
├── _components/
│   └── dashboard-header.tsx
├── settings/
│   ├── page.tsx
│   └── _components/
│       └── settings-form.tsx
└── analytics/
    ├── page.tsx
    └── _components/
        └── analytics-chart.tsx
```

Each nested route manages its own `_` folders independently.

---

## Shared components

Components used across multiple pages live in `src/components/`.

```
src/components/
├── ui/                     # Design system primitives (Shadcn/ui, custom)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
├── layout/                 # App-wide layout pieces
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
├── forms/                  # Reusable form patterns
│   └── form-field.tsx
└── data-display/           # Tables, cards, lists shared across pages
    └── data-table.tsx
```

### Rules

- `src/components/ui/` holds **primitives** — low-level, style-only components with no business logic. Shadcn/ui components go here.
- Everything else in `src/components/` holds **composite** components — they combine primitives and may contain light presentation logic, but never domain-specific business logic.
- Group by purpose (layout, forms, data-display), not by domain. If a component is tied to a specific domain, it likely belongs in a page's `_components/` or should receive domain data through props.

---

## Domains (DDD-like layer)

All business logic lives in `src/domains/`, organized by bounded context. Each domain encapsulates its own services, data access, validation, and types.

```
src/domains/
├── user/
│   ├── interfaces/
│   │   ├── user.service.interface.ts
│   │   └── user.repository.interface.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   └── types/
│       └── index.ts
├── order/
│   ├── interfaces/
│   │   ├── order.service.interface.ts
│   │   └── order.repository.interface.ts
│   ├── services/
│   │   └── order.service.ts
│   ├── repositories/
│   │   └── order.repository.ts
│   ├── schemas/
│   │   └── order.schema.ts
│   └── types/
│       └── index.ts
└── payment/
    ├── interfaces/
    │   ├── payment.service.interface.ts
    │   └── payment.repository.interface.ts
    ├── services/
    │   └── payment.service.ts
    ├── repositories/
    │   └── payment.repository.ts
    ├── schemas/
    │   └── payment.schema.ts
    └── types/
        └── index.ts
```

### What goes where

- **interfaces/**: TypeScript interfaces for each service and repository in the domain. Every service and repository must have a corresponding interface defined here, named with the `I` prefix (e.g., `IOrderService`, `IOrderRepository`). The DI container binds to these interfaces — callers depend on the interface, not the concrete class. Interface files follow the naming convention `[domain].[role].interface.ts`.
- **services/**: Business rules and orchestration. A service may call its own repository and, when necessary, other domain services. Services should never import from `src/app/` or any UI code. Each service class implements its corresponding interface from `interfaces/`. Example: `createOrder()`, `calculateShipping()`.
- **repositories/**: Data access. Wraps Drizzle queries for the domain's tables. Only the domain's own service should import its repository. Each repository class implements its corresponding interface from `interfaces/`. Example: `findUserByEmail()`, `insertOrder()`.
- **schemas/**: Zod schemas for input validation. Used by tRPC routers and services to validate data at the boundary. Example: `createUserSchema`, `updateOrderSchema`.
- **types/**: TypeScript types for the domain. Inferred types from Zod schemas also live here if they need to be exported. Example: `User`, `Order`, `CreateUserInput`.

### Services and repositories are classes wired through InversifyJS DI

Services and repositories are always implemented as **classes** decorated with `@injectable()`. Dependencies (database, other services/repositories) are injected via the constructor using `@inject()`. **Never import `db` directly inside a repository** — always receive it as a constructor parameter.

Every class must be:
1. Decorated with `@injectable()`
2. Registered in `src/lib/di/container.ts` (use `.inSingletonScope()` for services and repositories)
3. Identified by a symbol in `src/lib/di/types.ts`

Callers (tRPC routers) resolve instances via `container.get<T>(TYPES.X)` — they never instantiate classes directly.

**Interface (repository):**
```ts
// src/domains/order/interfaces/order.repository.interface.ts
import type { Order } from "../types";

interface IOrderRepository {
  findById(id: string): Promise<Order | undefined>;
}

export type { IOrderRepository };
```

**Interface (service):**
```ts
// src/domains/order/interfaces/order.service.interface.ts
import type { CreateOrderInput, Order } from "../types";

interface IOrderService {
  create(input: CreateOrderInput): Promise<Order>;
}

export type { IOrderService };
```

**Repository:**
```ts
// src/domains/order/repositories/order.repository.ts
import { inject, injectable } from "inversify";
import type { Database } from "@/lib/db";
import { TYPES } from "@/lib/di/types";
import type { IOrderRepository } from "../interfaces/order.repository.interface";

@injectable()
class OrderRepository implements IOrderRepository {
  constructor(
    @inject(TYPES.Database) private readonly db: Database,
  ) {}

  findById(id: string) { return this.db.select()... }
}

export { OrderRepository };
```

**Service:**
```ts
// src/domains/order/services/order.service.ts
import { inject, injectable } from "inversify";
import { TYPES } from "@/lib/di/types";
import type { IOrderRepository } from "../interfaces/order.repository.interface";
import type { IOrderService } from "../interfaces/order.service.interface";

@injectable()
class OrderService implements IOrderService {
  constructor(
    @inject(TYPES.OrderRepository) private readonly repository: IOrderRepository,
  ) {}

  async create(input: CreateOrderInput) { ... }
}

export { OrderService };
```

**Registration (`src/lib/di/container.ts`):**
```ts
import { db, type Database } from "@/lib/db";
import type { IOrderRepository } from "@/domains/order/interfaces/order.repository.interface";
import type { IOrderService } from "@/domains/order/interfaces/order.service.interface";

// db is a constant value — bound once, injected everywhere
container.bind<Database>(TYPES.Database).toConstantValue(db);

// Bind to the interface type — callers depend on the interface, not the concrete class
container.bind<IOrderRepository>(TYPES.OrderRepository).to(OrderRepository).inSingletonScope();
container.bind<IOrderService>(TYPES.OrderService).to(OrderService).inSingletonScope();
```

**tRPC router resolves from container:**
```ts
import { container } from "@/lib/di/container";
import { TYPES } from "@/lib/di/types";
import type { IOrderService } from "@/domains/order/interfaces/order.service.interface";

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createOrderSchema)
    .mutation(({ input }) =>
      container.get<IOrderService>(TYPES.OrderService).create(input),
    ),
});
```

### Cross-domain communication

When domain A needs data from domain B, **import domain B's service** — never its repository directly. This preserves each domain's encapsulation.

```
// ✅ Correct: order service uses user service
import { userService } from "@/domains/user/services/user.service";

// ❌ Wrong: order service reaches into user's repository
import { userRepository } from "@/domains/user/repositories/user.repository";
```

### When to create a new domain

Create a new domain when you identify a distinct bounded context — a set of entities and rules that make sense together and have clear boundaries. Signals that something deserves its own domain: it has its own database tables, its own validation rules, and its own vocabulary.

Do not create a domain for purely technical concerns (like "email" or "cache") — those belong in `src/lib/`.

---

## tRPC routers

tRPC routers are centralized in `src/trpc/routers/`, with one file per domain. The root router in `src/trpc/router.ts` merges them.

```
src/trpc/
├── init.ts
├── router.ts                # Root router — merges all domain routers
├── routers/
│   ├── user.ts              # User domain router
│   ├── order.ts             # Order domain router
│   └── payment.ts           # Payment domain router
├── client.tsx
├── server.tsx
├── query-client.ts
└── utils.ts
```

Each domain router imports from its domain's services and schemas:

```ts
// src/trpc/routers/user.ts
import { createTRPCRouter, publicProcedure } from "../init";
import { createUserSchema } from "@/domains/user/schemas/user.schema";
import { userService } from "@/domains/user/services/user.service";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(({ input }) => userService.createUser(input)),
});
```

The root router merges everything:

```ts
// src/trpc/router.ts
import { createTRPCRouter } from "./init";
import { userRouter } from "./routers/user";
import { orderRouter } from "./routers/order";

export const appRouter = createTRPCRouter({
  user: userRouter,
  order: orderRouter,
});
```

The reason routers live in `src/trpc/` instead of inside each domain is that routers are a **transport concern** — they define the API surface and should be easy to find, compare, and audit in one place. The domain layer stays transport-agnostic.

---

## Shared utilities and config

```
src/lib/
├── db.ts                   # Database client
├── auth.ts                 # Auth server config
├── auth-client.ts          # Auth client config
├── utils.ts                # General-purpose helpers
├── constants.ts            # App-wide constants
└── env/
    ├── client.ts           # Client-side env vars (NEXT_PUBLIC_*)
    └── server.ts           # Server-side env vars (import "server-only")
```

`src/lib/` is for **technical infrastructure** shared across the app — things that are not tied to any specific domain or page.

### Environment variables

Environment validation lives in `src/lib/env/` — two separate files to enforce the client/server boundary:

- `src/lib/env/client.ts` — validates `NEXT_PUBLIC_*` variables using Zod. Safe to import anywhere.
- `src/lib/env/server.ts` — validates server-only variables. Imports `"server-only"` to prevent accidental usage in client code.

> Do **not** create a top-level `src/env/` folder. Env validation is technical infrastructure and belongs inside `src/lib/`.

---

## Workflows

Vercel Workflow (WDK) definitions live in `src/workflows/`.

```
src/workflows/
├── example.ts              # Example workflow
└── appointment.ts          # Domain-related workflow
```

Each file exports one or more workflow definitions. Workflows are background job definitions — they are infrastructure, not business logic — so they live at the top level alongside `src/lib/`, not inside `src/domains/`.

> Do **not** place workflow files inside `src/app/` (those are routing concerns) or inside `src/domains/` (business logic only). Use `src/workflows/` exclusively for Vercel WDK workflow definitions.

---

## Shared hooks

```
src/hooks/
├── use-debounce.ts
├── use-media-query.ts
└── use-local-storage.ts
```

Only truly generic, reusable hooks go here. A hook tied to a specific page goes in that page's `_hooks/`. A hook tied to domain logic should probably be a service function instead.

---

## Shared types

```
src/types/
├── index.ts                # App-wide types (e.g., Pagination, ApiResponse)
└── env.d.ts                # Environment variable type declarations
```

Domain-specific types live in `src/domains/[domain]/types/`. Page-specific types live in `_types/`. Only truly global types (used across multiple domains and pages) go in `src/types/`.

---

## File naming conventions

- Use **kebab-case** for all file and folder names: `user.service.ts`, `stats-card.tsx`, `use-dashboard-filters.ts`.
- Use the **dot notation** for domain files to indicate the file's role: `user.service.ts`, `user.repository.ts`, `user.schema.ts`.
- Component files use simple kebab-case: `stats-card.tsx`, `data-table.tsx`.
- Hook files always start with `use-`: `use-debounce.ts`.
- Index files (`index.ts`) are acceptable for type re-exports but avoid them for components — prefer explicit file names for better IDE navigation.

---

## Decision tree: where does this file go?

1. Is it used by **only one page**? → Page's `_components/`, `_hooks/`, `_types/`, or `_lib/`
2. Is it a **UI primitive** with no business logic? → `src/components/ui/`
3. Is it a **shared component** used across pages? → `src/components/[category]/`
4. Is it **business logic** (validation, data access, rules)? → `src/domains/[domain]/`
5. Is it a **tRPC router**? → `src/trpc/routers/`
6. Is it **environment variable validation**? → `src/lib/env/client.ts` or `src/lib/env/server.ts`
7. Is it a **Vercel WDK workflow definition**? → `src/workflows/`
8. Is it a **generic utility** or infrastructure? → `src/lib/`
9. Is it a **generic reusable hook**? → `src/hooks/`
10. Is it a **global type** not tied to any domain? → `src/types/`