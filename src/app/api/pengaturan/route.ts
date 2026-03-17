import { NextResponse } from "next/server";
import { pengaturanData } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(pengaturanData);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updated = { ...pengaturanData, ...body, updatedAt: new Date().toISOString() };
  return NextResponse.json(updated);
}
