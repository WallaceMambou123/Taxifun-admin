import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api-client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/management/dashboard/stats");
      return data;
    },
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ["admin", "activity"],
    queryFn: async () => {
      const { data } = await api.get("/admin/management/dashboard/activity");
      return data;
    },
  });
}

export function useDashboardGrowth() {
  return useQuery({
    queryKey: ["admin", "growth"],
    queryFn: async () => {
      const { data } = await api.get("/admin/management/dashboard/growth");
      return data;
    },
  });
}

export function useDrivers() {
  return useQuery({
    queryKey: ["admin", "drivers"],
    queryFn: async () => {
      const { data } = await api.get("/admin/management/drivers");
      return data.map((d: any) => ({
        ...d,
        name: `${d.firstName || ""} ${d.lastName || ""}`.trim() || d.phoneNumber,
        status: !d.isActive ? "blocked" : d.isVerified ? "verified" : "pending",
        phone: d.phoneNumber,
        rating: Number(d.rating || 0),
        trips: d._count?.trips || 0,
        wallet: Number(d.wallet?.balance || 0),
        vehicle: {
          model: d.carModel || "N/A",
          color: d.carColor || "N/A",
          plate: d.taxiPlate || "N/A",
        }
      }));
    },
  });
}

export function useClients() {
  return useQuery({
    queryKey: ["admin", "clients"],
    queryFn: async () => {
      const { data } = await api.get("/admin/management/clients");
      return data.map((c: any) => ({
        ...c,
        name: `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.phoneNumber,
        phone: c.phoneNumber,
        rating: Number(c.rating || 0),
        trips: c._count?.trips || 0,
        wallet: Number(c.wallet?.balance || 0),
        joined: c.createdAt,
      }));
    },
  });
}

export function useTrips() {
  return useQuery({
    queryKey: ["admin", "trips"],
    queryFn: async () => {
      const { data } = await api.get("/admin/management/trips");
      return data.map((t: any) => ({
        ...t,
        from: t.pickupAddress,
        to: t.dropoffAddress,
        driverName: t.driver ? `${t.driver.firstName} ${t.driver.lastName}` : "En recherche",
        customerName: `${t.client.firstName} ${t.client.lastName}`,
        price: Number(t.price || 0),
        date: t.createdAt,
        distance: t.distanceKm || 0,
        duration: t.estimatedDurationMin || 0,
      }));
    },
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["admin", "transactions"],
    queryFn: async () => {
      const { data } = await api.get("/admin/management/dashboard/activity");
      // On utilise les transactions récentes pour l'instant, 
      // idéalement on aurait un endpoint /admin/management/transactions
      return data.recentTransactions;
    },
  });
}

export function useVerifyDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/admin/management/drivers/${id}/verify`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
    },
  });
}

export function useToggleDriverStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await api.patch(`/admin/management/drivers/${id}/status`, { isActive });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
    },
  });
}

