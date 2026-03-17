"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  FileSearch,
  User,
  Building2,
  BookOpen,
  CalendarDays,
  Hash,
  Loader2,
} from "lucide-react";

type StatusResult = {
  noPendaftaran: string;
  namaLengkap: string;
  komisariat: string;
  kegiatan: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const statusConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: typeof CheckCircle2; label: string }
> = {
  Terverifikasi: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
    label: "Diterima / Terverifikasi",
  },
  Menunggu: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Clock,
    label: "Menunggu Verifikasi",
  },
  Ditolak: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
    label: "Ditolak",
  },
};

export default function CekStatusPage() {
  const [noPendaftaran, setNoPendaftaran] = useState("");
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = noPendaftaran.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/peserta/cek-status/${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setError("Nomor pendaftaran tidak ditemukan. Pastikan nomor yang dimasukkan sudah benar.");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const config = result ? statusConfig[result.status] || statusConfig.Menunggu : null;
  const StatusIcon = config?.icon || Clock;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-r from-imm-red to-imm-red-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileSearch size={48} className="mx-auto mb-4 text-imm-yellow" />
          <h1 className="text-4xl font-bold mb-3">Cek Status Pendaftaran</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Masukkan nomor pendaftaran untuk mengetahui status pendaftaran kamu
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative mb-10">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Hash
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-imm-gray-dark"
                />
                <input
                  type="text"
                  value={noPendaftaran}
                  onChange={(e) => setNoPendaftaran(e.target.value.toUpperCase())}
                  placeholder="Contoh: DAD-2026-0001"
                  className="w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg font-mono tracking-wider focus:outline-none focus:border-imm-red focus:ring-2 focus:ring-imm-red/20 transition-all placeholder:text-gray-300 placeholder:font-sans placeholder:tracking-normal placeholder:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !noPendaftaran.trim()}
                className="bg-imm-red text-white px-6 py-4 rounded-2xl font-semibold hover:bg-imm-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Search size={20} />
                )}
                <span className="hidden sm:inline">Cari</span>
              </button>
            </div>
          </form>

          {/* Error State */}
          {error && searched && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-red-400" />
              </div>
              <h3 className="font-bold text-red-800 mb-1">Tidak Ditemukan</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Result Card */}
          {result && config && (
            <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden animate-in fade-in">
              {/* Status Banner */}
              <div
                className={`${config.bg} ${config.border} border-b px-6 py-6 text-center`}
              >
                <div
                  className={`w-20 h-20 ${config.bg} border-2 ${config.border} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <StatusIcon size={40} className={config.color} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
                  Status Pendaftaran
                </p>
                <h2 className={`text-2xl font-extrabold ${config.color}`}>
                  {config.label}
                </h2>

                {result.status === "Menunggu" && (
                  <p className="text-sm text-amber-600 mt-2 max-w-sm mx-auto">
                    Pendaftaran kamu sedang dalam proses verifikasi oleh panitia.
                  </p>
                )}
                {result.status === "Terverifikasi" && (
                  <p className="text-sm text-emerald-600 mt-2 max-w-sm mx-auto">
                    Selamat! Pendaftaran kamu telah diverifikasi. Silakan persiapkan diri untuk mengikuti kegiatan.
                  </p>
                )}
                {result.status === "Ditolak" && (
                  <p className="text-sm text-red-600 mt-2 max-w-sm mx-auto">
                    Mohon maaf, pendaftaran kamu ditolak. Hubungi panitia untuk informasi lebih lanjut.
                  </p>
                )}
              </div>

              {/* Detail Info */}
              <div className="px-6 py-6 space-y-4">
                <h3 className="text-xs font-bold text-imm-gray-dark uppercase tracking-widest mb-3">
                  Detail Pendaftaran
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Nomor */}
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <Hash size={18} className="text-imm-red mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-imm-gray-dark uppercase tracking-wide font-semibold">
                        No. Pendaftaran
                      </p>
                      <p className="text-sm font-bold text-imm-black font-mono">
                        {result.noPendaftaran}
                      </p>
                    </div>
                  </div>

                  {/* Nama */}
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <User size={18} className="text-imm-red mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-imm-gray-dark uppercase tracking-wide font-semibold">
                        Nama Lengkap
                      </p>
                      <p className="text-sm font-bold text-imm-black">
                        {result.namaLengkap}
                      </p>
                    </div>
                  </div>

                  {/* Komisariat */}
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <Building2 size={18} className="text-imm-red mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-imm-gray-dark uppercase tracking-wide font-semibold">
                        Komisariat
                      </p>
                      <p className="text-sm font-bold text-imm-black">
                        {result.komisariat}
                      </p>
                    </div>
                  </div>

                  {/* Kegiatan */}
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <BookOpen size={18} className="text-imm-red mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-imm-gray-dark uppercase tracking-wide font-semibold">
                        Kegiatan
                      </p>
                      <p className="text-sm font-bold text-imm-black">
                        {result.kegiatan}
                      </p>
                    </div>
                  </div>

                  {/* Tanggal Daftar */}
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3 sm:col-span-2">
                    <CalendarDays size={18} className="text-imm-red mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-imm-gray-dark uppercase tracking-wide font-semibold">
                        Tanggal Pendaftaran
                      </p>
                      <p className="text-sm font-bold text-imm-black">
                        {formatDate(result.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-imm-gray-dark hover:text-imm-red transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
