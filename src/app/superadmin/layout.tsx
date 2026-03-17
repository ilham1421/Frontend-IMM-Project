"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import LayoutSkeleton from "@/components/LayoutSkeleton";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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
      if (user.role !== "superadmin") {
        router.replace("/login");
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!authorized) {
    return <LayoutSkeleton />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role="superadmin" />
      <main className="flex-1 bg-imm-gray overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-imm-black">Panel Superadmin</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-imm-red rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">SA</span>
            </div>
            <span className="text-sm font-medium text-imm-black">Superadmin</span>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
