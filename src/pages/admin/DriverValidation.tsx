import { useMemo, useState } from "react";
import { CheckCircle2, FileText, IdCard, Mail, Phone, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { DriverStatusBadge } from "../../components/admin/StatusBadge";
import { useDrivers, useToggleDriverStatus, useVerifyDriver } from "../../hooks/useAdminData";

export function DriverValidation() {
  const { data: drivers = [], isLoading } = useDrivers();
  const { mutate: doVerify, isPending: verifying } = useVerifyDriver();
  const { mutate: doToggleStatus, isPending: rejecting } = useToggleDriverStatus();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const pending = useMemo(() => {
    const q = search.toLowerCase().trim();
    return drivers
      .filter((d: any) => d.status === "pending")
      .filter(
        (d: any) =>
          !q ||
          d.name.toLowerCase().includes(q) ||
          d.phone?.toLowerCase().includes(q) ||
          d.licenseNumber?.toLowerCase().includes(q) ||
          d.vehicle?.plate?.toLowerCase().includes(q),
      );
  }, [drivers, search]);

  const approve = (id: string, name: string) => {
    setBusyId(id);
    doVerify(id, {
      onSuccess: () => toast.success(`${name} a été validé.`),
      onError: () => toast.error("Échec de la validation"),
      onSettled: () => setBusyId(null),
    });
  };

  const reject = (id: string, name: string) => {
    setBusyId(id);
    doToggleStatus(
      { id, isActive: false },
      {
        onSuccess: () => toast.success(`${name} a été rejeté et bloqué.`),
        onError: () => toast.error("Échec du rejet"),
        onSettled: () => setBusyId(null),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="grid h-64 place-items-center text-muted-foreground">
        Chargement des demandes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Validation chauffeurs</h1>
          <p className="text-sm text-muted-foreground">
            Examinez les dossiers et validez les inscriptions avant mise en service.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <ShieldCheck className="h-4 w-4" />
          {pending.length} en attente
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <label className="sr-only" htmlFor="validation-search">
          Rechercher
        </label>
        <input
          id="validation-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, téléphone, permis ou plaque…"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40"
        />
      </div>

      {pending.length === 0 ? (
        <div className="glass grid place-items-center rounded-2xl px-6 py-16 text-center">
          <ShieldCheck className="mb-3 h-10 w-10 text-emerald-400/80" />
          <h2 className="font-display text-lg font-semibold">Aucune demande en attente</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Les nouveaux chauffeurs apparaîtront ici tant qu’ils n’auront pas été validés par un administrateur.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {pending.map((d: any) => {
            const busy = busyId === d.id || verifying || rejecting;
            return (
              <li key={d.id} className="glass overflow-hidden rounded-2xl">
                <div className="grid gap-5 p-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
                  <div className="flex items-center gap-4">
                    {d.photoUrl ? (
                      <img
                        src={d.photoUrl}
                        alt={d.name}
                        className="h-20 w-20 rounded-2xl object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 text-lg font-bold">
                        {d.name
                          .split(" ")
                          .map((s: string) => s[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                    <div className="min-w-0 lg:hidden">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-display text-lg font-semibold">{d.name}</h2>
                        <DriverStatusBadge status={d.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{d.id}</p>
                    </div>
                  </div>

                  <div className="min-w-0 space-y-3">
                    <div className="hidden lg:block">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-display text-xl font-semibold">{d.name}</h2>
                        <DriverStatusBadge status={d.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{d.id}</p>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> {d.phone}
                      </span>
                      {d.email && (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" /> {d.email}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                        <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <IdCard className="h-3 w-3" /> Permis
                        </div>
                        <div className="mt-1 font-mono text-sm">{d.licenseNumber || "—"}</div>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                        <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <FileText className="h-3 w-3" /> Véhicule
                        </div>
                        <div className="mt-1 text-sm">
                          {d.vehicle?.model} · {d.vehicle?.color}
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Plaque</div>
                        <div className="mt-1 font-mono text-sm tracking-wider">{d.vehicle?.plate || "—"}</div>
                      </div>
                    </div>

                    {d.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        Inscrit le{" "}
                        {new Date(d.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => approve(d.id, d.name)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Valider
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => reject(d.id, d.name)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeter
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
