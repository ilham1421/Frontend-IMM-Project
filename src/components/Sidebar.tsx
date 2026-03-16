"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  FileCheck,
  Users,
  UserCog,
  BarChart3,
  Building2,
  CalendarRange,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  group: string;
};

export default function Sidebar({
  role,
}: {
  role: "superadmin" | "admin";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState("");
  const [userKomisariat, setUserKomisariat] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserName(user.nama || "");
      setUserKomisariat(user.komisariat || "");
    } catch {}
  }, []);

  const prefix = role === "superadmin" ? "/superadmin" : "/admin";

  const superadminItems: SidebarItem[] = [
    { label: "Dashboard", href: `${prefix}`, icon: <LayoutDashboard size={20} />, group: "Utama" },
    { label: "Kegiatan", href: `${prefix}/kegiatan`, icon: <CalendarRange size={20} />, group: "Manajemen" },
    { label: "Persyaratan", href: `${prefix}/persyaratan`, icon: <FileCheck size={20} />, group: "Manajemen" },
    { label: "Peserta", href: `${prefix}/peserta`, icon: <Users size={20} />, group: "Manajemen" },
    { label: "Komisariat", href: `${prefix}/komisariat`, icon: <Building2 size={20} />, group: "Manajemen" },
    { label: "Admin PIKOM", href: `${prefix}/admin-pikom`, icon: <UserCog size={20} />, group: "Pengaturan" },
    { label: "Laporan", href: `${prefix}/laporan`, icon: <BarChart3 size={20} />, group: "Pengaturan" },
  ];

  const adminItems: SidebarItem[] = [
    { label: "Dashboard", href: `${prefix}`, icon: <LayoutDashboard size={20} />, group: "Utama" },
    { label: "Kegiatan", href: `${prefix}/kegiatan`, icon: <CalendarRange size={20} />, group: "Kelola" },
    { label: "Pendaftaran", href: `${prefix}/pendaftaran`, icon: <ClipboardList size={20} />, group: "Kelola" },
    { label: "Persyaratan", href: `${prefix}/persyaratan`, icon: <FileCheck size={20} />, group: "Kelola" },
    { label: "Peserta", href: `${prefix}/peserta`, icon: <Users size={20} />, group: "Kelola" },
  ];

  const items = role === "superadmin" ? superadminItems : adminItems;

  // Group items
  const groups: { name: string; items: SidebarItem[] }[] = [];
  items.forEach((item) => {
    const existing = groups.find((g) => g.name === item.group);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({ name: item.group, items: [item] });
    }
  });

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : role === "superadmin" ? "SA" : "AP";

  return (
    <aside
      className={`bg-linear-to-b from-[#111111] to-[#1a1a1a] text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out relative ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className={`px-4 py-5 border-b border-white/6 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="w-9 h-9 rounded-xl bg-imm-red flex items-center justify-center shrink-0 shadow-lg shadow-imm-red/20">
          <Image src="/logo-IMM.png" alt="IMM" width={22} height={22} className="object-contain" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="font-bold text-sm leading-tight tracking-tight">Perkaderan IMM</h2>
            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
              {role === "superadmin" ? "Panel Superadmin" : "Panel Admin PIKOM"}
            </p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-18 w-6 h-6 bg-[#252525] border border-white/8 rounded-full flex items-center justify-center hover:bg-imm-red hover:border-imm-red transition-colors z-10 shadow-md"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {groups.map((group, gi) => (
          <div key={group.name} className={gi > 0 ? "mt-4" : ""}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                {group.name}
              </p>
            )}
            {collapsed && gi > 0 && (
              <div className="mx-3 mb-2 border-t border-white/6" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== prefix && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                      collapsed ? "justify-center px-0 py-2.5 mx-1" : "px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-imm-red text-white shadow-md shadow-imm-red/25"
                        : "text-gray-400 hover:bg-white/6 hover:text-white"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={`shrink-0 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {/* Tooltip for collapsed */}
                    {collapsed && (
                      <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#252525] text-white text-xs font-medium rounded-lg shadow-xl border border-white/8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-white/6 p-3">
        {/* User card */}
        <div className={`flex items-center gap-3 rounded-lg bg-white/4 p-2.5 mb-2 ${collapsed ? "justify-center" : ""}`}>
          <div className={`shrink-0 rounded-lg flex items-center justify-center text-[11px] font-bold ${
            role === "superadmin"
              ? "w-8 h-8 bg-imm-red text-white"
              : "w-8 h-8 bg-imm-yellow text-imm-black"
          }`}>
            {initials}
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userName || (role === "superadmin" ? "Superadmin" : "Admin")}</p>
              <p className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                {role === "superadmin" ? (
                  <><Shield size={10} /> Superadmin</>
                ) : (
                  <><UserCircle size={10} /> {userKomisariat || "PIKOM"}</>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className={`group relative flex items-center gap-3 w-full rounded-lg text-[13px] font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${
            collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
          }`}
          title={collapsed ? "Keluar" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Keluar</span>}
          {collapsed && (
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#252525] text-white text-xs font-medium rounded-lg shadow-xl border border-white/8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
              Keluar
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
