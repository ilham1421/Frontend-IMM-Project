import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-imm-gray p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl font-bold text-imm-red mb-2">404</div>
        <h1 className="text-xl font-bold text-imm-black mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-imm-gray-dark mb-6">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-imm-red text-white font-semibold px-6 py-3 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
