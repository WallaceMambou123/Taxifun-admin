import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Pagination, TableShell } from "../../components/admin/DataTableShell";
import { useClients } from "../../hooks/useAdminData";

const PAGE_SIZE = 10;

export function Customers() {
  const { data: customers = [], isLoading } = useClients();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((c:any) => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [search, customers]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Clients</h1>
        <p className="text-sm text-muted-foreground">{customers.length} clients actifs sur la plateforme.</p>
      </div>

      <TableShell
        title="Base clients"
        description="Notes, trajets effectués et soldes de portefeuille"
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Note</th>
              <th className="px-5 py-3">Trajets</th>
              <th className="px-5 py-3 text-right">Portefeuille</th>
            </tr>
          </thead>
          <tbody>
            {view.map((c:any) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent/40 to-violet-500/40 text-xs font-bold">
                      {c.name.split(" ").map((s:any) => s[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{c.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{c.id} · inscrit {c.joined}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">
                  <div>{c.phone}</div>
                  <div>{c.email}</div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {c.rating.toFixed(2)}
                  </span>
                </td>
                <td className="px-5 py-3.5 tabular-nums">{c.trips}</td>
                <td className="px-5 py-3.5 text-right tabular-nums font-semibold">XAF {c.wallet.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} pageCount={pageCount} onPage={setPage} total={filtered.length} />
      </TableShell>
    </div>
  );
}
