---
name: ui-guidelines
description: "UI component guidelines for this project. Use when creating or editing pages with Select dropdowns, data Tables, or any shadcn/ui component. Covers Select display rules, Table layout patterns, loading states, empty states, and status badges."
---

# UI Guidelines

## When to Use

- Creating or editing admin pages with data tables
- Adding Select/dropdown components
- Building list pages with filters, loading, and empty states

## 1. Select — Always Show Human-Readable Text

The `<SelectValue>` must **never** display raw values (UUIDs, enum keys, etc.). It must always show the human-readable label.

### Static items (values are already readable)

When value and label are the same or both readable, the default behavior is fine:

```tsx
<Select value={statusFilter} onValueChange={setStatusFilter}>
  <SelectTrigger>
    <SelectValue placeholder={statusFilter ? STATUS_LABELS[statusFilter] : "Filtrar por status"} />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Todos</SelectItem>
    <SelectItem value="open">Abertas</SelectItem>
  </SelectContent>
</Select>
```

### Dynamic items (value is an ID)

When the value is an ID or non-readable string, render the label explicitly inside `<SelectValue>` children so the trigger always shows a name, not an ID:

```tsx
<Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione um profissional">
      {selectedBarberId
        ? (barbers.find((b) => b.userId === selectedBarberId)?.user.name ?? selectedBarberId)
        : undefined}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    {barbers.map((b) => (
      <SelectItem key={b.userId} value={b.userId}>
        {b.user.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Key rules:**
- If `value` is an ID/UUID, you **must** resolve it to a label inside `<SelectValue>` children.
- **Never** set a fixed width (`w-[200px]`, `w-64`, etc.) on `<SelectTrigger>`. It must fill the available space of its parent container.

## 2. Data Tables — Standard Layout

Every list/table page must follow this structure, in order:

### 2.1 Page Header

Title + description on the left, primary action button on the right.

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">Título da Página</h1>
    <p className="text-muted-foreground">Descrição breve do conteúdo</p>
  </div>
  <Button onClick={handleNew} disabled={mutation.isPending}>
    <Plus className="mr-2 h-4 w-4" />
    Novo Item
  </Button>
</div>
```

### 2.2 Filters

Place filter controls (Select, Input, etc.) below the header, inside a flex row with gap:

```tsx
<div className="flex gap-2">
  {/* Select filters here */}
</div>
```

### 2.3 Loading State

Use `Skeleton` placeholders while data is loading:

```tsx
{isLoading ? (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
) : ( /* table or empty state */ )}
```

### 2.4 Empty State

Show a dashed border container with a message and a CTA button:

```tsx
<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
  <p className="text-muted-foreground">Nenhum item encontrado</p>
  <Button variant="outline" className="mt-4" onClick={handleNew}>
    <Plus className="mr-2 h-4 w-4" />
    Criar primeiro item
  </Button>
</div>
```

### 2.5 Table

Wrap the table in `rounded-md border`. Use shadcn `Table` components. Actions go in the last column.

```tsx
<div className="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Coluna 1</TableHead>
        <TableHead>Coluna 2</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="w-16">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.field1}</TableCell>
          <TableCell>{item.field2}</TableCell>
          <TableCell>
            <Badge variant={STATUS_VARIANTS[item.status] ?? "outline"}>
              {STATUS_LABELS[item.status] ?? item.status}
            </Badge>
          </TableCell>
          <TableCell>
            <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/recurso/${item.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### 2.6 Status Display

Always use a label mapping + Badge. Never show raw enum values to the user:

```tsx
const STATUS_LABELS: Record<string, string> = {
  open: "Aberta",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  open: "default",
  completed: "secondary",
  cancelled: "destructive",
};
```

### 2.7 Formatting Helpers

Use `Intl` for dates and currency — never raw values:

```tsx
function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(date));
}
```

## Full Page Structure (summary)

```
┌─ Page Header (title + description + action button) ─┐
├─ Filters (Select, Input, etc.)                       │
├─ Loading (Skeleton) | Empty State | Table            │
│   └─ Table: rounded-md border, Badge for status,     │
│      actions column with ghost icon buttons           │
└──────────────────────────────────────────────────────┘
```
