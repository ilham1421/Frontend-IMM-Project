import { NextResponse } from "next/server";
import { usersData } from "@/lib/mockData";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = usersData.find((u) => u.id === Number(id));

  if (!user) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json();
  const updated = { ...user, ...body, updatedAt: new Date().toISOString() };

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = usersData.find((u) => u.id === Number(id));

  if (!user) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  if (user.role === "superadmin") {
    return NextResponse.json({ error: "Tidak bisa menghapus superadmin" }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
