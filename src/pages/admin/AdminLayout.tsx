import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "../../components/admin/Sidebar";
import { Topbar } from "../../components/admin/Topbar";
import { AppToaster } from "../../components/admin/Toaster";

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <AppToaster />
    </div>
  );
}
