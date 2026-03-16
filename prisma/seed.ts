import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database...");

  // ==========================================
  // 1. Buat Superadmin & Admin PIKOM
  // ==========================================
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "superadmin@imm.or.id" },
    update: {},
    create: {
      nama: "Super Administrator",
      email: "superadmin@imm.or.id",
      password: hashedPassword,
      role: "superadmin",
      komisariat: null,
      aktif: true,
    },
  });

  const adminList = [
    { nama: "Hasan Basri", email: "hasan@imm.or.id", komisariat: "FKIP" },
    { nama: "Aisyah Putri", email: "aisyah@imm.or.id", komisariat: "FEB" },
    { nama: "Umar Faruq", email: "umar@imm.or.id", komisariat: "FT" },
    { nama: "Khadijah Sari", email: "khadijah@imm.or.id", komisariat: "FISIP" },
  ];

  for (const admin of adminList) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        nama: admin.nama,
        email: admin.email,
        password: hashedPassword,
        role: "admin",
        komisariat: admin.komisariat,
        aktif: true,
      },
    });
  }

  console.log("✅ User superadmin & admin PIKOM dibuat");

  // ==========================================
  // 2. Pengaturan Kegiatan
  // ==========================================
  const existingPengaturan = await prisma.pengaturan.findFirst();
  if (!existingPengaturan) {
    await prisma.pengaturan.create({
      data: {
        namaKegiatan: "Darul Arqam Dasar 2026",
        deskripsi:
          "Perkaderan utama Ikatan Mahasiswa Muhammadiyah untuk membentuk kader militan, intelektual, dan berakhlak mulia.",
        tanggalMulai: "2026-04-15",
        tanggalSelesai: "2026-04-17",
        lokasi: "Gedung Dakwah Muhammadiyah, Jl. Menteng Raya No.62, Jakarta",
        kuotaPeserta: 100,
        batasRegistrasi: "2026-04-10",
        statusBuka: true,
      },
    });
  }

  console.log("✅ Pengaturan kegiatan dibuat");

  // ==========================================
  // 3. Persyaratan Pendaftaran
  // ==========================================
  const persyaratanList = [
    { nama: "Scan KTA (Kartu Tanda Anggota)", jenis: "file", wajib: true, urutan: 1 },
    { nama: "Scan KTM (Kartu Tanda Mahasiswa)", jenis: "file", wajib: true, urutan: 2 },
    { nama: "Pas Foto 3x4 Background Merah", jenis: "file", wajib: true, urutan: 3 },
    { nama: "Surat Rekomendasi Komisariat", jenis: "file", wajib: false, urutan: 4 },
    { nama: "Alasan mengikuti DAD", jenis: "teks", wajib: true, urutan: 5 },
    { nama: "Bersedia mengikuti seluruh rangkaian kegiatan", jenis: "checkbox", wajib: true, urutan: 6 },
  ];

  for (const p of persyaratanList) {
    const existing = await prisma.persyaratan.findFirst({
      where: { nama: p.nama },
    });
    if (!existing) {
      await prisma.persyaratan.create({ data: p });
    }
  }

  console.log("✅ Persyaratan pendaftaran dibuat");

  // ==========================================
  // 4. Data Peserta Contoh
  // ==========================================
  const pesertaList = [
    {
      noPendaftaran: "DAD-2026-0001",
      namaLengkap: "Ahmad Fauzi",
      nim: "2026010001",
      tempatLahir: "Jakarta",
      tanggalLahir: "2004-05-12",
      jenisKelamin: "L",
      email: "ahmad@mail.com",
      noHp: "081234567890",
      universitas: "Universitas Muhammadiyah Jakarta",
      fakultas: "FKIP",
      prodi: "Pendidikan Bahasa Indonesia",
      komisariat: "FKIP",
      alamat: "Jl. KH Ahmad Dahlan No. 10, Jakarta Selatan",
      status: "Terverifikasi",
    },
    {
      noPendaftaran: "DAD-2026-0002",
      namaLengkap: "Siti Nurhaliza",
      nim: "2026010002",
      tempatLahir: "Bandung",
      tanggalLahir: "2004-08-25",
      jenisKelamin: "P",
      email: "siti@mail.com",
      noHp: "081234567891",
      universitas: "Universitas Muhammadiyah Jakarta",
      fakultas: "FEB",
      prodi: "Manajemen",
      komisariat: "FEB",
      alamat: "Jl. Cempaka Putih No. 5, Jakarta Pusat",
      status: "Menunggu",
    },
    {
      noPendaftaran: "DAD-2026-0003",
      namaLengkap: "Budi Santoso",
      nim: "2026010003",
      tempatLahir: "Surabaya",
      tanggalLahir: "2003-11-03",
      jenisKelamin: "L",
      email: "budi@mail.com",
      noHp: "081234567892",
      universitas: "Universitas Muhammadiyah Jakarta",
      fakultas: "FT",
      prodi: "Teknik Informatika",
      komisariat: "FT",
      alamat: "Jl. Matraman No. 20, Jakarta Timur",
      status: "Terverifikasi",
    },
    {
      noPendaftaran: "DAD-2026-0004",
      namaLengkap: "Rina Wati",
      nim: "2026010004",
      tempatLahir: "Yogyakarta",
      tanggalLahir: "2004-02-14",
      jenisKelamin: "P",
      email: "rina@mail.com",
      noHp: "081234567893",
      universitas: "Universitas Muhammadiyah Jakarta",
      fakultas: "FISIP",
      prodi: "Ilmu Komunikasi",
      komisariat: "FISIP",
      alamat: "Jl. Gatot Subroto No. 15, Jakarta Selatan",
      status: "Menunggu",
    },
    {
      noPendaftaran: "DAD-2026-0005",
      namaLengkap: "Doni Pratama",
      nim: "2026010005",
      tempatLahir: "Medan",
      tanggalLahir: "2003-07-08",
      jenisKelamin: "L",
      email: "doni@mail.com",
      noHp: "081234567894",
      universitas: "Universitas Muhammadiyah Jakarta",
      fakultas: "FK",
      prodi: "Kedokteran Umum",
      komisariat: "FK",
      alamat: "Jl. Salemba Raya No. 8, Jakarta Pusat",
      status: "Ditolak",
    },
    {
      noPendaftaran: "DAD-2026-0006",
      namaLengkap: "Fatimah Az-Zahra",
      nim: "2026010006",
      tempatLahir: "Semarang",
      tanggalLahir: "2004-01-20",
      jenisKelamin: "P",
      email: "fatimah@mail.com",
      noHp: "081234567895",
      universitas: "Universitas Muhammadiyah Jakarta",
      fakultas: "FKIP",
      prodi: "Pendidikan Matematika",
      komisariat: "FKIP",
      alamat: "Jl. Cilandak No. 12, Jakarta Selatan",
      status: "Terverifikasi",
    },
    {
      noPendaftaran: "DAD-2026-0007",
      namaLengkap: "Rizki Ramadhan",
      nim: "2026010007",
      tempatLahir: "Makassar",
      tanggalLahir: "2003-09-15",
      jenisKelamin: "L",
      email: "rizki@mail.com",
      noHp: "081234567896",
      universitas: "Universitas Muhammadiyah Jakarta",
      fakultas: "FEB",
      prodi: "Akuntansi",
      komisariat: "FEB",
      alamat: "Jl. Rawamangun No. 3, Jakarta Timur",
      status: "Menunggu",
    },
    {
      noPendaftaran: "DAD-2026-0008",
      namaLengkap: "Dewi Sartika",
      nim: "2026010008",
      tempatLahir: "Palembang",
      tanggalLahir: "2004-04-10",
      jenisKelamin: "P",
      email: "dewi@mail.com",
      noHp: "081234567897",
      universitas: "Universitas Muhammadiyah Jakarta",
      fakultas: "FT",
      prodi: "Teknik Sipil",
      komisariat: "FT",
      alamat: "Jl. Tebet Raya No. 7, Jakarta Selatan",
      status: "Terverifikasi",
    },
  ];

  for (const p of pesertaList) {
    const existing = await prisma.peserta.findFirst({
      where: { noPendaftaran: p.noPendaftaran },
    });
    if (!existing) {
      await prisma.peserta.create({ data: p });
    }
  }

  console.log("✅ Data peserta contoh dibuat");
  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
