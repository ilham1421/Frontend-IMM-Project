import { NextRequest, NextResponse } from "next/server";
import { kegiatanData } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const komisariat = request.nextUrl.searchParams.get("komisariat");

  let result = [...kegiatanData];

  if (komisariat) {
    const komisariatMap: Record<string, number> = {
      FKIP: 1, FISIP: 2, FEB: 3, Teknik: 4, Hukum: 5, FAI: 6, FIKES: 7, FKIK: 8,
    };
    const kid = komisariatMap[komisariat];
    if (kid) {
      result = result.filter((k) => k.komisariatIds.includes(kid));
    }
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newKegiatan = {
    id: kegiatanData.length + 1,
    namaKegiatan: body.namaKegiatan || "",
    singkatan: body.singkatan || "",
    deskripsi: body.deskripsi || "",
    tanggalMulai: body.tanggalMulai || "",
    tanggalSelesai: body.tanggalSelesai || "",
    lokasi: body.lokasi || "",
    kuotaPeserta: body.kuotaPeserta || 100,
    batasRegistrasi: body.batasRegistrasi || "",
    statusBuka: body.statusBuka ?? false,
    komisariatIds: body.komisariatIds || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(newKegiatan, { status: 201 });
}
