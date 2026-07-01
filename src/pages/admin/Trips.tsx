import { useMemo, useState } from "react";
import { ArrowRight, Clock, MapPin, Route as RouteIcon } from "lucide-react";
import { TripStatusBadge } from "../../components/admin/StatusBadge";
import { FilterChip, Pagination, TableShell } from "../../components/admin/DataTableShell";
import { useTrips } from "../../hooks/useAdminData";
import { type TripStatus } from "../../lib/mock-data";

const PAGE_SIZE = 10;
const STATUSES: (TripStatus | "all")[] = ["all", "REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const LABELS: Record<TripStatus | "all", string> = {
  all: "Tous", REQUESTED: "Demandés", ACCEPTED: "Acceptés", IN_PROGRESS: "En cours", COMPLETED: "Terminés", CANCELLED: "Annulés",
};

export function Trips() {
  const { data: trips = [], isLoading } = useTrips();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TripStatus | "all">("all");
  const [page, setPage] = useState(1);


  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return trips
      .filter((t:any) => (filter === "all" ? true : t.status === filter))
      .filter((t:any) => !q || t.driverName.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }, [search, filter, trips]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Trajets</h1>
        <p className="text-sm text-muted-foreground">Suivi en temps réel des courses de la flotte.</p>
      </div>

      <TableShell
        title="Historique des trajets"
        description="Filtrez par statut pour suivre l'activité en cours"
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        filters={
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <FilterChip key={s} active={filter === s} onClick={() => { setFilter(s); setPage(1); }}>
                {LABELS[s]}
              </FilterChip>
            ))}
          </div>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Trajet</th>
              <th className="px-5 py-3">Chauffeur / Client</th>
              <th className="px-5 py-3">Distance</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Prix</th>
            </tr>
          </thead>
          <tbody>
            {view.map((t:any) => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5">
                      <RouteIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 text-emerald-300" /> <span className="truncate">{t.from}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ArrowRight className="h-3 w-3 text-primary" /> <span className="truncate">{t.to}</span>
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">{t.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-medium">{t.driverName}</div>
                  <div className="text-xs text-muted-foreground">avec {t.customerName}</div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="text-sm tabular-nums">{t.distance} km</div>
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {t.duration} min</div>
                </td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.date}</td>
                <td className="px-5 py-3.5"><TripStatusBadge status={t.status} /></td>
                <td className="px-5 py-3.5 text-right tabular-nums font-semibold">XAF {t.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} pageCount={pageCount} onPage={setPage} total={filtered.length} />
      </TableShell>
    </div>
  );
}
