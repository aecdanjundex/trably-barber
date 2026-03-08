---
name: drizzle-migrations
description: "Rules for managing Drizzle ORM migrations in this project. Use whenever touching schema.ts, migration files (.sql), meta snapshots, or _journal.json. Enforces the correct workflow: always use Drizzle CLI commands, never edit migration artifacts manually. IMPORTANT: Never create .sql migration files or edit _journal.json / meta snapshots by hand — always run `bunx drizzle-kit generate` after schema changes."
---

# Drizzle Migration Rules

## Config

- Schema file: `src/db/schema.ts`
- Migrations output: `src/db/migrations/`
- Config file: `drizzle.config.ts`
- Dialect: PostgreSQL

## Golden Rule

**Never manually edit** any of the following:

- `src/db/migrations/*.sql` — generated migration SQL files
- `src/db/migrations/meta/*.json` — snapshot files
- `src/db/migrations/meta/_journal.json` — migration journal

These files are owned by Drizzle Kit. Manual edits corrupt the migration history and cause drift between schema and database state.

## Correct Workflow

### 1. Make schema changes

Edit only `src/db/schema.ts`. This is the single source of truth.

### 2. Generate a migration

```bash
bunx drizzle-kit generate
```

This creates a new `.sql` file and updates `meta/` snapshots and `_journal.json` automatically.

### 3. Apply the migration

```bash
bunx drizzle-kit migrate
```

Runs pending migrations against the database.

### Other useful commands

```bash
# Push schema changes directly to DB without generating a migration file (dev only)
bunx drizzle-kit push

# Open Drizzle Studio to inspect the database
bunx drizzle-kit studio

# Check for drift between schema and migration history
bunx drizzle-kit check

# Drop all tables and re-apply all migrations (destructive, dev only)
bunx drizzle-kit drop
```

## Edge Cases — What to Do

| Situation | Correct Action |
|-----------|----------------|
| Need to add a column | Edit `schema.ts`, then `bunx drizzle-kit generate` |
| Need to rename a column | Edit `schema.ts`, run `generate` — Drizzle will prompt for rename vs drop+add |
| Migration file has a typo/error | Delete the generated `.sql` file and its `meta/` snapshot, then re-run `generate` (only if migration was NOT applied yet) |
| Migration was already applied and has a bug | Create a new corrective migration via `generate` — never edit the applied one |
| Need to squash/merge migrations | Do NOT do this manually. Use `bunx drizzle-kit generate` from a clean schema state |
| Journal is out of sync | Run `bunx drizzle-kit check` to diagnose, then fix via CLI — never edit `_journal.json` |

## Anti-Patterns to Reject

- Writing `.sql` migration files by hand
- Editing `meta/_journal.json` to add or remove entries
- Deleting snapshots from `meta/` to "reset" state
- Copying migration files from other projects
- Editing an already-applied migration file

If asked to do any of the above, refuse and propose the correct Drizzle CLI workflow instead.
