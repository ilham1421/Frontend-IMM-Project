import { NextRequest, NextResponse } from "next/server";
import { pesertaData, kegiatanData } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search")?.toLowerCase();
  const status = request.nextUrl.searchParams.get("status");
  const komisariat = request.nextUrl.searchParams.get("komisariat");
  const kegiatanId = request.nextUrl.searchParams.get("kegiatanId");
  const usePagination = request.nextUrl.searchParams.has("page");

  let filtered = [...pesertaData];

  if (kegiatanId) filtered = filtered.filter((p) => p.kegiatanId === Number(kegiatanId));
  if (status && status !== "semua") filtered = filtered.filter((p) => p.status === status);
  if (komisariat) filtered = filtered.filter((p) => p.komisariat === komisariat);

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.namaLengkap.toLowerCase().includes(search) ||
        p.nim.includes(search) ||
        p.komisariat.toLowerCase().includes(search)
    );
  }

  // Sort by createdAt desc
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (usePagination) {
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 50));
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return NextResponse.json({
      data: items,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  // Mockup registration — accept the form data and return a fake peserta
  const formData = await request.formData();

  const namaLengkap = formData.get("namaLengkap") as string;
  const nim = formData.get("nim") as string;
  const email = formData.get("email") as string;
  const kegiatanId = Number(formData.get("kegiatanId"));

  if (!namaLengkap || !nim || !email || !kegiatanId) {
    return NextResponse.json({ error: "Nama lengkap, NIM, email, dan kegiatan wajib diisi" }, { status: 400 });
  }

  const kegiatan = kegiatanData.find((k) => k.id === kegiatanId);
  const prefix = kegiatan?.singkatan || "REG";
  const year = new Date().getFullYear();
  const count = pesertaData.filter((p) => p.kegiatanId === kegiatanId).length;

  const newPeserta = {
    id: pesertaData.length + 1,
    noPendaftaran: `${prefix}-${year}-${String(count + 1).padStart(4, "0")}`,
    kegiatanId,
    namaLengkap,
    nim,
    tempatLahir: (formData.get("tempatLahir") as string) || "",
    tanggalLahir: (formData.get("tanggalLahir") as string) || "",
    jenisKelamin: (formData.get("jenisKelamin") as string) || "",
    email,
    noHp: (formData.get("noHp") as string) || "",
    universitas: (formData.get("universitas") as string) || "",
    fakultas: (formData.get("fakultas") as string) || "",
    prodi: (formData.get("prodi") as string) || "",
    komisariat: (formData.get("komisariat") as string) || "",
    alamat: (formData.get("alamat") as string) || "",
    status: "Menunggu",
    berkas: [],
    jawaban: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(newPeserta, { status: 201 });
}
