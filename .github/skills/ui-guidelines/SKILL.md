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

## 3. Inputs com Busca — Debounce para Listas Grandes

Quando um campo de seleção puder exibir **mais de 10 resultados** (ex.: clientes, profissionais, serviços, produtos), **nunca** use um `<Select>` simples que carrega todos os itens de uma vez. Use um **combobox com busca e debounce** para evitar exibir milhares de resultados e sobrecarregar o servidor.

**A busca deve ser sempre por nome.**

### Padrão: Popover + Command com busca server-side debounced

```tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/utils";

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// No componente:
const [open, setOpen] = useState(false);
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search);

const { data: items } = useQuery(
  trpc.admin.listItemsBasic.queryOptions({ search: debouncedSearch }),
);

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
      {selectedId
        ? (items?.find((i) => i.id === selectedId)?.name ?? "Selecione")
        : "Selecione um item"}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="p-0">
    <Command shouldFilter={false}>
      <CommandInput placeholder="Buscar por nome..." value={search} onValueChange={setSearch} />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup>
          {items?.map((item) => (
            <CommandItem
              key={item.id}
              value={item.id}
              onSelect={() => { setSelectedId(item.id); setOpen(false); }}
            >
              <Check className={cn("mr-2 h-4 w-4", selectedId === item.id ? "opacity-100" : "opacity-0")} />
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

**Regras:**
- Use `shouldFilter={false}` no `<Command>` quando a filtragem é feita no servidor.
- O endpoint deve aceitar um parâmetro `search?: string` e filtrar por nome (`ILIKE '%search%'`).
- Debounce de **300ms** por padrão.
- Para listas pequenas já carregadas em memória (ex.: profissionais de uma organização), use a mesma UI mas filtre client-side sem debounce de rede.

## Full Page Structure (summary)

```
┌─ Page Header (title + description + action button) ─┐
├─ Filters (Select, Input, etc.)                       │
├─ Loading (Skeleton) | Empty State | Table            │
│   └─ Table: rounded-md border, Badge for status,     │
│      actions column with ghost icon buttons           │
└──────────────────────────────────────────────────────┘
```
