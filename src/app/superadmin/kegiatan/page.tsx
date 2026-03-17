"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CalendarRange,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
  Building2,
} from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

type Kegiatan = {
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
};

type Komisariat = {
  id: number;
  nama: string;
};

const JENIS_KEGIATAN = [
  { singkatan: "DAD", nama: "Darul Arqam Dasar" },
  { singkatan: "DAM", nama: "Darul Arqam Madya" },
  { singkatan: "DAP", nama: "Darul Arqam Paripurna" },
  { singkatan: "PID", nama: "Pelatihan Instruktur Dasar" },
  { singkatan: "PIM", nama: "Pelatihan Instruktur Madya" },
  { singkatan: "PIP", nama: "Pelatihan Instruktur Paripurna" },
];

const emptyForm = {
  namaKegiatan: "",
  singkatan: "",
  deskripsi: "",
  tanggalMulai: "",
  tanggalSelesai: "",
  lokasi: "",
  kuotaPeserta: 100,
  batasRegistrasi: "",
  statusBuka: false,
  komisariatIds: [] as number[],
};

export default function ManajemenKegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [komisariatList, setKomisariatList] = useState<Komisariat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const fetchData = () => {
    Promise.all([
      fetch("/api/kegiatan").then((r) => r.json()),
      fetch("/api/komisariat").then((r) => r.json()),
    ])
      .then(([kg, km]) => {
        setKegiatanList(kg);
        setKomisariatList(km);
      })
      .catch(() => showToast("Gagal memuat data", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const inputType = 'type' in e.target ? e.target.type : 'text';
    setFormData({
      ...formData,
      [name]: inputType === "number" ? Number(value) : value,
    });
  };

  const handleJenisChange = (singkatan: string) => {
    const jenis = JENIS_KEGIATAN.find((j) => j.singkatan === singkatan);
    if (jenis) {
      const year = new Date().getFullYear();
      const komNames = komisariatList
        .filter((k) => formData.komisariatIds.includes(k.id))
        .map((k) => k.nama)
        .join(", ");
      setFormData({
        ...formData,
        singkatan: jenis.singkatan,
        namaKegiatan: `${jenis.nama} ${year}${komNames ? " - " + komNames : ""}`,
      });
    } else {
      setFormData({ ...formData, singkatan: "", namaKegiatan: "" });
    }
  };

  const toggleKomisariat = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      komisariatIds: prev.komisariatIds.includes(id)
        ? prev.komisariatIds.filter((k) => k !== id)
        : [...prev.komisariatIds, id],
    }));
  };

  const handleSave = async () => {
    if (!formData.namaKegiatan.trim() || !formData.singkatan.trim()) {
      showToast("Nama kegiatan dan singkatan wajib diisi", "warning");
      return;
    }

    try {
      const res = editId !== null
        ? await authFetch(`/api/kegiatan/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
        : await authFetch("/api/kegiatan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
      if (res.ok) {
        showToast(editId ? "Kegiatan berhasil diperbarui" : "Kegiatan berhasil ditambahkan", "success");
        setShowForm(false);
        setEditId(null);
        setFormData(emptyForm);
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || "Gagal menyimpan kegiatan", "error");
      }
    } catch {
      showToast("Gagal menyimpan kegiatan", "error");
    }
  };

  const handleEdit = (kg: Kegiatan) => {
    setFormData({
      namaKegiatan: kg.namaKegiatan,
      singkatan: kg.singkatan,
      deskripsi: kg.deskripsi,
      tanggalMulai: kg.tanggalMulai,
      tanggalSelesai: kg.tanggalSelesai,
      lokasi: kg.lokasi,
      kuotaPeserta: kg.kuotaPeserta,
      batasRegistrasi: kg.batasRegistrasi,
      statusBuka: kg.statusBuka,
      komisariatIds: kg.komisariatIds || [],
    });
    setEditId(kg.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setDeleteTarget(null);
    try {
      const res = await authFetch(`/api/kegiatan/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Kegiatan berhasil dihapus", "success");
        fetchData();
      } else {
        showToast("Gagal menghapus kegiatan", "error");
      }
    } catch {
      showToast("Gagal menghapus kegiatan", "error");
    }
  };

  const handleToggleStatus = async (kg: Kegiatan) => {
    try {
      const res = await authFetch(`/api/kegiatan/${kg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusBuka: !kg.statusBuka }),
      });
      if (res.ok) {
        showToast(`Pendaftaran ${!kg.statusBuka ? "dibuka" : "ditutup"}`, "success");
        fetchData();
      } else {
        showToast("Gagal mengubah status", "error");
      }
    } catch {
      showToast("Gagal mengubah status", "error");
    }
  };

  if (loading) {
    return <div className="p-6 text-imm-gray-dark">Memuat...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-imm-black">
            Manajemen Kegiatan
          </h1>
          <p className="text-sm text-imm-gray-dark">
            Buat dan kelola kegiatan perkaderan (DAD, DAM, dll.)
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormData(emptyForm);
          }}
          className="inline-flex items-center gap-2 bg-imm-red text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
        >
          <Plus size={18} />
          Tambah Kegiatan
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-imm-black">
              {editId !== null ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-imm-black mb-1">
                Jenis Kegiatan *
              </label>
              <select
                value={formData.singkatan}
                onChange={(e) => handleJenisChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              >
                <option value="">-- Pilih Jenis Kegiatan --</option>
                {JENIS_KEGIATAN.map((j) => (
                  <option key={j.singkatan} value={j.singkatan}>
                    {j.singkatan} — {j.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-imm-black mb-1">
                Nama Kegiatan
              </label>
              <input
                type="text"
                name="namaKegiatan"
                value={formData.namaKegiatan}
                onChange={handleChange}
                placeholder="Otomatis terisi saat memilih jenis kegiatan"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">
                Lokasi
              </label>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                placeholder="Tempat pelaksanaan"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="tanggalSelesai"
                value={formData.tanggalSelesai}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">
                Kuota Peserta
              </label>
              <input
                type="number"
                name="kuotaPeserta"
                value={formData.kuotaPeserta}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">
                Batas Registrasi
              </label>
              <input
                type="date"
                name="batasRegistrasi"
                value={formData.batasRegistrasi}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-imm-black mb-1">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows={3}
                placeholder="Deskripsi kegiatan"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Komisariat Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-imm-black mb-2">
                <Building2 size={16} className="inline mr-1" />
                Komisariat yang Menyelenggarakan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {komisariatList.map((k) => {
                  const selected = formData.komisariatIds.includes(k.id);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => toggleKomisariat(k.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selected
                          ? "bg-imm-red text-white border-imm-red"
                          : "bg-white text-imm-gray-dark border-gray-300 hover:border-imm-red hover:text-imm-red"
                      }`}
                    >
                      {k.nama}
                    </button>
                  );
                })}
              </div>
              {formData.komisariatIds.length > 0 && (
                <p className="text-xs text-imm-gray-dark mt-2">
                  {formData.komisariatIds.length} komisariat dipilih
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-imm-red text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
            >
              <Save size={16} />
              {editId !== null ? "Update" : "Simpan"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="border border-gray-300 text-imm-gray-dark font-semibold px-5 py-2.5 rounded-xl hover:bg-imm-gray transition-colors text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Kegiatan Cards */}
      <div className="space-y-4">
        {kegiatanList.map((kg) => (
          <div
            key={kg.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    kg.statusBuka ? "bg-imm-red" : "bg-gray-400"
                  }`}
                >
                  <CalendarRange size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-imm-black text-lg">
                    {kg.namaKegiatan}
                  </h3>
                  <p className="text-xs text-imm-gray-dark">
                    Singkatan: {kg.singkatan}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(kg)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                    kg.statusBuka
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {kg.statusBuka ? (
                    <>
                      <ToggleRight size={16} /> Dibuka
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={16} /> Ditutup
                    </>
                  )}
                </button>
              </div>
            </div>

            {kg.deskripsi && (
              <p className="text-sm text-imm-gray-dark mb-3">{kg.deskripsi}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
              <div className="bg-imm-gray rounded-lg p-3">
                <p className="text-xs text-imm-gray-dark">Tanggal</p>
                <p className="font-medium text-imm-black">
                  {kg.tanggalMulai
                    ? `${new Date(kg.tanggalMulai).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - ${new Date(kg.tanggalSelesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`
                    : "-"}
                </p>
              </div>
              <div className="bg-imm-gray rounded-lg p-3">
                <p className="text-xs text-imm-gray-dark">Lokasi</p>
                <p className="font-medium text-imm-black truncate">
                  {kg.lokasi || "-"}
                </p>
              </div>
              <div className="bg-imm-gray rounded-lg p-3">
                <p className="text-xs text-imm-gray-dark">Kuota</p>
                <p className="font-medium text-imm-black">
                  {kg.kuotaPeserta} peserta
                </p>
              </div>
              <div className="bg-imm-gray rounded-lg p-3">
                <p className="text-xs text-imm-gray-dark">Batas Registrasi</p>
                <p className="font-medium text-imm-black">
                  {kg.batasRegistrasi
                    ? new Date(kg.batasRegistrasi).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>

            {/* Komisariat */}
            <div className="mb-4">
              <p className="text-xs text-imm-gray-dark mb-2">
                Komisariat Penyelenggara:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {kg.komisariatIds.length > 0 ? (
                  kg.komisariatIds.map((kid) => {
                    const k = komisariatList.find((c) => c.id === kid);
                    return k ? (
                      <span
                        key={kid}
                        className="bg-imm-red/10 text-imm-red text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        {k.nama}
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-xs text-gray-400">
                    Belum ada komisariat
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-gray-100 pt-3">
              <button
                onClick={() => handleEdit(kg)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(kg.id)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Hapus
              </button>
            </div>
          </div>
        ))}

        {kegiatanList.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <CalendarRange
              size={48}
              className="mx-auto mb-4 text-gray-300"
            />
            <p className="text-imm-gray-dark">
              Belum ada kegiatan. Klik &quot;Tambah Kegiatan&quot; untuk
              membuat kegiatan baru.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus Kegiatan"
        message="Yakin ingin menghapus kegiatan ini? Semua data peserta dan persyaratan terkait akan ikut terhapus."
        variant="danger"
        onConfirm={() => deleteTarget !== null && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
