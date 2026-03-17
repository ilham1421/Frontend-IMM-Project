import { NextRequest, NextResponse } from "next/server";
import { pesertaData, kegiatanData } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const kegiatanId = request.nextUrl.searchParams.get("kegiatanId");
  const komisariat = request.nextUrl.searchParams.get("komisariat");

  let filtered = [...pesertaData];

  if (kegiatanId) {
    filtered = filtered.filter((p) => p.kegiatanId === Number(kegiatanId));
  }
  if (komisariat) {
    filtered = filtered.filter((p) => p.komisariat === komisariat);
  }

  // Status counts
  const totalPendaftar = filtered.length;
  const terverifikasi = filtered.filter((p) => p.status === "Terverifikasi").length;
  const menunggu = filtered.filter((p) => p.status === "Menunggu").length;
  const ditolak = filtered.filter((p) => p.status === "Ditolak").length;

  // Komisariat stats
  const komisariatMap: Record<string, { total: number; terverifikasi: number; menunggu: number; ditolak: number }> = {};
  for (const p of filtered) {
    if (!komisariatMap[p.komisariat]) {
      komisariatMap[p.komisariat] = { total: 0, terverifikasi: 0, menunggu: 0, ditolak: 0 };
    }
    komisariatMap[p.komisariat].total++;
    if (p.status === "Terverifikasi") komisariatMap[p.komisariat].terverifikasi++;
    if (p.status === "Menunggu") komisariatMap[p.komisariat].menunggu++;
    if (p.status === "Ditolak") komisariatMap[p.komisariat].ditolak++;
  }

  const komisariatStats = Object.entries(komisariatMap).map(([nama, stats]) => ({
    nama,
    ...stats,
  }));

  // Recent 5
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recentPeserta = sorted.slice(0, 5).map((p) => ({
    nama: p.namaLengkap,
    komisariat: p.komisariat,
    tanggal: new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    status: p.status,
  }));

  // Count kegiatan
  let totalKegiatan = kegiatanData.length;
  if (komisariat) {
    const komisariatIdMap: Record<string, number> = {
      FKIP: 1, FISIP: 2, FEB: 3, Teknik: 4, Hukum: 5, FAI: 6, FIKES: 7, FKIK: 8,
    };
    const kid = komisariatIdMap[komisariat];
    if (kid) {
      totalKegiatan = kegiatanData.filter((k) => k.komisariatIds.includes(kid)).length;
    }
  }

  // Kegiatan detail
  let kegiatan = null;
  if (kegiatanId) {
    const kg = kegiatanData.find((k) => k.id === Number(kegiatanId));
    if (kg) {
      kegiatan = {
        statusBuka: kg.statusBuka,
        namaKegiatan: kg.namaKegiatan,
        tanggalMulai: kg.tanggalMulai,
        tanggalSelesai: kg.tanggalSelesai,
        lokasi: kg.lokasi,
        kuotaPeserta: kg.kuotaPeserta,
        batasRegistrasi: kg.batasRegistrasi,
      };
    }
  }

  return NextResponse.json({
    totalPendaftar,
    terverifikasi,
    menunggu,
    ditolak,
    komisariatStats,
    recentPeserta,
    totalKegiatan,
    kegiatan,
  });
}
