"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  CalendarDays,
  MapPin,
  Target,
  Users,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Sparkles,
  Shield,
  Heart,
  GraduationCap,
  Star,
  ChevronRight,
} from "lucide-react";

type Kegiatan = {
  id: number;
  namaKegiatan: string;
  singkatan: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasi: string;
  kuotaPeserta: number;
  statusBuka: boolean;
};

export default function HomePage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kegiatan")
      .then((res) => res.json())
      .then((data) => setKegiatanList(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeKegiatan = kegiatanList.filter((k) => k.statusBuka);
  const hasActive = activeKegiatan.length > 0;

  // Group by singkatan for display
  const grouped = kegiatanList.reduce((acc, k) => {
    if (!acc[k.singkatan]) acc[k.singkatan] = k;
    return acc;
  }, {} as Record<string, Kegiatan>);

  return (
    <>
      <Header />
      <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-imm-red via-imm-red-dark to-imm-black text-white min-h-[85vh] flex items-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-imm-yellow/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-imm-red-light/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 text-sm mb-8">
                {hasActive ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                    </span>
                    <span className="font-medium">{activeKegiatan.length} Kegiatan Sedang Dibuka</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                    <span className="font-medium">Belum Ada Kegiatan Terbuka</span>
                  </>
                )}
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                Perkaderan
                <br />
                <span className="relative">
                  <span className="text-imm-yellow">IMM</span>
                  <Sparkles size={24} className="absolute -top-2 -right-8 text-imm-yellow animate-pulse" />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-xl">
                Membentuk kader yang unggul dalam <span className="text-white font-medium">intelektualitas</span>, <span className="text-white font-medium">spiritualitas</span>, dan <span className="text-white font-medium">humanitas</span> melalui program perkaderan terstruktur.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {hasActive ? (
                  <Link
                    href="/pendaftaran"
                    className="group inline-flex items-center justify-center gap-2 bg-imm-yellow text-imm-black font-bold px-8 py-4 rounded-2xl hover:bg-imm-yellow-light transition-all text-lg shadow-lg shadow-imm-yellow/20 hover:shadow-xl hover:shadow-imm-yellow/30"
                  >
                    Daftar Sekarang
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-bold px-8 py-4 rounded-2xl cursor-not-allowed text-lg backdrop-blur">
                    Pendaftaran Belum Dibuka
                  </span>
                )}
                <Link
                  href="/informasi"
                  className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all text-lg"
                >
                  Pelajari Lebih Lanjut
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
                {[
                  { value: kegiatanList.length, label: "Kegiatan" },
                  { value: "6", label: "Jenjang" },
                  { value: "8", label: "Komisariat" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl md:text-3xl font-extrabold text-imm-yellow">{s.value}</p>
                    <p className="text-xs text-white/50 font-medium uppercase tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — decorative card stack */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-80">
                {/* Background cards */}
                <div className="absolute top-6 -left-4 w-full h-72 bg-white/5 backdrop-blur rounded-3xl -rotate-6 border border-white/10" />
                <div className="absolute top-3 -left-2 w-full h-72 bg-white/10 backdrop-blur rounded-3xl -rotate-3 border border-white/10" />
                {/* Main card */}
                <div className="relative w-full bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Image src="/logo-IMM.png" alt="Logo IMM" width={64} height={64} className="w-16 h-16 object-contain" />
                    </div>
                  </div>
                  <h3 className="text-center text-xl font-bold mb-2">Ikatan Mahasiswa<br />Muhammadiyah</h3>
                  <p className="text-center text-white/60 text-sm mb-6">Program Perkaderan Resmi</p>
                  <div className="space-y-3">
                    {["Darul Arqam Dasar (DAD)", "Darul Arqam Madya (DAM)", "Darul Arqam Paripurna (DAP)", "Pelatihan Instruktur Dasar (PID)", "Pelatihan Instruktur Madya (PIM)", "Pelatihan Instruktur Paripurna (PIP)"].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          i < 3 ? ["bg-emerald-500/30 text-emerald-300", "bg-amber-500/30 text-amber-300", "bg-purple-500/30 text-purple-300"][i]
                          : ["bg-sky-500/30 text-sky-300", "bg-orange-500/30 text-orange-300", "bg-rose-500/30 text-rose-300"][i - 3]
                        }`}>
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-imm-red text-sm font-bold uppercase tracking-widest mb-3">
              <span className="w-8 h-px bg-imm-red" />
              Nilai Kami
              <span className="w-8 h-px bg-imm-red" />
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-imm-black mb-4">
              Pilar Perkaderan IMM
            </h2>
            <p className="text-imm-gray-dark max-w-2xl mx-auto text-lg">
              Tiga fondasi utama yang menjadi landasan pembentukan kader IMM
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Intelektualitas",
                desc: "Mengembangkan daya pikir kritis, analitis, dan akademis untuk menjadi intelektual yang bertanggung jawab.",
                color: "from-blue-500 to-indigo-600",
                bg: "bg-blue-50",
              },
              {
                icon: Shield,
                title: "Spiritualitas",
                desc: "Memperdalam pemahaman keislaman dan kemuhammadiyahan sebagai landasan keimanan dan ketakwaan.",
                color: "from-emerald-500 to-teal-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Heart,
                title: "Humanitas",
                desc: "Menumbuhkan kepekaan sosial dan kepedulian terhadap sesama sebagai wujud pengabdian kepada masyarakat.",
                color: "from-rose-500 to-pink-600",
                bg: "bg-rose-50",
              },
            ].map((item, i) => (
              <div key={i} className="group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-imm-black mb-3">{item.title}</h3>
                <p className="text-imm-gray-dark leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daftar Kegiatan */}
      {!loading && kegiatanList.length > 0 && (
        <section className="py-20 bg-imm-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <span className="inline-flex items-center gap-2 text-imm-red text-sm font-bold uppercase tracking-widest mb-3">
                  <CalendarDays size={16} />
                  Kegiatan
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-imm-black">Kegiatan Tersedia</h2>
                <p className="text-imm-gray-dark mt-2">Pilih kegiatan perkaderan yang ingin kamu ikuti</p>
              </div>
              {hasActive && (
                <Link
                  href="/pendaftaran"
                  className="inline-flex items-center gap-2 text-imm-red font-semibold hover:underline text-sm"
                >
                  Lihat Semua Kegiatan <ArrowRight size={16} />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(grouped).map((k) => {
                const isOpen = kegiatanList.some((kg) => kg.singkatan === k.singkatan && kg.statusBuka);
                return (
                  <div key={k.singkatan} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
                    {/* Color stripe */}
                    <div className={`h-1.5 ${isOpen ? "bg-linear-to-r from-imm-red to-imm-yellow" : "bg-gray-300"}`} />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold bg-imm-red text-white px-4 py-1.5 rounded-xl shadow-sm">{k.singkatan}</span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                          isOpen ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {isOpen && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                          {isOpen ? "Dibuka" : "Ditutup"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-imm-black mb-2 group-hover:text-imm-red transition-colors">
                        {k.namaKegiatan.split(" - ")[0]}
                      </h3>
                      <p className="text-sm text-imm-gray-dark mb-4 line-clamp-2">{k.deskripsi}</p>

                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm text-imm-gray-dark">
                          <CalendarDays size={14} className="text-imm-red shrink-0" />
                          <span>
                            {new Date(k.tanggalMulai).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - {new Date(k.tanggalSelesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-imm-gray-dark">
                          <MapPin size={14} className="text-imm-red shrink-0" />
                          <span className="truncate">{k.lokasi}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-imm-gray-dark">
                          <Users size={14} className="text-imm-red shrink-0" />
                          <span>Kuota: {k.kuotaPeserta} peserta</span>
                        </div>
                      </div>

                      {isOpen && (
                        <Link
                          href="/pendaftaran"
                          className="group/btn w-full inline-flex items-center justify-center gap-2 bg-imm-red text-white font-semibold py-3 rounded-2xl hover:bg-imm-red-dark transition-all text-sm shadow-sm hover:shadow-md"
                        >
                          Daftar Sekarang
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tujuan Kegiatan */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-imm-red text-sm font-bold uppercase tracking-widest mb-3">
                <Target size={16} />
                Tujuan
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-imm-black mb-6">
                Mengapa Harus Ikut<br />Perkaderan?
              </h2>
              <p className="text-imm-gray-dark text-lg mb-8 leading-relaxed">
                Program perkaderan IMM dirancang untuk membangun fondasi yang kokoh bagi setiap kader agar siap menjadi pemimpin masa depan.
              </p>
              {hasActive && (
                <Link
                  href="/pendaftaran"
                  className="inline-flex items-center gap-2 bg-imm-red text-white font-bold px-6 py-3 rounded-2xl hover:bg-imm-red-dark transition-colors shadow-sm"
                >
                  Daftar Sekarang <ArrowRight size={18} />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: BookOpen, text: "Memahami ideologi dan nilai-nilai dasar IMM", color: "text-blue-600 bg-blue-50" },
                { icon: Shield, text: "Membentuk karakter kader yang militan dan disiplin", color: "text-emerald-600 bg-emerald-50" },
                { icon: Star, text: "Meningkatkan wawasan keislaman dan kemuhammadiyahan", color: "text-amber-600 bg-amber-50" },
                { icon: Users, text: "Membangun jiwa kepemimpinan dan keorganisasian", color: "text-purple-600 bg-purple-50" },
                { icon: Heart, text: "Menguatkan ukhuwah antar kader IMM", color: "text-rose-600 bg-rose-50" },
                { icon: GraduationCap, text: "Mempersiapkan kader untuk jenjang berikutnya", color: "text-indigo-600 bg-indigo-50" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-imm-black leading-snug mt-1">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jenjang Perkaderan */}
      <section className="py-20 bg-imm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-imm-red text-sm font-bold uppercase tracking-widest mb-3">
              <GraduationCap size={16} />
              Jenjang
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-imm-black mb-4">
              Tahapan Perkaderan
            </h2>
            <p className="text-imm-gray-dark max-w-2xl mx-auto text-lg">
              Setiap jenjang dirancang untuk membangun kapasitas kader secara bertahap
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                level: "1",
                title: "Darul Arqam Dasar",
                abbr: "DAD",
                desc: "Jenjang pertama perkaderan IMM yang memperkenalkan dasar-dasar organisasi, keislaman, dan kemuhammadiyahan kepada kader baru.",
                color: "from-emerald-500 to-emerald-600",
                border: "border-emerald-200 hover:border-emerald-300",
              },
              {
                level: "2",
                title: "Darul Arqam Madya",
                abbr: "DAM",
                desc: "Jenjang menengah yang memperdalam wawasan ideologis, kepemimpinan, dan kemampuan analisis kader dalam menghadapi isu-isu kontemporer.",
                color: "from-amber-500 to-amber-600",
                border: "border-amber-200 hover:border-amber-300",
              },
              {
                level: "3",
                title: "Darul Arqam Paripurna",
                abbr: "DAP",
                desc: "Jenjang tertinggi perkaderan Darul Arqam yang mempersiapkan kader menjadi pemimpin organisasi dengan kapasitas strategis dan visioner.",
                color: "from-purple-500 to-purple-600",
                border: "border-purple-200 hover:border-purple-300",
              },
              {
                level: "4",
                title: "Pelatihan Instruktur Dasar",
                abbr: "PID",
                desc: "Pelatihan dasar untuk calon instruktur perkaderan IMM agar mampu memfasilitasi kegiatan perkaderan tingkat awal.",
                color: "from-sky-500 to-sky-600",
                border: "border-sky-200 hover:border-sky-300",
              },
              {
                level: "5",
                title: "Pelatihan Instruktur Madya",
                abbr: "PIM",
                desc: "Pelatihan menengah instruktur yang mengasah kemampuan fasilitasi, penguasaan materi, dan metodologi perkaderan lanjutan.",
                color: "from-orange-500 to-orange-600",
                border: "border-orange-200 hover:border-orange-300",
              },
              {
                level: "6",
                title: "Pelatihan Instruktur Paripurna",
                abbr: "PIP",
                desc: "Jenjang tertinggi pelatihan instruktur yang mencetak instruktur senior dengan keahlian strategis dalam sistem perkaderan IMM.",
                color: "from-rose-500 to-rose-600",
                border: "border-rose-200 hover:border-rose-300",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border ${item.border} overflow-hidden`}
              >
                {/* Level indicator */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <span className="text-8xl font-black text-imm-black">{item.level}</span>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <span className="text-white text-lg font-extrabold">{item.level}</span>
                </div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-imm-black">{item.title}</h3>
                  <span className="text-xs font-bold text-imm-gray-dark bg-imm-gray px-2 py-0.5 rounded-md">{item.abbr}</span>
                </div>
                <p className="text-sm text-imm-gray-dark leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-imm-red via-imm-red-dark to-red-900" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-imm-yellow/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Target size={32} className="text-imm-yellow" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            Siap Menjadi<br />
            <span className="text-imm-yellow">Kader Terbaik?</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            Bergabunglah dengan ribuan kader IMM lainnya. Bangun kapasitas dirimu melalui program perkaderan yang terstruktur dan bermakna.
          </p>
          {hasActive ? (
            <Link
              href="/pendaftaran"
              className="group inline-flex items-center gap-3 bg-imm-yellow text-imm-black font-bold px-10 py-5 rounded-2xl hover:bg-imm-yellow-light transition-all text-lg shadow-lg shadow-imm-yellow/20 hover:shadow-xl hover:shadow-imm-yellow/30"
            >
              Daftar Sekarang
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              href="/informasi"
              className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/20 transition-all text-lg"
            >
              Lihat Informasi
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </section>
    </div>
      <Footer />
    </>
  );
}
