import { Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function AppShell() {
  const { user, rank } = useAuth();
  if (!user) return null;
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[480px] flex-col bg-bg shadow-[0_0_60px_rgba(13,79,60,0.06)]">
      <Header user={user} rank={rank} />
      <main className="flex-1 overflow-y-auto px-3.5 pt-[18px] pb-5">
        <Outlet />
      </main>
      <BottomNav />
      {/* InstallButton & SwUpdateBanner sekarang di-mount global di App.tsx */}
    </div>
  );
}
