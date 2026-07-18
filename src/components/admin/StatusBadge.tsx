import { cn } from "../../lib/utils";
import type { DriverStatus, TripStatus, TxStatus, TxType } from "../../lib/mock-data";

type BadgeInfo = { label: string; cls: string };

const FALLBACK: BadgeInfo = {
  label: "Inconnu",
  cls: "bg-white/10 text-muted-foreground border-white/20",
};

const driverMap: Record<DriverStatus, BadgeInfo> = {
  verified: { label: "Vérifié", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  pending: { label: "En attente", cls: "bg-amber-500/15 text-amber-300 border-amber-400/30" },
  blocked: { label: "Bloqué", cls: "bg-rose-500/15 text-rose-300 border-rose-400/30" },
};

const tripMap: Record<TripStatus, BadgeInfo> = {
  REQUESTED: { label: "Demandé", cls: "bg-sky-500/15 text-sky-300 border-sky-400/30" },
  NOT_FOUND: { label: "Introuvable", cls: "bg-orange-500/15 text-orange-300 border-orange-400/30" },
  ACCEPTED: { label: "Accepté", cls: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30" },
  AT_PICKUP: { label: "Au point de prise", cls: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30" },
  IN_PROGRESS: { label: "En cours", cls: "bg-amber-500/15 text-amber-300 border-amber-400/30" },
  COMPLETED: { label: "Terminé", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  CANCELLED_BY_CLIENT: { label: "Annulé (client)", cls: "bg-rose-500/15 text-rose-300 border-rose-400/30" },
  CANCELLED_BY_DRIVER: { label: "Annulé (chauffeur)", cls: "bg-rose-500/15 text-rose-300 border-rose-400/30" },
};

const txStatusMap: Record<TxStatus, BadgeInfo> = {
  PENDING: { label: "En attente", cls: "bg-amber-500/15 text-amber-300 border-amber-400/30" },
  SUCCESS: { label: "Réussi", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  FAILED: { label: "Échoué", cls: "bg-rose-500/15 text-rose-300 border-rose-400/30" },
  CANCELLED: { label: "Annulé", cls: "bg-white/10 text-muted-foreground border-white/20" },
  REFUNDED: { label: "Remboursé", cls: "bg-violet-500/15 text-violet-300 border-violet-400/30" },
};

const txTypeMap: Record<TxType, BadgeInfo> = {
  TOPUP: { label: "Recharge", cls: "bg-sky-500/15 text-sky-300 border-sky-400/30" },
  PAYMENT: { label: "Paiement", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  COMMISSION: { label: "Commission", cls: "bg-primary/15 text-primary border-primary/30" },
  WITHDRAWAL: { label: "Retrait", cls: "bg-violet-500/15 text-violet-300 border-violet-400/30" },
};

function resolve(map: Record<string, BadgeInfo>, key: string | undefined | null): BadgeInfo {
  if (!key) return FALLBACK;
  return map[key] ?? { ...FALLBACK, label: key };
}

function Pill({ label, cls }: BadgeInfo) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        cls,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

export function DriverStatusBadge({ status }: { status: DriverStatus | string }) {
  const { label, cls } = resolve(driverMap, status);
  return <Pill label={label} cls={cls} />;
}

export function TripStatusBadge({ status }: { status: TripStatus | string }) {
  const { label, cls } = resolve(tripMap, status);
  return <Pill label={label} cls={cls} />;
}

export function TxStatusBadge({ status }: { status: TxStatus | string }) {
  const { label, cls } = resolve(txStatusMap, status);
  return <Pill label={label} cls={cls} />;
}

export function TxTypeBadge({ type }: { type: TxType | string }) {
  const { label, cls } = resolve(txTypeMap, type);
  return (
    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", cls)}>
      {label}
    </span>
  );
}
