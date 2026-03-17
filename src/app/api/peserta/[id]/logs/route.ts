import { NextResponse } from "next/server";
import { statusLogsData } from "@/lib/mockData";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const logs = statusLogsData.filter((l) => l.pesertaId === Number(id));
  return NextResponse.json(logs);
}
