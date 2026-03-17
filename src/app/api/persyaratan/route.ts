import { NextRequest, NextResponse } from "next/server";
import { persyaratanData } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const kegiatanId = request.nextUrl.searchParams.get("kegiatanId");

  let result = persyaratanData.filter((p) => p.aktif);

  if (kegiatanId) {
    result = result.filter((p) => p.kegiatanId === Number(kegiatanId));
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.kegiatanId) {
    return NextResponse.json({ error: "kegiatanId wajib diisi" }, { status: 400 });
  }

  const newItem = {
    id: persyaratanData.length + 1,
    kegiatanId: Number(body.kegiatanId),
    nama: body.nama || "",
    jenis: body.jenis || "file",
    wajib: body.wajib ?? true,
    opsi: body.opsi || null,
    urutan: body.urutan ?? persyaratanData.filter((p) => p.kegiatanId === Number(body.kegiatanId)).length + 1,
    aktif: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(newItem, { status: 201 });
}
