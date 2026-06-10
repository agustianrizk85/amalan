import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ToastProvider } from "@/lib/toast";
import { SettingsProvider } from "@/lib/settings";
import { AppConfigProvider } from "@/lib/app-config";
import { useBackTrap } from "@/lib/use-back-trap";
import AppShell from "@/components/AppShell";
import InstallButton from "@/components/InstallButton";
import SwUpdateBanner from "@/components/SwUpdateBanner";
import ContactButton from "@/components/ContactButton";
import AuthPage from "@/pages/AuthPage";
import HomePage from "@/pages/HomePage";
import AmalanPage from "@/pages/AmalanPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import RiwayatPage from "@/pages/RiwayatPage";
import ProfilPage from "@/pages/ProfilPage";
import SettingsPage from "@/pages/SettingsPage";
import JadwalPage from "@/pages/JadwalPage";
import KiblatPage from "@/pages/KiblatPage";
import JuzDiriPage from "@/pages/JuzDiriPage";
import AdminPoinPage from "@/pages/AdminPoinPage";
import AdminAppConfigPage from "@/pages/AdminAppConfigPage";
import EditProfilePage from "@/pages/EditProfilePage";
import SholatPage from "@/pages/SholatPage";
import HaidPage from "@/pages/HaidPage";
import PuasaPage from "@/pages/PuasaPage";
import DzikirPage from "@/pages/DzikirPage";

function Gated({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg text-[14px] text-mu">
        Memuat...
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/beranda" replace /> : <AuthPage />;
}

// Mount back-trap hook di dalam Router context.
// Komponen ini tidak render apapun, hanya side-effect (intercept tombol back).
function BackTrap() {
  useBackTrap();
  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <AppConfigProvider>
          <AuthProvider>
            <BackTrap />
            <Routes>
              <Route path="/" element={<RootRedirect />} />

              {/* Halaman penuh layar (tanpa BottomNav) */}
              <Route path="/beranda" element={<Gated><HomePage /></Gated>} />
              <Route path="/pengaturan" element={<Gated><SettingsPage /></Gated>} />
              <Route path="/jadwal" element={<Gated><JadwalPage /></Gated>} />
              <Route path="/kiblat" element={<Gated><KiblatPage /></Gated>} />
              <Route path="/juz-diri" element={<Gated><JuzDiriPage /></Gated>} />
              <Route path="/admin/poin" element={<Gated><AdminPoinPage /></Gated>} />
              <Route path="/admin/app-config" element={<Gated><AdminAppConfigPage /></Gated>} />
              <Route path="/profil/edit" element={<Gated><EditProfilePage /></Gated>} />
              <Route path="/sholat" element={<Gated><SholatPage /></Gated>} />
              <Route path="/haid" element={<Gated><HaidPage /></Gated>} />
              <Route path="/puasa" element={<Gated><PuasaPage /></Gated>} />
              <Route path="/dzikir" element={<Gated><DzikirPage /></Gated>} />

              {/* Halaman utama dengan BottomNav */}
              <Route
                element={
                  <Gated>
                    <AppShell />
                  </Gated>
                }
              >
                <Route path="/amalan" element={<AmalanPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/riwayat" element={<RiwayatPage />} />
                <Route path="/profil" element={<ProfilPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {/* Global overlay — tampil di SEMUA halaman, termasuk HomePage
                yang tidak di-wrap AppShell. */}
            <InstallButton />
            <SwUpdateBanner />
            <ContactButton />
          </AuthProvider>
        </AppConfigProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
