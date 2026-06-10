import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

const Item = ({ to, label, icon }: { to: string; label: string; icon: ReactNode }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex flex-1 flex-col items-center justify-center gap-[4px] px-1.5 py-3 min-h-[64px] text-[13px] font-semibold transition-all active:scale-95 ${
        isActive ? "text-g [&_svg]:scale-110" : "text-mu"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const ic = (path: ReactNode) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform"
  >
    {path}
  </svg>
);

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 flex border-t border-[rgba(13,79,60,0.13)] bg-white shadow-[0_-3px_16px_rgba(13,79,60,0.07)] pb-[env(safe-area-inset-bottom)]">
      <Item
        to="/beranda"
        label="Beranda"
        icon={ic(
          <>
            <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />
          </>,
        )}
      />
      <Item
        to="/amalan"
        label="Amalan"
        icon={ic(
          <>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </>,
        )}
      />
      <Item
        to="/leaderboard"
        label="Peringkat"
        icon={ic(
          <>
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
          </>,
        )}
      />
      <Item
        to="/riwayat"
        label="Riwayat"
        icon={ic(
          <>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </>,
        )}
      />
      <Item
        to="/profil"
        label="Profil"
        icon={ic(
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx={12} cy={7} r={4} />
          </>,
        )}
      />
    </nav>
  );
}
