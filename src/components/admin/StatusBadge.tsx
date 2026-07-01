import { cn } from "../../lib/utils";
import type { DriverStatus, TripStatus, TxStatus, TxType } from "../../lib/mock-data";

const driverMap: Record<DriverStatus, { label: string; cls: string }> = {
  verified: { label: "Vérifié", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  pending: { label: "En attente", cls: "bg-amber-500/15 text-amber-300 border-amber-400/30" },
  blocked: { label: "Bloqué", cls: "bg-rose-500/15 text-rose-300 border-rose-400/30" },
};

const tripMap: Record<TripStatus, { label: string; cls: string }> = {
  REQUESTED: { label: "Demandé", cls: "bg-sky-500/15 text-sky-300 border-sky-400/30" },
  ACCEPTED: { label: "Accepté", cls: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30" },
  IN_PROGRESS: { label: "En cours", cls: "bg-amber-500/15 text-amber-300 border-amber-400/30" },
  COMPLETED: { label: "Terminé", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  CANCELLED: { label: "Annulé", cls: "bg-rose-500/15 text-rose-300 border-rose-400/30" },
};

const txStatusMap: Record<TxStatus, { label: string; cls: string }> = {
  completed: { label: "Complété", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  pending: { label: "En attente", cls: "bg-amber-500/15 text-amber-300 border-amber-400/30" },
  failed: { label: "Échoué", cls: "bg-rose-500/15 text-rose-300 border-rose-400/30" },
};

const txTypeMap: Record<TxType, string> = {
  Topup: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  Payment: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Commission: "bg-primary/15 text-primary border-primary/30",
  Withdrawal: "bg-violet-500/15 text-violet-300 border-violet-400/30",
};

function Pill({ label, cls }: { label: string; cls: string }) {
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

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  const { label, cls } = driverMap[status];
  return <Pill label={label} cls={cls} />;
}
export function TripStatusBadge({ status }: { status: TripStatus }) {
  const { label, cls } = tripMap[status];
  return <Pill label={label} cls={cls} />;
}
export function TxStatusBadge({ status }: { status: TxStatus }) {
  const { label, cls } = txStatusMap[status];
  return <Pill label={label} cls={cls} />;
}
export function TxTypeBadge({ type }: { type: TxType }) {
  return (
    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", txTypeMap[type])}>
      {type}
    </span>
  );
}
