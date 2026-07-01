import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronRight, Star } from "lucide-react";
import { DriverStatusBadge } from "../../components/admin/StatusBadge";
import { FilterChip, Pagination, TableShell } from "../../components/admin/DataTableShell";
import { useDrivers, useVerifyDriver, useToggleDriverStatus } from "../../hooks/useAdminData";
import { type DriverStatus } from "../../lib/mock-data";
import { toast } from "sonner";

type SortKey = "name" | "rating" | "trips" | "wallet";
const PAGE_SIZE = 10;

export function Drivers() {
  const { data: drivers = [], isLoading } = useDrivers();
  const { mutate: doVerify } = useVerifyDriver();
  const { mutate: doToggleStatus } = useToggleDriverStatus();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DriverStatus | "all">("all");
  const [sort, setSort] = useState<SortKey>("trips");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);

  const verify = (id: string) => {
    doVerify(id, {
      onSuccess: () => toast.success("Chauffeur vérifié avec succès"),
      onError: () => toast.error("Échec de la vérification"),
    });
  };

  const toggleStatus = (id: string, currentActive: boolean) => {
    doToggleStatus({ id, isActive: !currentActive }, {
      onSuccess: () => toast.success(currentActive ? "Chauffeur bloqué" : "Chauffeur activé"),
      onError: () => toast.error("Échec du changement de statut"),
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return drivers
      .filter((d:any) => (filter === "all" ? true : d.status === filter))
      .filter((d:any) => !q || d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || (d.vehicle?.plate.toLowerCase().includes(q) || ""))
      .sort((a:any, b:any) => {
        const av = a[sort] as number | string;
        const bv = b[sort] as number | string;
        const cmp = typeof av === "number" ? (av as number) - (bv as number) : String(av).localeCompare(String(bv));
        return asc ? cmp : -cmp;
      });
  }, [search, filter, sort, asc, drivers]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    all: drivers.length,
    verified: drivers.filter((d:any) => d.status === "verified").length,
    pending: drivers.filter((d:any) => d.status === "pending").length,
    blocked: drivers.filter((d:any) => d.status === "blocked").length,
  };

  const toggleSort = (k: SortKey) => {
    if (sort === k) setAsc(!asc);
    else { setSort(k); setAsc(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Chauffeurs</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} chauffeurs · gérez vos partenaires de la flotte.</p>
      </div>

      <TableShell
        title="Liste des chauffeurs"
        description="Vérifiez les inscriptions et suivez l'activité"
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        filters={
          <div className="flex flex-wrap gap-2">
            <FilterChip active={filter === "all"} onClick={() => { setFilter("all"); setPage(1); }} count={counts.all}>Tous</FilterChip>
            <FilterChip active={filter === "verified"} onClick={() => { setFilter("verified"); setPage(1); }} count={counts.verified}>Vérifiés</FilterChip>
            <FilterChip active={filter === "pending"} onClick={() => { setFilter("pending"); setPage(1); }} count={counts.pending}>En attente</FilterChip>
            <FilterChip active={filter === "blocked"} onClick={() => { setFilter("blocked"); setPage(1); }} count={counts.blocked}>Bloqués</FilterChip>
          </div>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3"><button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("name")}>Chauffeur <ArrowUpDown className="h-3 w-3" /></button></th>
              <th className="px-5 py-3">Véhicule</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3"><button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("rating")}>Note <ArrowUpDown className="h-3 w-3" /></button></th>
              <th className="px-5 py-3"><button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("trips")}>Trajets <ArrowUpDown className="h-3 w-3" /></button></th>
              <th className="px-5 py-3 text-right"><button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("wallet")}>Portefeuille <ArrowUpDown className="h-3 w-3" /></button></th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {view.map((d:any) => (
              <tr key={d.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40 text-xs font-bold">
                      {d.name.split(" ").map((s:any) => s[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{d.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{d.id} · {d.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="text-sm">{d.vehicle?.model || "Pas de véhicule"}</div>
                  <div className="text-xs text-muted-foreground">{d.vehicle?.color || "-"} · <span className="font-mono">{d.vehicle?.plate || "-"}</span></div>
                </td>
                <td className="px-5 py-3.5"><DriverStatusBadge status={d.status} /></td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {d.rating.toFixed(2)}
                  </span>
                </td>
                <td className="px-5 py-3.5 tabular-nums">{d.trips}</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-semibold">XAF {d.wallet.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/drivers/$id"
                      params={{ id: d.id }}
                      className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10"
                    >
                      Détails <ChevronRight className="h-3 w-3" />
                    </Link>
                    {d.status === "pending" && (
                      <button 
                         onClick={() => verify(d.id)}
                         className="rounded-md bg-emerald-500/20 px-2.5 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/30"
                      >
                         Vérifier
                      </button>
                    )}
                    <button 
                      onClick={() => toggleStatus(d.id, d.isActive)}
                      className={`rounded-md px-2.5 py-1.5 text-xs ${d.isActive ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30" : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"}`}
                    >
                      {d.isActive ? "Bloquer" : "Activer"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination page={page} pageCount={pageCount} onPage={setPage} total={filtered.length} />
      </TableShell>
    </div>
  );
}
