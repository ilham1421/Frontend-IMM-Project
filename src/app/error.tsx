"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-imm-gray p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-imm-black mb-2">Terjadi Kesalahan</h1>
        <p className="text-sm text-imm-gray-dark mb-6">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-imm-red text-white font-semibold px-6 py-3 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
        >
          <RotateCcw size={16} />
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
