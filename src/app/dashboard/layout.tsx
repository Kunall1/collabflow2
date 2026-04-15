import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-h-screen">
        <Header />
        {children}
      </main>
    </div>
  );
}
