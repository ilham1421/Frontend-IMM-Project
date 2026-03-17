import { NextResponse } from "next/server";
import { kegiatanData } from "@/lib/mockData";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kegiatan = kegiatanData.find((k) => k.id === Number(id));

  if (!kegiatan) {
    return NextResponse.json({ error: "Kegiatan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(kegiatan);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kegiatan = kegiatanData.find((k) => k.id === Number(id));

  if (!kegiatan) {
    return NextResponse.json({ error: "Kegiatan tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json();
  const updated = { ...kegiatan, ...body, updatedAt: new Date().toISOString() };

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kegiatan = kegiatanData.find((k) => k.id === Number(id));

  if (!kegiatan) {
    return NextResponse.json({ error: "Kegiatan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
