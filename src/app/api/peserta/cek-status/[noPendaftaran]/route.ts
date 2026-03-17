import { NextResponse } from "next/server";
import { pesertaData, kegiatanData } from "@/lib/mockData";

export async function GET(_request: Request, { params }: { params: Promise<{ noPendaftaran: string }> }) {
  const { noPendaftaran } = await params;

  const peserta = pesertaData.find((p) => p.noPendaftaran === noPendaftaran);

  if (!peserta) {
    return NextResponse.json({ error: "Nomor pendaftaran tidak ditemukan" }, { status: 404 });
  }

  const kegiatan = kegiatanData.find((k) => k.id === peserta.kegiatanId);

  return NextResponse.json({
    noPendaftaran: peserta.noPendaftaran,
    namaLengkap: peserta.namaLengkap,
    komisariat: peserta.komisariat,
    kegiatan: kegiatan?.singkatan || "-",
    status: peserta.status,
    createdAt: peserta.createdAt,
    updatedAt: peserta.updatedAt,
  });
}
