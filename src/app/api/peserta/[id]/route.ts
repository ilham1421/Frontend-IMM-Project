import { NextResponse } from "next/server";
import { pesertaData } from "@/lib/mockData";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const peserta = pesertaData.find((p) => p.id === Number(id));

  if (!peserta) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(peserta);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const peserta = pesertaData.find((p) => p.id === Number(id));

  if (!peserta) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json();
  const updated = { ...peserta, ...body, updatedAt: new Date().toISOString() };

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const peserta = pesertaData.find((p) => p.id === Number(id));

  if (!peserta) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
