"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarRange, ArrowRight } from "lucide-react";

type Kegiatan = {
  id: number;
  namaKegiatan: string;
  singkatan: string;
  statusBuka: boolean;
  tanggalMulai: string;
  tanggalSelesai: string;
  batasRegistrasi: string;
  kuotaPeserta: number;
};

export default function ManajemenPendaftaranPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kegiatan")
      .then((res) => res.json())
      .then((data) => setKegiatanList(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-imm-gray-dark">Memuat...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-imm-black">Status Pendaftaran</h1>
          <p className="text-sm text-imm-gray-dark">Ringkasan status pendaftaran semua kegiatan</p>
        </div>
        <Link
          href="/superadmin/kegiatan"
          className="inline-flex items-center gap-2 bg-imm-red text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
        >
          <CalendarRange size={18} />
          Kelola Kegiatan
        </Link>
      </div>

      {kegiatanList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <CalendarRange size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-imm-gray-dark">Belum ada kegiatan. Buat kegiatan baru di halaman Manajemen Kegiatan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kegiatanList.map((k) => (
            <div key={k.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold bg-imm-red text-white px-3 py-1 rounded-full">{k.singkatan}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                  k.statusBuka ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${k.statusBuka ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  {k.statusBuka ? "Dibuka" : "Ditutup"}
                </span>
              </div>
              <h3 className="font-bold text-imm-black mb-2">{k.namaKegiatan}</h3>
              <div className="space-y-1 text-sm text-imm-gray-dark">
                <p>Tanggal: {new Date(k.tanggalMulai).toLocaleDateString("id-ID")} - {new Date(k.tanggalSelesai).toLocaleDateString("id-ID")}</p>
                <p>Batas Registrasi: {new Date(k.batasRegistrasi).toLocaleDateString("id-ID")}</p>
                <p>Kuota: {k.kuotaPeserta} peserta</p>
              </div>
              <Link
                href="/superadmin/kegiatan"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-imm-red hover:underline"
              >
                Edit Kegiatan
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
