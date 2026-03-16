"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Printer, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function SuksesContent() {
  const searchParams = useSearchParams();
  const noPendaftaran = searchParams.get("no") || "REG-XXXX";

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-imm-black mb-2">
          Pendaftaran Berhasil!
        </h1>
        <p className="text-imm-gray-dark mb-8">
          Data pendaftaran kamu telah terkirim. Simpan nomor pendaftaran
          di bawah ini.
        </p>

        {/* Card Info */}
        <div className="bg-white border-2 border-imm-red/20 rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-sm text-imm-gray-dark mb-2">
            Nomor Pendaftaran
          </p>
          <p className="text-2xl font-bold text-imm-red mb-6">
            {noPendaftaran}
          </p>

          <div className="text-left space-y-3 border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-sm text-imm-black">
              Instruksi Selanjutnya:
            </h3>
            <ul className="text-sm text-imm-gray-dark space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-imm-red font-bold">1.</span>
                Simpan atau cetak bukti pendaftaran ini.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-imm-red font-bold">2.</span>
                Tunggu konfirmasi dari panitia via email/WhatsApp.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-imm-red font-bold">3.</span>
                Persiapkan diri untuk mengikuti kegiatan.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-imm-red font-bold">4.</span>
                Hubungi panitia jika ada pertanyaan lebih lanjut.
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 bg-imm-red text-white font-semibold px-6 py-3 rounded-xl hover:bg-imm-red-dark transition-colors"
          >
            <Printer size={18} />
            Cetak Bukti
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-imm-black font-semibold px-6 py-3 rounded-xl hover:bg-imm-gray transition-colors"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuksesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <p>Memuat...</p>
        </div>
      }
    >
      <SuksesContent />
    </Suspense>
  );
}
