"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [komisariat, setKomisariat] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "admin") {
        router.replace("/login");
        return;
      }
      setKomisariat(user.komisariat || "");
      setAuthorized(true);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-imm-gray">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-imm-red"></div>
      </div>
    );
  }

  const label = komisariat ? `Admin PIKOM ${komisariat}` : "Admin PIKOM";

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 bg-imm-gray overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-imm-black">Panel {label}</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-imm-yellow rounded-full flex items-center justify-center">
              <span className="text-imm-black text-xs font-bold">AP</span>
            </div>
            <span className="text-sm font-medium text-imm-black">{label}</span>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
