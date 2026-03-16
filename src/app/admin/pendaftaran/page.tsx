"use client";

import { useState, useEffect } from "react";
import { CalendarRange } from "lucide-react";

type Kegiatan = {
  id: number;
  namaKegiatan: string;
  singkatan: string;
  statusBuka: boolean;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasi: string;
  kuotaPeserta: number;
};

export default function AdminPendaftaranPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const komisariat = user.komisariat || "";
    fetch(`/api/kegiatan?komisariat=${encodeURIComponent(komisariat)}`)
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
      <div>
        <h1 className="text-2xl font-bold text-imm-black">Kelola Pendaftaran</h1>
        <p className="text-sm text-imm-gray-dark">Status pendaftaran kegiatan</p>
      </div>

      {kegiatanList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <CalendarRange size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-imm-gray-dark">Belum ada kegiatan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {kegiatanList.map((k) => (
            <div key={k.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold bg-imm-red text-white px-3 py-1 rounded-full">{k.singkatan}</span>
                  <h3 className="font-bold text-imm-black">{k.namaKegiatan}</h3>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${
                  k.statusBuka ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${k.statusBuka ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  {k.statusBuka ? "Dibuka" : "Ditutup"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-imm-gray-dark">Tanggal Kegiatan</span>
                  <p className="font-medium text-imm-black">
                    {new Date(k.tanggalMulai).toLocaleDateString("id-ID")} - {new Date(k.tanggalSelesai).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div>
                  <span className="text-imm-gray-dark">Lokasi</span>
                  <p className="font-medium text-imm-black">{k.lokasi}</p>
                </div>
                <div>
                  <span className="text-imm-gray-dark">Kuota</span>
                  <p className="font-medium text-imm-black">{k.kuotaPeserta} peserta</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
