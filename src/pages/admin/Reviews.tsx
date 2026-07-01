import { useMemo, useState } from "react";
import { Quote, Star } from "lucide-react";
import { reviews } from "../../lib/mock-data";
import { FilterChip } from "../../components/admin/DataTableShell";

type RoleFilter = "all" | "customer" | "driver";

export function Reviews() {
  const [role, setRole] = useState<RoleFilter>("all");
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(
    () => reviews.filter((r) => (role === "all" ? true : r.authorRole === role)).filter((r) => r.rating >= minRating),
    [role, minRating],
  );

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Avis</h1>
        <p className="text-sm text-muted-foreground">{reviews.length} avis · Note moyenne {avg}/5</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={role === "all"} onClick={() => setRole("all")}>Tous</FilterChip>
          <FilterChip active={role === "customer"} onClick={() => setRole("customer")}>Avis clients</FilterChip>
          <FilterChip active={role === "driver"} onClick={() => setRole("driver")}>Avis chauffeurs</FilterChip>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>Note minimum</span>
          {[0, 3, 4, 5].map((n) => (
            <FilterChip key={n} active={minRating === n} onClick={() => setMinRating(n)}>
              {n === 0 ? "Tous" : `${n}+`}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r:any) => (
          <article key={r.id} className="glass relative flex flex-col rounded-2xl p-5">
            <Quote className="absolute right-4 top-4 h-6 w-6 text-primary/30" />
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40 text-xs font-bold">
                {r.author.split(" ").map((s:any) => s[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{r.author}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {r.authorRole === "driver" ? "Chauffeur" : "Client"} → {r.target}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={i < r.rating ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground/30"} />
              ))}
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">"{r.comment}"</p>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-muted-foreground">
              <span className="font-mono">{r.tripId}</span>
              <span>{r.date}</span>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">Aucun avis ne correspond aux filtres.</div>
      )}
    </div>
  );
}
