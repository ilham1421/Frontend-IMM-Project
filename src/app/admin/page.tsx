"use client";

import { useState, useEffect } from "react";
import {
  Users,
  FileCheck,
  ClipboardList,
  CalendarRange,
  MapPin,
  Clock,
  ArrowRight,
  Activity,
  UserCheck,
  UserX,
} from "lucide-react";
import { authFetch } from "@/lib/authFetch";

type KegiatanInfo = {
  statusBuka: boolean;
  namaKegiatan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasi: string;
  batasRegistrasi: string;
  kuotaPeserta: number;
};

type DashboardData = {
  totalPendaftar: number;
  terverifikasi: number;
  menunggu: number;
  ditolak: number;
  totalKegiatan: number;
  kegiatan: KegiatanInfo | null;
  recentPeserta: { nama: string; komisariat: string; tanggal: string; status: string }[];
};

type Kegiatan = {
  id: number;
  namaKegiatan: string;
  singkatan: string;
  statusBuka: boolean;
  komisariatIds: number[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [komisariat, setKomisariat] = useState("");
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [selectedKegiatanId, setSelectedKegiatanId] = useState<string>("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setKomisariat(user.komisariat || "");
  }, []);

  useEffect(() => {
    if (!komisariat) return;
    fetch(`/api/kegiatan?komisariat=${encodeURIComponent(komisariat)}`)
      .then((r) => r.json())
      .then((list) => setKegiatanList(list))
      .catch(() => {});
  }, [komisariat]);

  useEffect(() => {
    if (!komisariat) return;
    const params = new URLSearchParams();
    params.set("komisariat", komisariat);
    if (selectedKegiatanId) params.set("kegiatanId", selectedKegiatanId);
    authFetch(`/api/dashboard/stats?${params.toString()}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((d) => { if (d) setData(d); })
      .catch(() => {});
  }, [komisariat, selectedKegiatanId]);

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-imm-gray-dark">
          <div className="w-5 h-5 border-2 border-imm-red border-t-transparent rounded-full animate-spin" />
          Memuat dashboard...
        </div>
      </div>
    );
  }

  const totalCapacity = data.kegiatan?.kuotaPeserta || 0;
  const fillPercentage = totalCapacity > 0 ? Math.min((data.totalPendaftar / totalCapacity) * 100, 100) : 0;

  const daysLeft = data.kegiatan?.batasRegistrasi
    ? Math.max(0, Math.ceil((new Date(data.kegiatan.batasRegistrasi).getTime() - Date.now()) / 86400000))
    : null;

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-imm-red via-imm-red-dark to-red-900 rounded-2xl p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={20} className="text-imm-yellow" />
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Selamat Datang!</h1>
          <p className="text-white/70 text-sm">Panel Admin PIKOM Komisariat {komisariat}</p>
        </div>
      </div>

      {/* Kegiatan Filter */}
      {kegiatanList.length > 0 && (
        <div className="flex items-center gap-3">
          <CalendarRange size={18} className="text-imm-gray-dark" />
          <select
            value={selectedKegiatanId}
            onChange={(e) => setSelectedKegiatanId(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none bg-white shadow-sm"
          >
            <option value="">Semua Kegiatan</option>
            {kegiatanList.map((k) => (
              <option key={k.id} value={k.id}>{k.namaKegiatan}</option>
            ))}
          </select>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pendaftar", value: data.totalPendaftar, icon: Users, gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
          { label: "Terverifikasi", value: data.terverifikasi, icon: UserCheck, gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
          { label: "Menunggu", value: data.menunggu, icon: ClipboardList, gradient: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
          { label: "Ditolak", value: data.ditolak, icon: UserX, gradient: "from-rose-500 to-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-sm`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-3xl font-extrabold text-imm-black tracking-tight">{stat.value}</p>
            <p className="text-xs text-imm-gray-dark mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Kegiatan Info + Progress */}
      {data.kegiatan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Kegiatan Detail */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-imm-black text-lg">Detail Kegiatan</h3>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                data.kegiatan.statusBuka
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}>
                <span className={`w-2 h-2 rounded-full ${data.kegiatan.statusBuka ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                {data.kegiatan.statusBuka ? "Pendaftaran Dibuka" : "Pendaftaran Ditutup"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-imm-gray flex items-center justify-center shrink-0">
                  <CalendarRange size={18} className="text-imm-red" />
                </div>
                <div>
                  <p className="text-xs text-imm-gray-dark">Nama Kegiatan</p>
                  <p className="font-semibold text-imm-black">{data.kegiatan.namaKegiatan}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-imm-gray flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-imm-red" />
                </div>
                <div>
                  <p className="text-xs text-imm-gray-dark">Tanggal Pelaksanaan</p>
                  <p className="font-semibold text-imm-black">
                    {formatDate(data.kegiatan.tanggalMulai)} — {formatDate(data.kegiatan.tanggalSelesai)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-imm-gray flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-imm-red" />
                </div>
                <div>
                  <p className="text-xs text-imm-gray-dark">Lokasi</p>
                  <p className="font-semibold text-imm-black">{data.kegiatan.lokasi || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-imm-gray flex items-center justify-center shrink-0">
                  <FileCheck size={18} className="text-imm-red" />
                </div>
                <div>
                  <p className="text-xs text-imm-gray-dark">Batas Pendaftaran</p>
                  <p className="font-semibold text-imm-black">{formatDate(data.kegiatan.batasRegistrasi)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Capacity & Countdown */}
          <div className="space-y-4">
            {/* Kuota Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-sm font-bold text-imm-black mb-4">Kuota Peserta</h4>
              <div className="relative w-28 h-28 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#f3f4f6" strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#dc2626" strokeWidth="3"
                    strokeDasharray={`${fillPercentage}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-imm-black">{data.totalPendaftar}</span>
                  <span className="text-[10px] text-imm-gray-dark">/ {totalCapacity}</span>
                </div>
              </div>
              <p className="text-center text-xs text-imm-gray-dark">
                {Math.round(fillPercentage)}% kuota terisi
              </p>
            </div>

            {/* Countdown */}
            {daysLeft !== null && data.kegiatan.statusBuka && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <h4 className="text-sm font-bold text-amber-900 mb-2">Sisa Waktu Pendaftaran</h4>
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-amber-600">{daysLeft}</span>
                  <p className="text-sm font-medium text-amber-700 mt-1">hari lagi</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pendaftar Terbaru */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-imm-black">Pendaftar Terbaru</h3>
            <p className="text-xs text-imm-gray-dark mt-0.5">5 pendaftar terakhir di komisariat {komisariat}</p>
          </div>
          <a href="/admin/peserta" className="text-xs text-imm-red font-semibold hover:underline flex items-center gap-1">
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
                  <th className="text-left px-6 py-3 font-semibold text-imm-gray-dark text-xs uppercase tracking-wider">Tanggal</th>
                  <th className="text-left px-6 py-3 font-semibold text-imm-gray-dark text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentPeserta.map((p, i) => (
                  <tr key={i} className="hover:bg-imm-gray/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-imm-red to-imm-red-dark flex items-center justify-center text-white text-xs font-bold">
                          {p.nama.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-imm-black">{p.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-imm-gray-dark">{p.tanggal}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.status === "Terverifikasi"
                          ? "bg-emerald-100 text-emerald-700"
                          : p.status === "Ditolak"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {p.status}
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
