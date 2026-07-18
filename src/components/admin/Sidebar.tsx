import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, UserCog, Car, Wallet, Star, Sparkles, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/validations", label: "Validations", icon: ShieldCheck },
  { to: "/drivers", label: "Chauffeurs", icon: UserCog },
  { to: "/customers", label: "Clients", icon: Users },
  { to: "/trips", label: "Trajets", icon: Car },
  { to: "/finance", label: "Finance", icon: Wallet },
  { to: "/reviews", label: "Avis", icon: Star },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col glass-strong border-r border-white/10 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-6">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-amber-600 glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold tracking-tight">Taxifun</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Admin Console</div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-primary/20 to-primary/5 text-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary glow" />
                )}
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/15 to-accent/10 p-4">
          <div className="text-sm font-semibold">Mode Premium</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Console v2.4 — toutes les opérations sont disponibles.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-muted-foreground">Systèmes en ligne</span>
          </div>
        </div>
      </aside>
    </>
  );
}
