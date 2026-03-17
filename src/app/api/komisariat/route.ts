import { NextResponse } from "next/server";
import { komisariatData } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(komisariatData);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.nama || !body.nama.trim()) {
    return NextResponse.json({ error: "Nama komisariat wajib diisi" }, { status: 400 });
  }

  const newItem = {
    id: komisariatData.length + 1,
    nama: body.nama.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(newItem, { status: 201 });
}
