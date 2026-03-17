"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/Toast";
import { ClipboardList, Upload, XCircle, Building2, CheckCircle2, ArrowRight, CalendarRange, FileCheck } from "lucide-react";

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
  komisariatIds: number[];
};

type Komisariat = {
  id: number;
  nama: string;
};

type PersyaratanItem = {
  id: number;
  nama: string;
  jenis: "file" | "teks" | "checkbox" | "paragraf" | "pilihan_ganda";
  wajib: boolean;
  opsi?: string[];
};

type FormData = {
  namaLengkap: string;
  nim: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  email: string;
  noHp: string;
  universitas: string;
  fakultas: string;
  prodi: string;
  komisariat: string;
  alamat: string;
  kegiatanId: number;
};

export default function PendaftaranPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><p className="text-imm-gray-dark">Memuat...</p></div>}>
      <PendaftaranContent />
    </Suspense>
  );
}

function PendaftaranContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [allKomisariat, setAllKomisariat] = useState<Komisariat[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<"select" | "check" | "form">("select");
  const [selectedSingkatan, setSelectedSingkatan] = useState<string | null>(null);
  const [selectedKegiatan, setSelectedKegiatan] = useState<Kegiatan | null>(null);
  const [selectedKomisariat, setSelectedKomisariat] = useState("");
  const [checkResult, setCheckResult] = useState<boolean | null>(null);
  const [persyaratanList, setPersyaratanList] = useState<PersyaratanItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/kegiatan").then((r) => r.json()),
      fetch("/api/komisariat").then((r) => r.json()),
    ])
      .then(([kegiatan, komisariat]) => {
        const openKegiatan = (kegiatan as Kegiatan[]).filter((k) => k.statusBuka);
        setKegiatanList(openKegiatan);
        setAllKomisariat(komisariat);

        // Auto-select if kegiatan id is in query param
        const kegiatanParam = searchParams.get("kegiatan");
        if (kegiatanParam) {
          const found = openKegiatan.find((k) => k.id === Number(kegiatanParam));
          if (found) {
            setSelectedSingkatan(found.singkatan);
            setStep("check");
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  // Group kegiatan by singkatan (show 1 card per type)
  const groupedKegiatan = kegiatanList.reduce((acc, k) => {
    if (!acc[k.singkatan]) acc[k.singkatan] = k;
    return acc;
  }, {} as Record<string, Kegiatan>);

  // Strip komisariat suffix from name for grouped display (e.g. "DAD 2026 - FKIP" → "DAD 2026")
  const getCleanName = (name: string) => {
    const parts = name.split(" - ");
    return parts.length > 1 ? parts.slice(0, -1).join(" - ") : name;
  };

  const handleSelectKegiatan = (singkatan: string) => {
    setSelectedSingkatan(singkatan);
    setSelectedKomisariat("");
    setCheckResult(null);
    setSelectedKegiatan(null);
    setStep("check");
  };

  const handleCheckKomisariat = () => {
    if (!selectedKomisariat || !selectedSingkatan) return;
    const komFound = allKomisariat.find((k) => k.nama === selectedKomisariat);
    if (!komFound) { setCheckResult(false); return; }

    // Find a kegiatan with this singkatan that includes this komisariat
    const matchingKegiatan = kegiatanList.find(
      (k) => k.singkatan === selectedSingkatan && k.komisariatIds.includes(komFound.id)
    );

    if (matchingKegiatan) {
      setSelectedKegiatan(matchingKegiatan);
      setCheckResult(true);
    } else {
      setSelectedKegiatan(null);
      setCheckResult(false);
    }
  };

  const handleLanjutDaftar = () => {
    if (!selectedKegiatan) return;
    setFormData((prev) => ({
      ...prev,
      komisariat: selectedKomisariat,
      kegiatanId: selectedKegiatan.id,
    }));
    fetch(`/api/persyaratan?kegiatanId=${selectedKegiatan.id}`)
      .then((r) => r.json())
      .then((data) => setPersyaratanList(data))
      .catch(() => {});
    setStep("form");
  };

  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "",
    nim: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    email: "",
    noHp: "",
    universitas: "",
    fakultas: "",
    prodi: "",
    komisariat: "",
    alamat: "",
    kegiatanId: 0,
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    kta: null,
    ktm: null,
    pasFoto: null,
    suratRekomendasi: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [persyaratanAnswers, setPersyaratanAnswers] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData();
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, String(value));
      });

      // Append uploaded files + their label names
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          fd.append("berkas", file);
          // Find the matching persyaratan label
          const pId = key.replace("persyaratan_", "");
          const persyaratan = persyaratanList.find((p) => String(p.id) === pId);
          fd.append("berkasNames", persyaratan?.nama || file.name);
        }
      });

      // Append non-file persyaratan answers
      const jawaban = persyaratanList
        .filter((p) => p.jenis !== "file")
        .map((p) => ({
          persyaratanId: p.id,
          nama: p.nama,
          jenis: p.jenis,
          nilai: persyaratanAnswers[`persyaratan_${p.id}`] || "",
        }))
        .filter((j) => j.nilai);
      if (jawaban.length > 0) {
        fd.append("jawaban", JSON.stringify(jawaban));
      }

      const res = await fetch("/api/peserta", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/sukses?no=${data.noPendaftaran}`);
      } else {
        showToast(data.error || "Gagal mengirim pendaftaran", "error");
        setSubmitting(false);
      }
    } catch {
      showToast("Terjadi kesalahan. Coba lagi.", "error");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-imm-gray-dark">Memuat...</p>
      </div>
    );
  }

  if (kegiatanList.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircle size={64} className="mx-auto mb-6 text-imm-red" />
          <h1 className="text-2xl font-bold text-imm-black mb-4">
            Tidak Ada Kegiatan Terbuka
          </h1>
          <p className="text-imm-gray-dark">
            Saat ini belum ada kegiatan perkaderan yang membuka pendaftaran. Silakan menunggu informasi berikutnya.
          </p>
        </div>
      </div>
    );
  }

  // Step 1: Select kegiatan
  if (step === "select") {
    return (
      <div>
        <section className="bg-gradient-to-r from-imm-red to-imm-red-dark text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <CalendarRange size={48} className="mx-auto mb-4 text-imm-yellow" />
            <h1 className="text-3xl font-bold mb-2">Pilih Kegiatan</h1>
            <p className="text-white/80">Pilih kegiatan perkaderan yang ingin kamu ikuti</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(groupedKegiatan).map((k) => (
                <button
                  key={k.singkatan}
                  onClick={() => handleSelectKegiatan(k.singkatan)}
                  className="text-left bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-imm-red transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold bg-imm-red text-white px-3 py-1 rounded-full">{k.singkatan}</span>
                    <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Dibuka</span>
                  </div>
                  <h3 className="text-lg font-bold text-imm-black mb-2">{getCleanName(k.namaKegiatan)}</h3>
                  <p className="text-sm text-imm-gray-dark mb-3 line-clamp-2">{k.deskripsi}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-imm-red font-semibold text-sm">
                    Pilih Kegiatan Ini
                    <ArrowRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Step 2: Check komisariat
  if (step === "check" && selectedSingkatan) {
    const representativeKegiatan = groupedKegiatan[selectedSingkatan];
    const displayName = representativeKegiatan ? getCleanName(representativeKegiatan.namaKegiatan) : selectedSingkatan;

    return (
      <div>
        <section className="bg-gradient-to-r from-imm-red to-imm-red-dark text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Building2 size={48} className="mx-auto mb-4 text-imm-yellow" />
            <h1 className="text-3xl font-bold mb-2">Cek Komisariat</h1>
            <p className="text-white/80">Pastikan komisariat kamu menyelenggarakan {displayName}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="mb-6 p-4 bg-imm-gray rounded-xl">
                <p className="text-xs text-imm-gray-dark mb-1">Kegiatan yang dipilih</p>
                <p className="font-bold text-imm-black">{displayName}</p>
                <button
                  onClick={() => { setStep("select"); setCheckResult(null); setSelectedKomisariat(""); setSelectedSingkatan(null); setSelectedKegiatan(null); }}
                  className="text-xs text-imm-red hover:underline mt-1"
                >
                  Ganti kegiatan
                </button>
              </div>

              <h2 className="text-lg font-bold text-imm-black mb-2">Pilih Komisariat Kamu</h2>
              <p className="text-sm text-imm-gray-dark mb-6">
                Pilih komisariat untuk mengecek apakah menyelenggarakan kegiatan ini.
              </p>

              <select
                value={selectedKomisariat}
                onChange={(e) => { setSelectedKomisariat(e.target.value); setCheckResult(null); }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none mb-4"
              >
                <option value="">-- Pilih Komisariat --</option>
                {allKomisariat.map((k) => (
                  <option key={k.id} value={k.nama}>{k.nama}</option>
                ))}
              </select>

              <button
                onClick={handleCheckKomisariat}
                disabled={!selectedKomisariat}
                className="w-full bg-imm-red text-white font-semibold py-3 rounded-xl hover:bg-imm-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Cek Ketersediaan
              </button>

              {checkResult === true && selectedKegiatan && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                  <CheckCircle2 size={40} className="mx-auto mb-3 text-green-500" />
                  <h3 className="font-bold text-green-800 mb-1">
                    Komisariat {selectedKomisariat} Menyelenggarakan!
                  </h3>
                  <p className="text-sm text-green-700 mb-4">
                    Komisariat kamu ikut menyelenggarakan {displayName}. Silakan lanjut ke formulir pendaftaran.
                  </p>
                  <button
                    onClick={handleLanjutDaftar}
                    className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm"
                  >
                    Lanjut Daftar
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {checkResult === false && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-5 text-center">
                  <XCircle size={40} className="mx-auto mb-3 text-imm-red" />
                  <h3 className="font-bold text-red-800 mb-1">
                    Komisariat {selectedKomisariat} Tidak Menyelenggarakan
                  </h3>
                  <p className="text-sm text-red-700">
                    Maaf, komisariat kamu belum terdaftar sebagai penyelenggara {displayName}. Silakan hubungi pengurus komisariat untuk informasi lebih lanjut.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-imm-red to-imm-red-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ClipboardList size={48} className="mx-auto mb-4 text-imm-yellow" />
          <h1 className="text-3xl font-bold mb-2">Formulir Pendaftaran</h1>
          <p className="text-white/80">Isi data diri kamu dengan lengkap dan benar</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Data Diri */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-imm-black mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-imm-red rounded-full" />
                Data Diri Peserta
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    NIM *
                  </label>
                  <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                    placeholder="Nomor Induk Mahasiswa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                  >
                    <option value="">Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                    placeholder="Kota tempat lahir"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    No. HP / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="noHp"
                    value={formData.noHp}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Universitas *
                  </label>
                  <input
                    type="text"
                    name="universitas"
                    value={formData.universitas}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                    placeholder="Nama universitas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Fakultas *
                  </label>
                  <input
                    type="text"
                    name="fakultas"
                    value={formData.fakultas}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                    placeholder="Nama fakultas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Program Studi *
                  </label>
                  <input
                    type="text"
                    name="prodi"
                    value={formData.prodi}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                    placeholder="Nama program studi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Komisariat *
                  </label>
                  <input
                    type="text"
                    value={formData.komisariat}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-imm-black cursor-not-allowed outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-imm-black mb-1">
                    Alamat Domisili *
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none resize-none"
                    placeholder="Alamat lengkap"
                  />
                </div>
              </div>
            </div>

            {/* Berkas Persyaratan */}
            {persyaratanList.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-imm-black mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-imm-yellow rounded-full" />
                  Persyaratan Pendaftaran
                </h2>
                <div className="space-y-4">
                  {persyaratanList.map((item) => (
                    <div key={item.id}>
                      <label className="block text-sm font-medium text-imm-black mb-1">
                        {item.nama} {item.wajib && "*"}
                      </label>
                      {item.jenis === "file" && (
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 bg-imm-gray px-4 py-2.5 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm">
                            <Upload size={16} className="text-imm-red" />
                            Pilih File
                            <input
                              type="file"
                              name={`persyaratan_${item.id}`}
                              onChange={handleFileChange}
                              accept=".jpg,.jpeg,.png,.pdf"
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-imm-gray-dark">
                            {files[`persyaratan_${item.id}`]
                              ? files[`persyaratan_${item.id}`]!.name
                              : "Belum ada file dipilih"}
                          </span>
                        </div>
                      )}
                      {item.jenis === "teks" && (
                        <input
                          type="text"
                          value={persyaratanAnswers[`persyaratan_${item.id}`] || ""}
                          onChange={(e) => setPersyaratanAnswers({ ...persyaratanAnswers, [`persyaratan_${item.id}`]: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                          placeholder={`Tulis ${item.nama.toLowerCase()}`}
                        />
                      )}
                      {item.jenis === "paragraf" && (
                        <textarea
                          value={persyaratanAnswers[`persyaratan_${item.id}`] || ""}
                          onChange={(e) => setPersyaratanAnswers({ ...persyaratanAnswers, [`persyaratan_${item.id}`]: e.target.value })}
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none resize-none"
                          placeholder={`Tulis ${item.nama.toLowerCase()}`}
                        />
                      )}
                      {item.jenis === "pilihan_ganda" && item.opsi && (
                        <div className="space-y-2">
                          {item.opsi.map((opsi, idx) => (
                            <label key={idx} className="flex items-center gap-2 text-sm text-imm-gray-dark cursor-pointer">
                              <input
                                type="radio"
                                name={`persyaratan_${item.id}`}
                                value={opsi}
                                checked={persyaratanAnswers[`persyaratan_${item.id}`] === opsi}
                                onChange={(e) => setPersyaratanAnswers({ ...persyaratanAnswers, [`persyaratan_${item.id}`]: e.target.value })}
                                className="w-4 h-4 accent-imm-red"
                              />
                              {opsi}
                            </label>
                          ))}
                        </div>
                      )}
                      {item.jenis === "checkbox" && (
                        <label className="flex items-center gap-2 text-sm text-imm-gray-dark cursor-pointer">
                          <input
                            type="checkbox"
                            checked={persyaratanAnswers[`persyaratan_${item.id}`] === "Ya"}
                            onChange={(e) => setPersyaratanAnswers({ ...persyaratanAnswers, [`persyaratan_${item.id}`]: e.target.checked ? "Ya" : "" })}
                            className="w-4 h-4 accent-imm-red"
                          />
                          {item.nama}
                        </label>
                      )}
                    </div>
                  ))}
                  <p className="text-xs text-imm-gray-dark mt-2">
                    Format file: JPG, PNG, atau PDF. Maksimal 2MB per file.
                  </p>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="bg-imm-red text-white font-bold px-12 py-4 rounded-xl hover:bg-imm-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
              </button>
              <p className="text-xs text-imm-gray-dark mt-3">
                Pastikan semua data sudah benar sebelum mengirim.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
