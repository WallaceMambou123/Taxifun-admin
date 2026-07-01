import { useLoaderData, Link } from "@tanstack/react-router";
import { ArrowLeft, Car, CheckCircle2, Mail, Phone, Shield, Star, Wallet, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { drivers, trips } from "../../lib/mock-data";
import { DriverStatusBadge, TripStatusBadge } from "../../components/admin/StatusBadge";

export function DriverDetails() {
  const { driver } = useLoaderData({ from: "/_admin/drivers/$id" }) as { driver: (typeof drivers)[number] };
  const [status, setStatus] = useState(driver.status);
  const driverTrips = trips.filter((t:any) => t.driverId === driver.id).slice(0, 8);

  const approve = () => { setStatus("verified"); toast.success(`${driver.name} a été approuvé.`); };
  const disable = () => { setStatus("blocked"); toast(`${driver.name} a été désactivé.`); };

  return (
    <div className="space-y-6">
      <Link to="/drivers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <div className="glass relative overflow-hidden rounded-2xl p-6">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 opacity-30 blur-3xl" />
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6 sm:flex sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-amber-600 text-xl font-bold text-primary-foreground">
              {driver.name.split(" ").map((s:any) => s[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-display text-2xl font-bold">{driver.name}</h1>
                <DriverStatusBadge status={status} />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {driver.phone}</span>
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {driver.email}</span>
                <span className="inline-flex items-center gap-1"><Shield className="h-3 w-3" /> {driver.id}</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button onClick={approve} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:brightness-110">
              <CheckCircle2 className="h-4 w-4" /> Approuver
            </button>
            <button onClick={disable} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20">
              <XCircle className="h-4 w-4" /> Désactiver
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Car className="h-3.5 w-3.5" /> Véhicule
          </div>
          <div className="mt-3 space-y-2">
            <div className="font-display text-xl font-semibold">{driver.vehicle.model}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-3 w-3 rounded-full border border-white/20" style={{ background: "var(--color-muted)" }} />
              {driver.vehicle.color} · {driver.vehicle.year}
            </div>
            <div className="inline-flex rounded-md border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-sm tracking-wider">
              {driver.vehicle.plate}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" /> Portefeuille
          </div>
          <div className="mt-3">
            <div className="font-display text-3xl font-bold text-gradient-primary">€{driver.wallet.toFixed(2)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Solde disponible</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-[10px] uppercase text-muted-foreground">Commissions ce mois</div>
              <div className="mt-1 font-semibold">€{(driver.wallet * 0.18).toFixed(2)}</div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-[10px] uppercase text-muted-foreground">Retraits</div>
              <div className="mt-1 font-semibold">€{(driver.wallet * 0.42).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Star className="h-3.5 w-3.5" /> Performance
          </div>
          <div className="mt-3 flex items-end gap-2">
            <div className="font-display text-3xl font-bold">{driver.rating.toFixed(2)}</div>
            <div className="pb-1 text-xs text-muted-foreground">/ 5.00</div>
          </div>
          <div className="mt-1 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={i < Math.round(driver.rating) ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground/40"} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-[10px] uppercase text-muted-foreground">Trajets totaux</div>
              <div className="mt-1 font-semibold">{driver.trips}</div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-[10px] uppercase text-muted-foreground">Inscrit le</div>
              <div className="mt-1 font-semibold">{driver.joined}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl">
        <div className="border-b border-white/5 p-5">
          <h2 className="font-display text-lg font-semibold">Derniers trajets</h2>
          <p className="text-xs text-muted-foreground">Les 8 trajets les plus récents de ce chauffeur</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Trajet</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Prix</th>
              </tr>
            </thead>
            <tbody>
              {driverTrips.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Aucun trajet enregistré.</td></tr>
              )}
              {driverTrips.map((t:any) => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="font-medium">{t.from}</div>
                    <div className="text-xs text-muted-foreground">→ {t.to}</div>
                  </td>
                  <td className="px-5 py-3.5">{t.customerName}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3.5"><TripStatusBadge status={t.status} /></td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">€{t.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
