import { NextRequest, NextResponse } from "next/server";
import { pesertaData, kegiatanData } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  const komisariat = request.nextUrl.searchParams.get("komisariat");
  const kegiatanId = request.nextUrl.searchParams.get("kegiatanId");

  let filtered = [...pesertaData];

  if (kegiatanId) filtered = filtered.filter((p) => p.kegiatanId === Number(kegiatanId));
  if (status && status !== "semua") filtered = filtered.filter((p) => p.status === status);
  if (komisariat) filtered = filtered.filter((p) => p.komisariat === komisariat);

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const escapeCsv = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const headers = [
    "No", "No Pendaftaran", "Nama Lengkap", "NIM", "Tempat Lahir",
    "Tanggal Lahir", "Jenis Kelamin", "Email", "No HP", "Universitas",
    "Fakultas", "Prodi", "Komisariat", "Alamat", "Kegiatan", "Status", "Tanggal Daftar",
  ];

  const rows = filtered.map((p, i) => {
    const kegiatan = kegiatanData.find((k) => k.id === p.kegiatanId);
    return [
      String(i + 1),
      p.noPendaftaran,
      p.namaLengkap,
      p.nim,
      p.tempatLahir,
      p.tanggalLahir,
      p.jenisKelamin === "L" ? "Laki-laki" : "Perempuan",
      p.email,
      p.noHp,
      p.universitas,
      p.fakultas,
      p.prodi,
      p.komisariat,
      p.alamat,
      kegiatan?.singkatan || "-",
      p.status,
      new Date(p.createdAt).toLocaleDateString("id-ID"),
    ].map(escapeCsv).join(",");
  });

  const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=peserta-${new Date().toISOString().slice(0, 10)}.csv`,
    },
  });
}
