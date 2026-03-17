// ===================== MOCKUP DATA =====================
// Data mockup untuk deployment Vercel tanpa backend

export type Komisariat = {
  id: number;
  nama: string;
  createdAt: string;
  updatedAt: string;
};

export type Kegiatan = {
  id: number;
  namaKegiatan: string;
  singkatan: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasi: string;
  kuotaPeserta: number;
  batasRegistrasi: string;
  statusBuka: boolean;
  komisariatIds: number[];
  createdAt: string;
  updatedAt: string;
};

export type Persyaratan = {
  id: number;
  kegiatanId: number;
  nama: string;
  jenis: string;
  wajib: boolean;
  opsi: string[] | null;
  urutan: number;
  aktif: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Peserta = {
  id: number;
  noPendaftaran: string;
  kegiatanId: number;
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
  status: string;
  berkas: { namaBerkas: string; namaFile: string; originalName: string }[];
  jawaban: { pertanyaan: string; jawaban: string }[];
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  nama: string;
  username: string;
  role: string;
  komisariat: string | null;
  aktif: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StatusLog = {
  id: number;
  pesertaId: number;
  noPendaftaran: string;
  statusLama: string;
  statusBaru: string;
  diubahOleh: string;
  role: string;
  waktu: string;
  emailTerkirim: boolean;
};

// =================== KOMISARIAT ===================
export const komisariatData: Komisariat[] = [
  { id: 1, nama: "FKIP", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 2, nama: "FISIP", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 3, nama: "FEB", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 4, nama: "Teknik", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 5, nama: "Hukum", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 6, nama: "FAI", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 7, nama: "FIKES", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 8, nama: "FKIK", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
];

// =================== KEGIATAN ===================
export const kegiatanData: Kegiatan[] = [
  {
    id: 1,
    namaKegiatan: "Darul Arqam Dasar",
    singkatan: "DAD",
    deskripsi: "Perkaderan utama tingkat dasar untuk memperkenalkan nilai-nilai dasar IMM, keislaman, dan kemuhammadiyahan kepada seluruh kader baru.",
    tanggalMulai: "2026-04-10",
    tanggalSelesai: "2026-04-13",
    lokasi: "Wisma Muhammadiyah, Kampus Utama",
    kuotaPeserta: 200,
    batasRegistrasi: "2026-04-05",
    statusBuka: true,
    komisariatIds: [1, 2, 3, 4, 5, 6, 7, 8],
    createdAt: "2025-12-01T08:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: 2,
    namaKegiatan: "Darul Arqam Madya",
    singkatan: "DAM",
    deskripsi: "Perkaderan lanjutan tingkat menengah untuk mendalami ideologi gerakan, kepemimpinan organisasi, dan kajian keislaman kontemporer.",
    tanggalMulai: "2026-05-20",
    tanggalSelesai: "2026-05-23",
    lokasi: "Aula Fakultas Tarbiyah",
    kuotaPeserta: 100,
    batasRegistrasi: "2026-05-15",
    statusBuka: true,
    komisariatIds: [1, 2, 3, 6],
    createdAt: "2025-12-10T08:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },
  {
    id: 3,
    namaKegiatan: "Darul Arqam Paripurna",
    singkatan: "DAP",
    deskripsi: "Perkaderan tingkat akhir yang mempersiapkan kader untuk menjadi pemimpin organisasi dan penggerak perubahan di masyarakat.",
    tanggalMulai: "2026-07-15",
    tanggalSelesai: "2026-07-19",
    lokasi: "Gedung Dakwah Muhammadiyah",
    kuotaPeserta: 50,
    batasRegistrasi: "2026-07-10",
    statusBuka: false,
    komisariatIds: [1, 2, 5],
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-05T08:00:00Z",
  },
  {
    id: 4,
    namaKegiatan: "Pelatihan Instruktur Dasar",
    singkatan: "PID",
    deskripsi: "Pelatihan untuk mempersiapkan instruktur perkaderan tingkat dasar yang kompeten dan memiliki kemampuan fasilitasi.",
    tanggalMulai: "2026-06-05",
    tanggalSelesai: "2026-06-08",
    lokasi: "Wisma Muhammadiyah, Kampus Utama",
    kuotaPeserta: 40,
    batasRegistrasi: "2026-06-01",
    statusBuka: true,
    komisariatIds: [1, 3, 4, 7],
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
  },
  {
    id: 5,
    namaKegiatan: "Pelatihan Instruktur Madya",
    singkatan: "PIM",
    deskripsi: "Pelatihan instruktur tingkat menengah untuk meningkatkan kemampuan analisis, advokasi, dan manajemen perkaderan.",
    tanggalMulai: "2026-08-10",
    tanggalSelesai: "2026-08-13",
    lokasi: "Aula Universitas Muhammadiyah",
    kuotaPeserta: 30,
    batasRegistrasi: "2026-08-05",
    statusBuka: false,
    komisariatIds: [1, 2],
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-01T08:00:00Z",
  },
];

// =================== PERSYARATAN ===================
export const persyaratanData: Persyaratan[] = [
  // DAD (kegiatanId: 1)
  { id: 1, kegiatanId: 1, nama: "Pas Foto 3x4 (Latar Merah)", jenis: "file", wajib: true, opsi: null, urutan: 1, aktif: true, createdAt: "2025-12-01T08:00:00Z", updatedAt: "2025-12-01T08:00:00Z" },
  { id: 2, kegiatanId: 1, nama: "Fotokopi KTP / KTM", jenis: "file", wajib: true, opsi: null, urutan: 2, aktif: true, createdAt: "2025-12-01T08:00:00Z", updatedAt: "2025-12-01T08:00:00Z" },
  { id: 3, kegiatanId: 1, nama: "Surat Rekomendasi Komisariat", jenis: "file", wajib: true, opsi: null, urutan: 3, aktif: true, createdAt: "2025-12-01T08:00:00Z", updatedAt: "2025-12-01T08:00:00Z" },
  { id: 4, kegiatanId: 1, nama: "Motivasi Mengikuti DAD", jenis: "paragraf", wajib: true, opsi: null, urutan: 4, aktif: true, createdAt: "2025-12-01T08:00:00Z", updatedAt: "2025-12-01T08:00:00Z" },
  { id: 5, kegiatanId: 1, nama: "Apakah Anda bersedia mengikuti seluruh rangkaian kegiatan?", jenis: "pilihan_ganda", wajib: true, opsi: ["Ya, saya bersedia", "Tidak"], urutan: 5, aktif: true, createdAt: "2025-12-01T08:00:00Z", updatedAt: "2025-12-01T08:00:00Z" },

  // DAM (kegiatanId: 2)
  { id: 6, kegiatanId: 2, nama: "Sertifikat DAD", jenis: "file", wajib: true, opsi: null, urutan: 1, aktif: true, createdAt: "2025-12-10T08:00:00Z", updatedAt: "2025-12-10T08:00:00Z" },
  { id: 7, kegiatanId: 2, nama: "Pas Foto 3x4 (Latar Merah)", jenis: "file", wajib: true, opsi: null, urutan: 2, aktif: true, createdAt: "2025-12-10T08:00:00Z", updatedAt: "2025-12-10T08:00:00Z" },
  { id: 8, kegiatanId: 2, nama: "Essay Refleksi Pengalaman Berorganisasi", jenis: "paragraf", wajib: true, opsi: null, urutan: 3, aktif: true, createdAt: "2025-12-10T08:00:00Z", updatedAt: "2025-12-10T08:00:00Z" },
  { id: 9, kegiatanId: 2, nama: "Surat Rekomendasi Pimpinan Komisariat", jenis: "file", wajib: true, opsi: null, urutan: 4, aktif: true, createdAt: "2025-12-10T08:00:00Z", updatedAt: "2025-12-10T08:00:00Z" },

  // DAP (kegiatanId: 3)
  { id: 10, kegiatanId: 3, nama: "Sertifikat DAM", jenis: "file", wajib: true, opsi: null, urutan: 1, aktif: true, createdAt: "2026-01-05T08:00:00Z", updatedAt: "2026-01-05T08:00:00Z" },
  { id: 11, kegiatanId: 3, nama: "Pas Foto 4x6 (Latar Biru)", jenis: "file", wajib: true, opsi: null, urutan: 2, aktif: true, createdAt: "2026-01-05T08:00:00Z", updatedAt: "2026-01-05T08:00:00Z" },
  { id: 12, kegiatanId: 3, nama: "Makalah Analisis Gerakan", jenis: "file", wajib: true, opsi: null, urutan: 3, aktif: true, createdAt: "2026-01-05T08:00:00Z", updatedAt: "2026-01-05T08:00:00Z" },

  // PID (kegiatanId: 4)
  { id: 13, kegiatanId: 4, nama: "Sertifikat DAD", jenis: "file", wajib: true, opsi: null, urutan: 1, aktif: true, createdAt: "2026-01-15T08:00:00Z", updatedAt: "2026-01-15T08:00:00Z" },
  { id: 14, kegiatanId: 4, nama: "Pas Foto 3x4", jenis: "file", wajib: true, opsi: null, urutan: 2, aktif: true, createdAt: "2026-01-15T08:00:00Z", updatedAt: "2026-01-15T08:00:00Z" },
  { id: 15, kegiatanId: 4, nama: "Pengalaman menjadi fasilitator", jenis: "paragraf", wajib: false, opsi: null, urutan: 3, aktif: true, createdAt: "2026-01-15T08:00:00Z", updatedAt: "2026-01-15T08:00:00Z" },
];

// =================== PESERTA ===================
const namaList = [
  "Ahmad Fauzan Hakim", "Siti Nurhaliza Putri", "Muhammad Rizky Ramadhan", "Aisyah Zahra Amalia",
  "Dimas Prasetyo Adi", "Fatimah Az-Zahra", "Arif Rahman Hidayat", "Nadia Safitri Utami",
  "Bayu Firmansyah", "Khansa Nabila Azzahra", "Ilham Maulana Akbar", "Rima Dewi Saraswati",
  "Fajar Nugroho Wibowo", "Anisa Rahmawati", "Galih Satria Pratama", "Layla Nur Hasanah",
  "Yusuf Eka Saputra", "Dhea Ananda Putri", "Rendi Kurniawan", "Wulandari Ningsih",
  "Hadi Pranoto", "Zahra Maharani", "Fikri Abdillah", "Putri Ayu Lestari",
  "Ridwan Kamil Firdaus", "Intan Permatasari", "Bagus Setiawan", "Maya Nur Islami",
  "Taufik Hidayatullah", "Salwa Khairunnisa", "Deni Setiadi", "Rahma Aulia",
  "Wahyu Tri Nugroho", "Alya Fitri Ramadhani", "Surya Adi Pramana", "Dina Mariana",
  "Agung Prasetya", "Nabilah Zulfah", "Hendri Saputra", "Elsa Puspitasari",
];

const universitasList = [
  "Universitas Muhammadiyah Surakarta",
  "Universitas Muhammadiyah Yogyakarta",
  "Universitas Muhammadiyah Malang",
  "Universitas Muhammadiyah Surabaya",
  "Universitas Muhammadiyah Jakarta",
];

const fakultasList = ["FKIP", "FISIP", "FEB", "Teknik", "Hukum", "FAI", "FIKES", "FKIK"];

const prodiMap: Record<string, string[]> = {
  FKIP: ["Pendidikan Matematika", "Pendidikan Bahasa Inggris", "Pendidikan Biologi", "PGSD"],
  FISIP: ["Ilmu Komunikasi", "Hubungan Internasional", "Sosiologi"],
  FEB: ["Manajemen", "Akuntansi", "Ekonomi Pembangunan"],
  Teknik: ["Teknik Informatika", "Teknik Sipil", "Teknik Elektro", "Teknik Mesin"],
  Hukum: ["Ilmu Hukum"],
  FAI: ["Pendidikan Agama Islam", "Hukum Ekonomi Syariah", "Komunikasi dan Penyiaran Islam"],
  FIKES: ["Ilmu Keperawatan", "Farmasi", "Fisioterapi"],
  FKIK: ["Pendidikan Dokter", "Ilmu Gizi"],
};

const statusOptions = ["Menunggu", "Terverifikasi", "Ditolak"];
const komisariatNames = komisariatData.map((k) => k.nama);

function generatePeserta(): Peserta[] {
  const pesertaList: Peserta[] = [];
  let id = 1;

  for (let kegIdx = 0; kegIdx < kegiatanData.length; kegIdx++) {
    const kegiatan = kegiatanData[kegIdx];
    const count = [18, 12, 5, 8, 3][kegIdx]; // different counts per kegiatan

    for (let i = 0; i < count; i++) {
      const namaIdx = (kegIdx * 10 + i) % namaList.length;
      const komisariat = komisariatNames[(kegIdx + i) % komisariatNames.length];
      const fakultas = fakultasList[(kegIdx + i) % fakultasList.length];
      const prodi = prodiMap[fakultas]?.[i % (prodiMap[fakultas]?.length || 1)] || "Umum";
      const univ = universitasList[i % universitasList.length];
      const jk = i % 2 === 0 ? "L" : "P";
      const statusIdx = i < count * 0.5 ? 1 : i < count * 0.8 ? 0 : 2;
      const status = statusOptions[statusIdx];

      const day = String((i % 28) + 1).padStart(2, "0");
      const month = String(((i + kegIdx) % 12) + 1).padStart(2, "0");
      const createdDate = `2026-${String(((kegIdx + 1) % 3) + 1).padStart(2, "0")}-${day}T${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00Z`;

      pesertaList.push({
        id,
        noPendaftaran: `${kegiatan.singkatan}-2026-${String(i + 1).padStart(4, "0")}`,
        kegiatanId: kegiatan.id,
        namaLengkap: namaList[namaIdx],
        nim: `2023${String(kegIdx + 1).padStart(2, "0")}${String(i + 1).padStart(3, "0")}`,
        tempatLahir: ["Jakarta", "Surakarta", "Yogyakarta", "Surabaya", "Bandung", "Semarang", "Malang", "Medan"][i % 8],
        tanggalLahir: `200${3 + (i % 3)}-${month}-${day}`,
        jenisKelamin: jk,
        email: `${namaList[namaIdx].toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "")}@student.ums.ac.id`,
        noHp: `08${String(1200000000 + id * 37).slice(0, 10)}`,
        universitas: univ,
        fakultas,
        prodi,
        komisariat,
        alamat: `Jl. ${["Merdeka", "Pahlawan", "Sudirman", "Gatot Subroto", "Ahmad Yani", "Diponegoro"][i % 6]} No. ${i + 1}, ${["Surakarta", "Yogyakarta", "Surabaya"][i % 3]}`,
        status,
        berkas: [
          { namaBerkas: "Pas Foto 3x4", namaFile: `foto-${id}.jpg`, originalName: "pas_foto.jpg" },
          { namaBerkas: "KTP / KTM", namaFile: `ktp-${id}.pdf`, originalName: "ktp_scan.pdf" },
        ],
        jawaban: kegiatan.id <= 2
          ? [{ pertanyaan: "Motivasi Mengikuti Kegiatan", jawaban: "Saya ingin memperdalam pemahaman tentang nilai-nilai keislaman dan kemuhammadiyahan serta meningkatkan kompetensi kepemimpinan." }]
          : [],
        createdAt: createdDate,
        updatedAt: createdDate,
      });
      id++;
    }
  }

  return pesertaList;
}

export const pesertaData: Peserta[] = generatePeserta();

// =================== USERS ===================
export const usersData: User[] = [
  { id: 1, nama: "Super Administrator", username: "superadmin", role: "superadmin", komisariat: null, aktif: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 2, nama: "Admin FKIP", username: "admin_fkip", role: "admin", komisariat: "FKIP", aktif: true, createdAt: "2025-01-15T10:00:00Z", updatedAt: "2025-01-15T10:00:00Z" },
  { id: 3, nama: "Admin FISIP", username: "admin_fisip", role: "admin", komisariat: "FISIP", aktif: true, createdAt: "2025-01-15T10:00:00Z", updatedAt: "2025-01-15T10:00:00Z" },
  { id: 4, nama: "Admin FEB", username: "admin_feb", role: "admin", komisariat: "FEB", aktif: true, createdAt: "2025-02-01T08:00:00Z", updatedAt: "2025-02-01T08:00:00Z" },
  { id: 5, nama: "Admin Teknik", username: "admin_teknik", role: "admin", komisariat: "Teknik", aktif: true, createdAt: "2025-02-01T08:00:00Z", updatedAt: "2025-02-01T08:00:00Z" },
  { id: 6, nama: "Admin Hukum", username: "admin_hukum", role: "admin", komisariat: "Hukum", aktif: true, createdAt: "2025-02-10T08:00:00Z", updatedAt: "2025-02-10T08:00:00Z" },
  { id: 7, nama: "Admin FAI", username: "admin_fai", role: "admin", komisariat: "FAI", aktif: true, createdAt: "2025-02-10T08:00:00Z", updatedAt: "2025-02-10T08:00:00Z" },
  { id: 8, nama: "Admin FIKES", username: "admin_fikes", role: "admin", komisariat: "FIKES", aktif: false, createdAt: "2025-03-01T08:00:00Z", updatedAt: "2025-06-01T08:00:00Z" },
];

// =================== STATUS LOGS ===================
export const statusLogsData: StatusLog[] = [
  { id: 1, pesertaId: 1, noPendaftaran: "DAD-2026-0001", statusLama: "Menunggu", statusBaru: "Terverifikasi", diubahOleh: "admin_fkip", role: "admin", waktu: "2026-02-05T10:30:00Z", emailTerkirim: true },
  { id: 2, pesertaId: 2, noPendaftaran: "DAD-2026-0002", statusLama: "Menunggu", statusBaru: "Terverifikasi", diubahOleh: "admin_fisip", role: "admin", waktu: "2026-02-05T11:00:00Z", emailTerkirim: true },
  { id: 3, pesertaId: 15, noPendaftaran: "DAD-2026-0015", statusLama: "Menunggu", statusBaru: "Ditolak", diubahOleh: "admin_fkip", role: "admin", waktu: "2026-02-06T09:00:00Z", emailTerkirim: false },
  { id: 4, pesertaId: 19, noPendaftaran: "DAM-2026-0001", statusLama: "Menunggu", statusBaru: "Terverifikasi", diubahOleh: "superadmin", role: "superadmin", waktu: "2026-02-10T14:00:00Z", emailTerkirim: true },
];

// =================== PENGATURAN ===================
export const pengaturanData = {
  id: 1,
  namaKegiatan: "Perkaderan IMM 2026",
  singkatan: "IMM2026",
  deskripsi: "Sistem pendaftaran perkaderan Ikatan Mahasiswa Muhammadiyah Tahun 2026",
  tanggalMulai: "2026-03-01",
  tanggalSelesai: "2026-12-31",
  lokasi: "Universitas Muhammadiyah Surakarta",
  kuotaPeserta: 500,
  batasRegistrasi: "2026-11-30",
  statusBuka: true,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
};
