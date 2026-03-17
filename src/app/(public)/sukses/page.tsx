"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Printer,
  ArrowLeft,
  Calendar,
  Hash,
  Shield,
  BookOpen,
  Users,
  Phone,
} from "lucide-react";
import { Suspense, useRef } from "react";

function SuksesContent() {
  const searchParams = useSearchParams();
  const noPendaftaran = searchParams.get("no") || "REG-XXXX";
  const printRef = useRef<HTMLDivElement>(null);

  const tanggalDaftar = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Screen-only success banner */}
        <div className="text-center mb-8 print:hidden">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200 animate-bounce-slow">
              <CheckCircle2 size={52} className="text-white drop-shadow" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-imm-yellow rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-imm-black mb-2">
            Pendaftaran Berhasil!
          </h1>
          <p className="text-imm-gray-dark text-base max-w-md mx-auto">
            Data pendaftaran kamu telah terkirim. Simpan atau cetak bukti
            pendaftaran di bawah ini.
          </p>
        </div>

        {/* ===== PRINTABLE CARD ===== */}
        <div
          ref={printRef}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden print:shadow-none print:rounded-none print:border print:border-gray-300"
        >
          {/* Card Header - Red gradient banner */}
          <div className="relative bg-linear-to-r from-imm-red via-imm-red-dark to-imm-red overflow-hidden px-6 py-6 print:py-5 text-white text-center">
            {/* Decorative circles */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white rounded-xl p-1.5 shadow-lg">
                  <Image
                    src="/logo-imm.png"
                    alt="Logo IMM"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold leading-tight tracking-wide">
                    Perkaderan IMM
                  </h2>
                  <p className="text-white/80 text-xs tracking-widest uppercase">
                    Ikatan Mahasiswa Muhammadiyah
                  </p>
                </div>
              </div>

              <div className="w-20 h-0.5 bg-white/40 mx-auto mb-3 rounded-full" />
              <p className="text-white/90 text-sm font-medium uppercase tracking-[0.2em]">
                Bukti Pendaftaran
              </p>
            </div>
          </div>

          {/* Nomor Pendaftaran - Feature section */}
          {/* Nomor Pendaftaran - Feature section */}
          <div className="relative px-6 py-5 print:py-4">
            {/* Decorative notch */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-imm-yellow text-imm-black text-[10px] font-bold uppercase tracking-widest px-5 py-1 rounded-full shadow-md">
              Nomor Registrasi
            </div>

            <div className="text-center pt-3">
              <div className="inline-block bg-linear-to-r from-red-50 via-white to-red-50 border-2 border-dashed border-imm-red/30 rounded-2xl px-8 py-4">
                <p className="text-4xl md:text-5xl font-black text-imm-red tracking-wider font-mono">
                  {noPendaftaran}
                </p>
              </div>
            </div>

            {/* Date & Hash */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-imm-gray-dark">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} className="text-imm-red" />
                {tanggalDaftar}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Hash size={13} className="text-imm-red" />
                {noPendaftaran}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6">
            <div className="border-t-2 border-dotted border-gray-200" />
          </div>

          {/* Info Sections */}
          <div className="px-6 py-4 print:py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 print:gap-2">
            {/* Status Card */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <Shield size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-800 font-semibold uppercase tracking-wide">
                  Status
                </p>
                <p className="text-sm text-green-700 font-bold">
                  Terdaftar
                </p>
                <p className="text-[11px] text-green-600 mt-0.5">
                  Menunggu verifikasi panitia
                </p>
              </div>
            </div>

            {/* Tanggal Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-blue-800 font-semibold uppercase tracking-wide">
                  Tanggal Daftar
                </p>
                <p className="text-sm text-blue-700 font-bold">
                  {tanggalDaftar}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6">
            <div className="border-t-2 border-dotted border-gray-200" />
          </div>

          {/* Instruksi */}
          <div className="px-6 py-4 print:py-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-imm-black mb-3 print:mb-2 uppercase tracking-wide">
              <BookOpen size={16} className="text-imm-red" />
              Langkah Selanjutnya
            </h3>
            <div className="space-y-2 print:space-y-1">
              {[
                {
                  no: "01",
                  text: "Simpan atau cetak bukti pendaftaran ini sebagai arsip.",
                  color: "bg-red-50 text-imm-red border-red-200",
                },
                {
                  no: "02",
                  text: "Tunggu konfirmasi dari panitia melalui email atau WhatsApp.",
                  color: "bg-amber-50 text-amber-700 border-amber-200",
                },
                {
                  no: "03",
                  text: "Persiapkan diri untuk mengikuti kegiatan perkaderan.",
                  color: "bg-blue-50 text-blue-700 border-blue-200",
                },
                {
                  no: "04",
                  text: "Hubungi panitia jika ada pertanyaan lebih lanjut.",
                  color: "bg-green-50 text-green-700 border-green-200",
                },
              ].map((item) => (
                <div
                  key={item.no}
                  className={`flex items-center gap-3 p-2.5 print:p-2 rounded-xl border ${item.color}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0">
                    {item.no}
                  </span>
                  <p className="text-sm leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 print:py-3 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-imm-gray-dark">
                <Users size={14} className="text-imm-red" />
                <span>Pimpinan Komisariat IMM</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-imm-gray-dark">
                <Phone size={14} className="text-imm-red" />
                <span>Hubungi panitia untuk informasi</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 text-center">
              <p className="text-[10px] text-gray-400 italic">
                Dokumen ini dicetak secara otomatis oleh sistem dan sah tanpa
                tanda tangan.
              </p>
            </div>
          </div>
        </div>

        {/* Screen-only Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 print:hidden">
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center justify-center gap-2 bg-linear-to-r from-imm-red to-imm-red-dark text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Printer
              size={18}
              className="group-hover:rotate-[-8deg] transition-transform"
            />
            Cetak Bukti Pendaftaran
          </button>
          <Link
            href="/cek-status"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-imm-black font-semibold px-8 py-3.5 rounded-2xl hover:bg-imm-gray hover:border-gray-300 transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Cek Status Pendaftaran
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
