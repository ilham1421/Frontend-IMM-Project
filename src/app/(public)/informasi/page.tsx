"use client";

import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  HelpCircle,
} from "lucide-react";

export default function InformasiPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-imm-red to-imm-red-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-imm-yellow" />
          <h1 className="text-4xl font-bold mb-4">Informasi Perkaderan</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Semua yang perlu kamu ketahui tentang perkaderan IMM
          </p>
        </div>
      </section>

      {/* Tentang Kegiatan */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-imm-black mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-imm-red rounded-full" />
            Tentang Perkaderan IMM
          </h2>
          <div className="prose max-w-none text-imm-gray-dark leading-relaxed space-y-4">
            <p>
              <strong>Perkaderan IMM</strong> adalah rangkaian program pembinaan kader Ikatan Mahasiswa Muhammadiyah (IMM).
              Program ini terdiri dari beberapa jenjang seperti Darul Arqam Dasar (DAD), Darul Arqam Madya (DAM),
              dan Darul Arqam Istimewa (DAI).
            </p>
            <p>
              Melalui kegiatan ini, peserta diharapkan mampu memahami visi, misi,
              dan nilai-nilai dasar yang menjadi fondasi pergerakan IMM.
            </p>
          </div>
        </div>
      </section>

      {/* Syarat Peserta */}
      <section className="py-16 bg-imm-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-imm-black mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-imm-red rounded-full" />
            Syarat Umum Peserta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Mahasiswa aktif yang terdaftar di perguruan tinggi",
              "Telah menjadi anggota IMM dan memiliki Kartu Tanda Anggota (KTA)",
              `Belum pernah mengikuti jenjang perkaderan ini sebelumnya`,
              "Bersedia mengikuti seluruh rangkaian kegiatan",
              "Mengisi formulir pendaftaran dengan lengkap dan benar",
              "Melampirkan berkas persyaratan yang ditentukan",
              "Mendapat rekomendasi dari komisariat asal",
              "Sehat jasmani dan rohani",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm"
              >
                <CheckCircle
                  size={18}
                  className="text-imm-red mt-0.5 shrink-0"
                />
                <span className="text-sm text-imm-gray-dark">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ketentuan */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-imm-black mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-imm-yellow rounded-full" />
            Ketentuan
          </h2>
          <div className="space-y-4">
            {[
              "Peserta wajib hadir tepat waktu sesuai jadwal yang ditentukan.",
              "Peserta wajib mengenakan pakaian rapi dan sopan sesuai ketentuan panitia.",
              "Peserta dilarang membawa senjata tajam atau benda berbahaya.",
              "Peserta wajib menjaga ketertiban dan keamanan selama kegiatan berlangsung.",
              `Peserta yang tidak memenuhi persyaratan akan dinyatakan tidak lulus perkaderan.`,
              "Keputusan panitia bersifat final dan tidak dapat diganggu gugat.",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 border-l-4 border-imm-yellow bg-imm-yellow/5 rounded-r-xl"
              >
                <AlertCircle
                  size={18}
                  className="text-imm-yellow mt-0.5 shrink-0"
                />
                <span className="text-sm text-imm-gray-dark">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-imm-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-imm-black mb-6 flex items-center gap-2">
            <HelpCircle size={24} className="text-imm-red" />
            FAQ (Pertanyaan Umum)
          </h2>
          <div className="space-y-4">
            {[
              {
                q: `Apakah perkaderan wajib diikuti?`,
                a: `Silakan hubungi panitia untuk informasi lebih lanjut mengenai kewajiban mengikuti perkaderan.`,
              },
              {
                q: `Berapa biaya pendaftaran perkaderan?`,
                a: "Biaya pendaftaran akan diinformasikan lebih lanjut oleh panitia masing-masing komisariat.",
              },
              {
                q: `Apakah bisa mengulang jika tidak lulus?`,
                a: `Ya, peserta yang tidak lulus dapat mengikuti perkaderan pada periode berikutnya.`,
              },
              {
                q: `Apa yang didapat setelah lulus perkaderan?`,
                a: `Peserta akan mendapatkan sertifikat kelulusan dan berhak melanjutkan ke jenjang perkaderan berikutnya.`,
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-imm-black mb-2">
                  {item.q}
                </h3>
                <p className="text-sm text-imm-gray-dark">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-imm-black mb-6">
            Kontak Panitia
          </h2>
          <p className="text-imm-gray-dark mb-8">
            Punya pertanyaan? Hubungi panitia melalui:
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-3 bg-imm-gray px-6 py-4 rounded-xl">
              <Phone size={20} className="text-imm-red" />
              <span className="text-sm">+62 812-3456-7890</span>
            </div>
            <div className="flex items-center gap-3 bg-imm-gray px-6 py-4 rounded-xl">
              <Mail size={20} className="text-imm-red" />
              <span className="text-sm">panitia@imm.or.id</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
