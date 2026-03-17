import { NextResponse } from "next/server";
import { persyaratanData } from "@/lib/mockData";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = persyaratanData.find((p) => p.id === Number(id));

  if (!item) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json();
  const updated = { ...item, ...body, updatedAt: new Date().toISOString() };

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = persyaratanData.find((p) => p.id === Number(id));

  if (!item) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
