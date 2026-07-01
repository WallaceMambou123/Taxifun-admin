import { useMemo, useState } from "react";
import { Check, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { TxStatusBadge, TxTypeBadge } from "../../components/admin/StatusBadge";
import { FilterChip, Pagination, TableShell } from "../../components/admin/DataTableShell";
import { useTransactions } from "../../hooks/useAdminData";
import { type TxType } from "../../lib/mock-data";
import api from "../../lib/api-client";
import { useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 10;
const TYPES: (TxType | "all")[] = ["all", "Topup", "Payment", "Commission", "Withdrawal"];

export function Finance() {
  const queryClient = useQueryClient();
  const { data: transactions = [], isLoading } = useTransactions();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TxType | "all">("all");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const totals = useMemo(() => {
    const sum = (type: string) => transactions.filter((t: any) => t.type === type).reduce((s: number, t: any) => s + t.amount, 0);
    return { Topup: sum("TOPUP"), Payment: sum("PAYMENT"), Commission: sum("COMMISSION"), Withdrawal: sum("WITHDRAWAL") };
  }, [transactions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transactions
      .filter((t: any) => (filter === "all" ? true : t.type === filter.toUpperCase()))
      .filter((t: any) => !q || t.user.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q));
  }, [search, filter, transactions]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pendingWithdrawals = transactions.filter((t: any) => t.type === "WITHDRAWAL" && t.status === "PENDING");

  const updateStatus = async (id: string, status: "SUCCESS" | "FAILED") => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/management/transactions/${id}/status`, { status });
      toast.success(status === "SUCCESS" ? "Opération réussie" : "Opération rejetée");
      queryClient.invalidateQueries({ queryKey: ["admin", "transactions"] });
    } catch (e) {
      toast.error("Échec de l'opération");
    } finally {
      setActionLoading(null);
    }
  };

  const approve = (id: string) => updateStatus(id, "SUCCESS");
  const reject = (id: string) => updateStatus(id, "FAILED");

  const cards = [
    { label: "Recharges", value: totals.Topup, color: "from-sky-400 to-cyan-600" },
    { label: "Paiements", value: totals.Payment, color: "from-emerald-400 to-teal-600" },
    { label: "Commissions", value: totals.Commission, color: "from-primary to-amber-600" },
    { label: "Retraits", value: totals.Withdrawal, color: "from-violet-400 to-fuchsia-600" },
  ];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Finance</h1>
        <p className="text-sm text-muted-foreground">Wallets, transactions et validation des retraits.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass relative overflow-hidden rounded-2xl p-5">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-2xl`} />
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
            <div className="mt-2 font-display text-2xl font-bold tabular-nums">
              XAF {c.value.toLocaleString("fr-FR")}
            </div>
          </div>
        ))}
      </div>

      <section className="glass rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/5 p-5">
          <div>
            <h2 className="font-display text-lg font-semibold">Demandes de retrait à valider</h2>
            <p className="text-xs text-muted-foreground">{pendingWithdrawals.length} demandes en attente</p>
          </div>
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        {pendingWithdrawals.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Aucune demande en attente.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {pendingWithdrawals.map((t:any) => (
              <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 sm:flex sm:justify-between">
                <div className="min-w-0">
                  <div className="truncate font-medium">{t.user}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.reference} · {t.date}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="text-right font-semibold tabular-nums">XAF {t.amount.toLocaleString()}</div>
                  <button 
                    onClick={() => approve(t.id)} 
                    disabled={actionLoading === t.id}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50" 
                    aria-label="Approuver"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => reject(t.id)} 
                    disabled={actionLoading === t.id}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 disabled:opacity-50" 
                    aria-label="Rejeter"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <TableShell
        title="Historique des transactions"
        description="Topup, Payment, Commission, Withdrawal"
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        filters={
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <FilterChip key={t} active={filter === t} onClick={() => { setFilter(t); setPage(1); }}>
                {t === "all" ? "Tous" : t}
              </FilterChip>
            ))}
          </div>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Référence</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Utilisateur</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {view.map((t:any) => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-mono text-xs">{t.reference}</td>
                <td className="px-5 py-3.5"><TxTypeBadge type={t.type} /></td>
                <td className="px-5 py-3.5">
                  <div className="font-medium">{t.user}</div>
                  <div className="text-xs text-muted-foreground capitalize">{t.role}</div>
                </td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.date}</td>
                <td className="px-5 py-3.5"><TxStatusBadge status={t.status} /></td>
                <td className="px-5 py-3.5 text-right tabular-nums font-semibold">XAF {t.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} pageCount={pageCount} onPage={setPage} total={filtered.length} />
      </TableShell>
    </div>
  );
}
