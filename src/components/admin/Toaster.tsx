import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: "oklch(0.22 0.03 265 / 0.9)",
          border: "1px solid oklch(1 0 0 / 0.1)",
          color: "white",
          backdropFilter: "blur(20px)",
        },
      }}
    />
  );
}
