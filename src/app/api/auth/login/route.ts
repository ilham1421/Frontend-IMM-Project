import { NextResponse } from "next/server";
import { usersData } from "@/lib/mockData";

// Mockup login — accepts any password, matches by username
export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
  }

  const user = usersData.find((u) => u.username === username);

  if (!user) {
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  if (!user.aktif) {
    return NextResponse.json({ error: "Akun tidak aktif. Hubungi superadmin." }, { status: 403 });
  }

  // Mockup: accept any password
  const token = btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role, komisariat: user.komisariat, exp: Date.now() + 86400000 }));

  return NextResponse.json({ user, token });
}
