"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ClipboardList,
  ArrowRight,
  CalendarRange,
  Activity,
  UserCheck,
  UserX,
  Building2,
  BarChart3,
} from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import DashboardSkeleton from "@/components/DashboardSkeleton";

type Kegiatan = {
  id: number;
  namaKegiatan: string;
  singkatan: string;
  statusBuka: boolean;
};

type KomisariatStat = {
  nama: string;
  total: number;
  terverifikasi: number;
  menunggu: number;
  ditolak: number;
};

type DashboardStats = {
  totalPendaftar: number;
  terverifikasi: number;
  menunggu: number;
  ditolak: number;
  totalKegiatan: number;
  komisariatStats: KomisariatStat[];
  kegiatan: { statusBuka: boolean; namaKegiatan?: string } | null;
  recentPeserta: { nama: string; komisariat: string; tanggal: string; status: string }[];
};

export default function SuperadminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [selectedKegiatanId, setSelectedKegiatanId] = useState<string>("");

  const fetchStats = (kegiatanId?: string) => {
    const url = kegiatanId ? `/api/dashboard/stats?kegiatanId=${kegiatanId}` : "/api/dashboard/stats";
    authFetch(url)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((d) => { if (d) setData(d); })
      .catch(() => {});
  };

  useEffect(() => {
    // Parallel fetch for faster initial load
    Promise.all([
      fetch("/api/kegiatan").then((r) => r.json()).catch(() => []),
      authFetch("/api/dashboard/stats").then((r) => r.ok ? r.json() : null).catch(() => null),
    ]).then(([list, stats]) => {
      setKegiatanList(list);
      if (stats) setData(stats);
    });
  }, []);

  const handleFilterChange = (value: string) => {
    setSelectedKegiatanId(value);
    fetchStats(value || undefined);
  };

  if (!data) {
    return <DashboardSkeleton />;
  }

  const maxKomisariatTotal = Math.max(...(data.komisariatStats?.map((k) => k.total) ?? []), 1);

  const kegiatanBuka = kegiatanList.filter((k) => k.statusBuka).length;
  const kegiatanTutup = kegiatanList.filter((k) => !k.statusBuka).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-br from-imm-red via-imm-red-dark to-red-900 rounded-2xl p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity size={20} className="text-imm-yellow" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Superadmin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard Overview</h1>
            <p className="text-white/70 text-sm">Monitoring seluruh kegiatan perkaderan IMM</p>
          </div>
          <select
            value={selectedKegiatanId}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="bg-white/10 border border-white/20 backdrop-blur rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-imm-yellow focus:border-transparent outline-none [&>option]:text-black"
          >
            <option value="">Semua Kegiatan</option>
            {kegiatanList.map((k) => (
              <option key={k.id} value={k.id}>{k.namaKegiatan}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pendaftar", value: data.totalPendaftar, icon: Users, gradient: "from-blue-500 to-blue-600" },
          { label: "Terverifikasi", value: data.terverifikasi, icon: UserCheck, gradient: "from-emerald-500 to-emerald-600" },
          { label: "Menunggu Verifikasi", value: data.menunggu, icon: ClipboardList, gradient: "from-amber-500 to-amber-600" },
          { label: "Ditolak", value: data.ditolak, icon: UserX, gradient: "from-rose-500 to-rose-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-sm`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-3xl font-extrabold text-imm-black tracking-tight">{stat.value}</p>
            <p className="text-xs text-imm-gray-dark mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Kegiatan Summary + Komisariat Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 content-auto">
        {/* Kegiatan Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
              <CalendarRange size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-imm-black">Kegiatan</h3>
              <p className="text-xs text-imm-gray-dark">{kegiatanList.length} total kegiatan</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-emerald-800">Dibuka</span>
              </div>
              <span className="text-lg font-bold text-emerald-700">{kegiatanBuka}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-800">Ditutup</span>
              </div>
              <span className="text-lg font-bold text-red-700">{kegiatanTutup}</span>
            </div>
          </div>

          {/* Kegiatan Quick List */}
          <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
            {kegiatanList.slice(0, 5).map((k) => (
              <div key={k.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold bg-imm-red text-white px-2 py-0.5 rounded-md shrink-0">{k.singkatan}</span>
                  <span className="text-imm-black truncate">{k.namaKegiatan}</span>
                </div>
                <span className={`w-2 h-2 rounded-full shrink-0 ml-2 ${k.statusBuka ? "bg-emerald-500" : "bg-gray-300"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Komisariat Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-imm-black">Pendaftar Per Komisariat</h3>
              <p className="text-xs text-imm-gray-dark">Distribusi pendaftar di setiap komisariat</p>
            </div>
          </div>

          {!data.komisariatStats || data.komisariatStats.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-imm-gray-dark text-sm">
              Belum ada data pendaftar.
            </div>
          ) : (
            <div className="space-y-3">
              {data.komisariatStats
                .sort((a, b) => b.total - a.total)
                .map((k) => (
                <div key={k.nama} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-imm-gray-dark" />
                      <span className="text-sm font-semibold text-imm-black">{k.nama}</span>
                    </div>
                    <span className="text-sm font-bold text-imm-black">{k.total}</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-full overflow-hidden flex">
                    {k.terverifikasi > 0 && (
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${(k.terverifikasi / maxKomisariatTotal) * 100}%` }}
                        title={`Terverifikasi: ${k.terverifikasi}`}
                      >
                        {k.terverifikasi > 0 && <span className="text-[9px] text-white font-bold px-1">{k.terverifikasi}</span>}
                      </div>
                    )}
                    {k.menunggu > 0 && (
                      <div
                        className="h-full bg-amber-400 transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${(k.menunggu / maxKomisariatTotal) * 100}%` }}
                        title={`Menunggu: ${k.menunggu}`}
                      >
                        {k.menunggu > 0 && <span className="text-[9px] text-white font-bold px-1">{k.menunggu}</span>}
                      </div>
                    )}
                    {k.ditolak > 0 && (
                      <div
                        className="h-full bg-rose-500 transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${(k.ditolak / maxKomisariatTotal) * 100}%` }}
                        title={`Ditolak: ${k.ditolak}`}
                      >
                        {k.ditolak > 0 && <span className="text-[9px] text-white font-bold px-1">{k.ditolak}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {/* Legend */}
              <div className="flex items-center gap-4 pt-2 text-xs text-imm-gray-dark">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500" /> Terverifikasi</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400" /> Menunggu</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500" /> Ditolak</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pendaftar Terbaru */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden content-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-imm-black">Pendaftar Terbaru</h3>
            <p className="text-xs text-imm-gray-dark mt-0.5">5 pendaftar terakhir dari seluruh komisariat</p>
          </div>
          <a href="/superadmin/peserta" className="text-xs text-imm-red font-semibold hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight size={14} />
          </a>
        </div>
        {!data.recentPeserta || data.recentPeserta.length === 0 ? (
          <div className="p-12 text-center text-imm-gray-dark text-sm">
            Belum ada pendaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-imm-gray/50">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-imm-gray-dark text-xs uppercase tracking-wider">Nama</th>
                  <th className="text-left px-6 py-3 font-semibold text-imm-gray-dark text-xs uppercase tracking-wider">Komisariat</th>
                  <th className="text-left px-6 py-3 font-semibold text-imm-gray-dark text-xs uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-6 py-3 font-semibold text-imm-gray-dark text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentPeserta.map((r, i) => (
                  <tr key={i} className="hover:bg-imm-gray/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-imm-red to-imm-red-dark flex items-center justify-center text-white text-xs font-bold">
                          {r.nama.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-imm-black">{r.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold bg-imm-gray text-imm-black px-2.5 py-1 rounded-lg">{r.komisariat}</span>
                    </td>
                    <td className="px-6 py-4 text-imm-gray-dark">{r.tanggal}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        r.status === "Terverifikasi"
                          ? "bg-emerald-100 text-emerald-700"
                          : r.status === "Ditolak"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
