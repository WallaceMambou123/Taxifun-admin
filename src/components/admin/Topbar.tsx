import { Bell, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/5 bg-background/40 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Rechercher chauffeur, client, trajet…"
          className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary glow" />
        </button>
        <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-primary to-amber-600 text-xs font-bold text-primary-foreground">
              TA
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left leading-tight sm:block">
            <div className="text-xs font-semibold">Tarik Admin</div>
            <div className="text-[10px] text-muted-foreground">Super-admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
