"use client";

import { useState, useEffect } from "react";
import { BarChart3, Download, Users, PieChart } from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/components/Toast";

type KomisariatStat = {
  nama: string;
  total: number;
  terverifikasi: number;
  menunggu: number;
  ditolak: number;
};

type Stats = {
  totalPendaftar: number;
  terverifikasi: number;
  menunggu: number;
  ditolak: number;
  komisariatStats: KomisariatStat[];
};

export default function LaporanPage() {
  const [data, setData] = useState<Stats | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    authFetch("/api/dashboard/stats")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((d) => { if (d) setData(d); })
      .catch(() => { showToast("Gagal memuat data laporan", "error"); });
  }, []);

  const handleExport = async () => {
    try {
      const res = await authFetch("/api/peserta/export/csv");
      if (!res.ok) {
        showToast("Gagal mengekspor data", "error");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `peserta-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Data berhasil diekspor", "success");
    } catch {
      showToast("Gagal mengekspor data", "error");
    }
  };

  if (!data) {
    return <div className="p-6 text-imm-gray-dark">Memuat...</div>;
  }

  const komisariatStats = data.komisariatStats || [];
  const totalAll = data.totalPendaftar;
  const totalVerifikasi = data.terverifikasi;
  const totalMenunggu = data.menunggu;
  const totalDitolak = data.ditolak;
  const maxTotal = Math.max(...komisariatStats.map((k) => k.total), 1);

  // Pie chart calculations
  const pieSegments = [
    { label: "Terverifikasi", value: totalVerifikasi, color: "#22c55e" },
    { label: "Menunggu", value: totalMenunggu, color: "#eab308" },
    { label: "Ditolak", value: totalDitolak, color: "#ef4444" },
  ].filter((s) => s.value > 0);

  const buildConicGradient = () => {
    if (totalAll === 0) return "conic-gradient(#e5e7eb 0deg 360deg)";
    let currentAngle = 0;
    const stops: string[] = [];
    for (const seg of pieSegments) {
      const angle = (seg.value / totalAll) * 360;
      stops.push(`${seg.color} ${currentAngle}deg ${currentAngle + angle}deg`);
      currentAngle += angle;
    }
    return `conic-gradient(${stops.join(", ")})`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-imm-black">Laporan & Statistik</h1>
          <p className="text-sm text-imm-gray-dark">Ringkasan data pendaftaran</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm"
        >
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <Users size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-imm-black">{totalAll}</p>
          <p className="text-xs text-imm-gray-dark">Total Pendaftar</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2" />
          <p className="text-2xl font-bold text-imm-black">{totalVerifikasi}</p>
          <p className="text-xs text-imm-gray-dark">Terverifikasi</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto mb-2" />
          <p className="text-2xl font-bold text-imm-black">{totalMenunggu}</p>
          <p className="text-xs text-imm-gray-dark">Menunggu</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2" />
          <p className="text-2xl font-bold text-imm-black">{totalDitolak}</p>
          <p className="text-xs text-imm-gray-dark">Ditolak</p>
        </div>
      </div>

      {/* Grafik Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-imm-black mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-imm-red" />
            Grafik Pendaftar per Komisariat
          </h3>
          <div className="space-y-3">
            {komisariatStats.map((k) => (
              <div key={k.nama}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-imm-black">{k.nama}</span>
                  <span className="text-imm-gray-dark">{k.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-imm-red h-2.5 rounded-full transition-all"
                    style={{ width: `${(k.total / maxTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-imm-black mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-imm-red" />
            Distribusi Status
          </h3>
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-44 h-44 rounded-full"
              style={{ background: buildConicGradient() }}
              title={pieSegments.map((s) => `${s.label}: ${s.value}`).join(", ")}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Terverifikasi</span>
              </div>
              <span className="font-medium">{totalAll ? ((totalVerifikasi / totalAll) * 100).toFixed(1) : "0.0"}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span>Menunggu</span>
              </div>
              <span className="font-medium">{totalAll ? ((totalMenunggu / totalAll) * 100).toFixed(1) : "0.0"}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Ditolak</span>
              </div>
              <span className="font-medium">{totalAll ? ((totalDitolak / totalAll) * 100).toFixed(1) : "0.0"}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table per Komisariat */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-imm-black">Statistik per Komisariat</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-imm-gray">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-imm-gray-dark">Komisariat</th>
                <th className="text-center px-6 py-3 font-medium text-imm-gray-dark">Total</th>
                <th className="text-center px-6 py-3 font-medium text-imm-gray-dark">Terverifikasi</th>
                <th className="text-center px-6 py-3 font-medium text-imm-gray-dark">Menunggu</th>
                <th className="text-center px-6 py-3 font-medium text-imm-gray-dark">Ditolak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {komisariatStats.map((k) => (
                <tr key={k.nama} className="hover:bg-imm-gray/50">
                  <td className="px-6 py-4 font-medium text-imm-black">{k.nama}</td>
                  <td className="px-6 py-4 text-center">{k.total}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">{k.terverifikasi}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">{k.menunggu}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">{k.ditolak}</span>
                  </td>
                </tr>
              ))}
              <tr className="bg-imm-gray font-semibold">
                <td className="px-6 py-4">Total</td>
                <td className="px-6 py-4 text-center">{totalAll}</td>
                <td className="px-6 py-4 text-center">{totalVerifikasi}</td>
                <td className="px-6 py-4 text-center">{totalMenunggu}</td>
                <td className="px-6 py-4 text-center">{totalDitolak}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
