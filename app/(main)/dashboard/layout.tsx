"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="">{children}</div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
