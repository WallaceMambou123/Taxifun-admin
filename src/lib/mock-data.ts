export type DriverStatus = "verified" | "pending" | "blocked";
export type TripStatus = "REQUESTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TxType = "Topup" | "Payment" | "Commission" | "Withdrawal";
export type TxStatus = "completed" | "pending" | "failed";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: DriverStatus;
  rating: number;
  trips: number;
  wallet: number;
  joined: string;
  vehicle: { model: string; color: string; plate: string; year: number };
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  trips: number;
  wallet: number;
  joined: string;
}

export interface Trip {
  id: string;
  status: TripStatus;
  price: number;
  distance: number;
  duration: number;
  from: string;
  to: string;
  driverId: string;
  driverName: string;
  customerId: string;
  customerName: string;
  date: string;
}

export interface Transaction {
  id: string;
  type: TxType;
  status: TxStatus;
  amount: number;
  user: string;
  role: "driver" | "customer";
  date: string;
  reference: string;
}

export interface Review {
  id: string;
  author: string;
  authorRole: "driver" | "customer";
  target: string;
  rating: number;
  comment: string;
  tripId: string;
  date: string;
}

const FIRST = ["Amine", "Sofia", "Karim", "Léa", "Yanis", "Nora", "Mehdi", "Inès", "Rayan", "Imane", "Adam", "Sara", "Ilyes", "Lina", "Walid", "Hana"];
const LAST = ["Bensaid", "Cherif", "Hadj", "Mansour", "Belkacem", "Ferhat", "Saidi", "Naceri", "Bouzid", "Khelifi", "Larbi", "Zerrouki"];
const CARS = [
  { model: "Tesla Model 3", color: "Blanc" },
  { model: "Mercedes Classe E", color: "Noir" },
  { model: "BMW Série 5", color: "Gris" },
  { model: "Audi A6", color: "Bleu nuit" },
  { model: "Peugeot 508", color: "Argent" },
  { model: "Toyota Camry", color: "Noir" },
  { model: "Renault Talisman", color: "Blanc" },
];
const ADDRESSES = [
  "Aéroport CDG, Terminal 2", "Gare de Lyon, Paris", "La Défense, Tour First",
  "Champs-Élysées, 75008", "Montmartre, Sacré-Cœur", "Boulogne-Billancourt",
  "Saint-Germain-des-Prés", "Bastille, République", "Porte Maillot",
  "Issy-les-Moulineaux", "Neuilly-sur-Seine", "Levallois-Perret",
];

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
const r = rng(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];
const num = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;
const dec = (min: number, max: number, d = 1) => +(r() * (max - min) + min).toFixed(d);

const statuses: DriverStatus[] = ["verified", "verified", "verified", "pending", "blocked"];

export const drivers: Driver[] = Array.from({ length: 32 }, (_, i) => {
  const car = pick(CARS);
  const first = pick(FIRST);
  const last = pick(LAST);
  return {
    id: `DRV-${1000 + i}`,
    name: `${first} ${last}`,
    phone: `+33 6 ${num(10, 99)} ${num(10, 99)} ${num(10, 99)} ${num(10, 99)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@taxifun.io`,
    status: pick(statuses),
    rating: dec(3.8, 5, 2),
    trips: num(15, 840),
    wallet: dec(20, 2400, 2),
    joined: `2024-${String(num(1, 12)).padStart(2, "0")}-${String(num(1, 28)).padStart(2, "0")}`,
    vehicle: {
      model: car.model,
      color: car.color,
      plate: `${["AA","BB","CC","DD","EE"][num(0,4)]}-${num(100,999)}-${["XY","ZK","RT","MN"][num(0,3)]}`,
      year: num(2019, 2025),
    },
  };
});

export const customers: Customer[] = Array.from({ length: 28 }, (_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  return {
    id: `CUS-${2000 + i}`,
    name: `${first} ${last}`,
    phone: `+33 7 ${num(10, 99)} ${num(10, 99)} ${num(10, 99)} ${num(10, 99)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@mail.com`,
    rating: dec(3.5, 5, 2),
    trips: num(1, 180),
    wallet: dec(0, 480, 2),
    joined: `2024-${String(num(1, 12)).padStart(2, "0")}-${String(num(1, 28)).padStart(2, "0")}`,
  };
});

