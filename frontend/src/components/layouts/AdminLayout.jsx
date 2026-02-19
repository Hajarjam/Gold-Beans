import { Link, Outlet, useLocation} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import LogoutButton from "../common/LogoutButton";

const API_URL = process.env.REACT_APP_API_URLL;


export default function AdminLayout() {

  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "" });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    async function loadMe() {
      try {
        const r = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.message || "Erreur /me");
        setForm({ firstName: data.firstName || "", lastName: data.lastName || "" });
      } catch (e) {
        console.error(e);
      }
    }
    if (token) loadMe();
  }, [token]);

  const initials = useMemo(() => {
    const a = (form.firstName || "").trim().slice(0, 1).toUpperCase();
    const b = (form.lastName || "").trim().slice(0, 1).toUpperCase();
    return a + b || "AD";
  }, [form.firstName, form.lastName]);

  const isActive = (to) => pathname === to || pathname.startsWith(to + "/");

  const nav = [
    { label: "Dashboard", to: "/admin/dashboard", Icon: DashboardIcon },
    { label: "Users", to: "/admin/users", Icon: UsersIcon },
    { label: "Coffees", to: "/admin/coffees", Icon: ProductsIcon },
    { label: "Machines", to: "/admin/machines", Icon: MachinesIcon },
    { label: "Orders", to: "/admin/orders", Icon: OrdersIcon },
    { label: "Subscription", to: "/admin/subscription", Icon: SubscriptionIcon },
  ];

  const SidebarContent = ({ onNavigate }) => (
    <div className="rounded-3xl border border-[#EADFD7] bg-white shadow-sm p-4 flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-12 h-12 rounded-2xl bg-[#F6EEE7] border border-[#EADFD7] flex items-center justify-center">
          <img src="/assets/logo2.png" alt="logo" className="w-8 h-8 object-contain" />
        </div>
        <div className="leading-tight">
          <div className="font-extrabold">Admin Panel</div>
          <div className="text-xs text-[#3B170D]/55">Coffee Shop</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-6 flex flex-col gap-1">
        {nav.map(({ label, to, Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => onNavigate?.()}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition",
                active ? "bg-[#3B170D] text-white shadow-sm" : "text-[#3B170D]/80 hover:bg-[#F6EEE7]",
              ].join(" ")}
            >
              <span
                className={[
                  "w-9 h-9 rounded-xl grid place-items-center",
                  active ? "bg-white/10" : "bg-[#F6EEE7] border border-[#EADFD7]",
                ].join(" ")}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout — uses LogoutButton with icon+label as children */}
      <LogoutButton
        redirectTo="/login"
        onBeforeOpen={() => onNavigate?.()}
        className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[#3B170D]/80 hover:bg-red-50 hover:text-red-700 transition"
      >
        <span className="w-9 h-9 rounded-xl grid place-items-center bg-[#F6EEE7] border border-[#EADFD7]">
          <LogoutIcon className="w-5 h-5" />
        </span>
        <span className="font-semibold">Log Out</span>
      </LogoutButton>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6EEE7] text-[#3B170D] flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-[260px] p-5">
        <div className="h-[calc(100vh-40px)]">
          <SidebarContent />
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[290px] p-4">
            <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 p-4 lg:pr-5 lg:py-5">
        <div className="rounded-3xl border border-[#EADFD7] bg-white shadow-sm">
          {/* TOPBAR */}
          <div className="h-16 lg:h-20 px-4 lg:px-6 flex items-center justify-between border-b border-[#EADFD7]">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden w-10 h-10 rounded-2xl border border-[#EADFD7] bg-[#F6EEE7] grid place-items-center"
                onClick={() => setMobileMenuOpen(true)}
                type="button"
                title="Menu"
              >
                <MenuIcon className="w-6 h-6 text-[#3B170D]" />
              </button>
              <div className="leading-tight">
                <div className="text-base sm:text-lg lg:text-xl font-extrabold">
                  Hello {form.firstName} {form.lastName}
                </div>
                <div className="hidden sm:block text-xs text-[#3B170D]/55">
                  Manage your store from here.
                </div>
              </div>
            </div>

            <Link
              to="/admin/me"
              className="flex items-center gap-3 rounded-2xl border border-[#EADFD7] bg-[#F6EEE7] px-3 py-2 hover:opacity-90 transition"
              title="Profile"
            >
              <div className="w-9 h-9 rounded-xl bg-[#3B170D] text-white grid place-items-center font-extrabold">
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-extrabold">Profile</div>
                <div className="text-[11px] text-[#3B170D]/60">View & edit</div>
              </div>
            </Link>
          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
const DashboardIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9v9a2 2 0 01-2 2h-4a2 2 0 01-2-2V12H9v7a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);
const UsersIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 110-8 4 4 0 010 8z" />
  </svg>
);
const ProductsIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a3 3 0 010 6h-1m-2 4H6a4 4 0 01-4-4V6h18v8a4 4 0 01-4 4z" />
  </svg>
);
const MachinesIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17h6m-7 4h8a2 2 0 002-2v-6a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2zM9 7h6m-7 4h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2z" />
  </svg>
);
const OrdersIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);
const SubscriptionIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l2 2 4-4" />
  </svg>
);
const LogoutIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
  </svg>
);
const MenuIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);