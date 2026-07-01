import { Banknote, Car, TrendingDown, TrendingUp, UserPlus, Wallet } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { TripStatusBadge, TxStatusBadge, TxTypeBadge } from "../../components/admin/StatusBadge";
import { useDashboardActivity, useDashboardGrowth, useDashboardStats } from "../../hooks/useAdminData";

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activity, isLoading: activityLoading } = useDashboardActivity();
  const { data: growth, isLoading: growthLoading } = useDashboardGrowth();

  if (statsLoading || activityLoading || growthLoading) {
    return <div className="grid h-64 place-items-center text-muted-foreground">Chargement des données...</div>;
  }

  const cards = [
    { label: "Bénéfices totaux", value: `XAF ${stats.revenue.toLocaleString("fr-FR")}`, delta: stats.revenueDelta, icon: Banknote, accent: "from-primary to-amber-600" },
    { label: "Trajets aujourd'hui", value: stats.tripsToday.toString(), delta: stats.tripsDelta, icon: Car, accent: "from-sky-400 to-cyan-600" },
    { label: "Nouveaux chauffeurs", value: `+${stats.newDrivers}`, delta: stats.newDriversDelta, icon: UserPlus, accent: "from-emerald-400 to-teal-600" },
    { label: "Transactions en attente", value: stats.pendingTx.toString(), delta: stats.pendingTxDelta, icon: Wallet, accent: "from-violet-400 to-fuchsia-600" },
  ];

  const recent = activity?.recentTrips || [];
  const recentTx = activity?.recentTransactions || [];


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Vue d'ensemble</h1>
        <p className="text-sm text-muted-foreground">
          Pilotez votre flotte en temps réel — mardi 16 juin 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const positive = c.delta >= 0;
          return (
            <div key={c.label} className="glass relative overflow-hidden rounded-2xl p-5">
              <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${c.accent} opacity-20 blur-2xl`} />
              <div className="flex items-start justify-between">
                <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.accent} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-300" : "text-rose-300"}`}>
                  {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {positive ? "+" : ""}{c.delta}%
                </span>
              </div>
              <div className="mt-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="mt-1 font-display text-2xl font-bold">{c.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="glass rounded-2xl p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Croissance mensuelle</h2>
              <p className="text-xs text-muted-foreground">Revenus et trajets sur 6 mois</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Revenus</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-400" /> Trajets</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={growth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.74 0.15 220)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.74 0.15 220)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="month" stroke="oklch(0.72 0.025 260)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.025 260)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.2 0.03 265 / 0.95)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, color: "white" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="trips" stroke="oklch(0.74 0.15 220)" strokeWidth={2.5} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold">Trajets sur 14 jours</h2>
          <p className="text-xs text-muted-foreground">Terminés vs annulés</p>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={[]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="oklch(0.72 0.025 260)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.025 260)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.03 265 / 0.95)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Bar dataKey="completed" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="cancelled" fill="oklch(0.66 0.22 22)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="glass rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/5 p-5">
            <h2 className="font-display text-base font-semibold">Trajets récents</h2>
            <span className="text-xs text-muted-foreground">Dernières activités</span>
          </div>
          <ul className="divide-y divide-white/5">
            {recent.map((t:any) => (
              <li key={t.id} className="flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/5">
                  <Car className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{t.from} → {t.to}</span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {t.driverName} · {t.customerName} · {t.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">XAF {t.price?.toLocaleString()}</div>
                  <TripStatusBadge status={t.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/5 p-5">
            <h2 className="font-display text-base font-semibold">Dernières transactions</h2>
            <span className="text-xs text-muted-foreground">Flux financier</span>
          </div>
          <ul className="divide-y divide-white/5">
            {recentTx.map((t:any) => (
              <li key={t.id} className="flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/5">
                  <Wallet className="h-4 w-4 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <TxTypeBadge type={t.type} />
                    <span className="truncate text-sm font-medium">{t.user}</span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {t.reference} · {t.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">XAF {t.amount?.toLocaleString()}</div>
                  <TxStatusBadge status={t.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
