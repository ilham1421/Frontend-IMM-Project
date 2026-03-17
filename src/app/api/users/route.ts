import { NextResponse } from "next/server";
import { usersData } from "@/lib/mockData";

export async function GET() {
  const admins = usersData.filter((u) => u.role === "admin");
  return NextResponse.json(admins);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.username || !body.nama) {
    return NextResponse.json({ error: "Username dan nama wajib diisi" }, { status: 400 });
  }

  const exists = usersData.find((u) => u.username === body.username);
  if (exists) {
    return NextResponse.json({ error: "Username sudah terdaftar" }, { status: 409 });
  }

  const newUser = {
    id: usersData.length + 1,
    nama: body.nama,
    username: body.username,
    role: "admin" as const,
    komisariat: body.komisariat || null,
    aktif: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(newUser, { status: 201 });
}