const tripStatuses: TripStatus[] = ["COMPLETED", "COMPLETED", "COMPLETED", "IN_PROGRESS", "ACCEPTED", "REQUESTED", "CANCELLED"];
export const trips: Trip[] = Array.from({ length: 60 }, (_, i) => {
  const d = drivers[num(0, drivers.length - 1)];
  const c = customers[num(0, customers.length - 1)];
  return {
    id: `TRP-${5000 + i}`,
    status: pick(tripStatuses),
    price: dec(8, 95, 2),
    distance: dec(1.2, 42, 1),
    duration: num(5, 75),
    from: pick(ADDRESSES),
    to: pick(ADDRESSES),
    driverId: d.id,
    driverName: d.name,
    customerId: c.id,
    customerName: c.name,
    date: `2025-06-${String(num(1, 16)).padStart(2, "0")} ${String(num(6, 23)).padStart(2, "0")}:${String(num(0, 59)).padStart(2, "0")}`,
  };
});

const txTypes: TxType[] = ["Topup", "Payment", "Commission", "Withdrawal"];
const txStatuses: TxStatus[] = ["completed", "completed", "completed", "pending", "failed"];
export const transactions: Transaction[] = Array.from({ length: 80 }, (_, i) => {
  const type = pick(txTypes);
  const isDriver = type !== "Topup";
  const u = isDriver ? drivers[num(0, drivers.length - 1)] : customers[num(0, customers.length - 1)];
  return {
    id: `TX-${9000 + i}`,
    type,
    status: type === "Withdrawal" ? pick(["pending", "completed", "pending"] as TxStatus[]) : pick(txStatuses),
    amount: dec(5, 320, 2),
    user: u.name,
    role: isDriver ? "driver" : "customer",
    date: `2025-06-${String(num(1, 16)).padStart(2, "0")}`,
    reference: `REF${num(100000, 999999)}`,
  };
});

const comments = [
  "Chauffeur très ponctuel et véhicule impeccable.",
  "Conduite souple, trajet agréable.",
  "Client courtois, à recommander.",
  "Excellent service, je recommande vivement.",
  "Un peu en retard mais sympathique.",
  "Parfait du début à la fin.",
  "Très professionnel et discret.",
  "Trajet rapide, GPS bien utilisé.",
  "Voiture propre et confortable.",
  "Communication claire, top !",
];

export const reviews: Review[] = Array.from({ length: 24 }, (_, i) => {
  const t = trips[num(0, trips.length - 1)];
  const fromDriver = r() > 0.5;
  return {
    id: `REV-${7000 + i}`,
    author: fromDriver ? t.driverName : t.customerName,
    authorRole: fromDriver ? "driver" : "customer",
    target: fromDriver ? t.customerName : t.driverName,
    rating: num(3, 5),
    comment: pick(comments),
    tripId: t.id,
    date: t.date.split(" ")[0],
  };
});

export const monthlyGrowth = [
  { month: "Jan", revenue: 28400, trips: 1820, drivers: 42 },
  { month: "Fév", revenue: 31200, trips: 2010, drivers: 48 },
  { month: "Mar", revenue: 35800, trips: 2380, drivers: 55 },
  { month: "Avr", revenue: 39100, trips: 2640, drivers: 61 },
  { month: "Mai", revenue: 44600, trips: 3025, drivers: 72 },
  { month: "Juin", revenue: 51200, trips: 3480, drivers: 84 },
];

export const dailyTrips = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}/06`,
  completed: num(80, 220),
  cancelled: num(5, 28),
}));

export const stats = {
  revenue: 51280.45,
  revenueDelta: 12.4,
  tripsToday: 312,
  tripsDelta: 8.1,
  newDrivers: 14,
  newDriversDelta: 22.0,
  pendingTx: transactions.filter((t) => t.status === "pending").length,
  pendingTxDelta: -3.2,
};
