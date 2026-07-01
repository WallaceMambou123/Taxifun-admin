import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function TableShell({
  title,
  description,
  search,
  onSearch,
  filters,
  children,
}: {
  title: string;
  description?: string;
  search?: string;
  onSearch?: (v: string) => void;
  filters?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl">
      <div className="flex flex-col gap-4 border-b border-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onSearch && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search ?? ""}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Rechercher…"
                className="h-9 w-full min-w-0 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-56"
              />
            </div>
          )}
          {filters}
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid items-center gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: cols }).map((__, j) => (
            <Skeleton key={j} className="h-6 w-full bg-white/5" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
  count,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition " +
        (active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground")
      }
    >
      {children}
      {typeof count === "number" && (
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">{count}</span>
      )}
    </button>
  );
}

export function Pagination({
  page,
  pageCount,
  onPage,
  total,
}: {
  page: number;
  pageCount: number;
  onPage: (p: number) => void;
  total: number;
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 p-4 text-xs text-muted-foreground sm:flex-row">
      <div>{total} résultats · Page {page} / {Math.max(1, pageCount)}</div>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10 disabled:opacity-40"
        >
          Précédent
        </button>
        {Array.from({ length: Math.min(5, Math.max(1, pageCount)) }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={
                "h-8 w-8 rounded-md text-xs " +
                (p === page
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "border border-white/10 bg-white/5 hover:bg-white/10")
              }
            >
              {p}
            </button>
          );
        })}
        <button
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10 disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
