"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, CalendarRange } from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

type Kegiatan = {
  id: number;
  namaKegiatan: string;
  singkatan: string;
};

type Persyaratan = {
  id: number;
  kegiatanId: number;
  nama: string;
  jenis: "file" | "teks" | "checkbox" | "paragraf" | "pilihan_ganda";
  wajib: boolean;
  opsi?: string[];
};

export default function ManajemenPersyaratanPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [selectedKegiatan, setSelectedKegiatan] = useState<number | null>(null);
  const [items, setItems] = useState<Persyaratan[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/kegiatan")
      .then((r) => r.json())
      .then((data) => {
        setKegiatanList(data);
        if (data.length > 0) setSelectedKegiatan(data[0].id);
      })
      .catch(() => showToast("Gagal memuat data kegiatan", "error"))
      .finally(() => setLoading(false));
  }, []);

  const fetchPersyaratan = () => {
    if (!selectedKegiatan) return;
    fetch(`/api/persyaratan?kegiatanId=${selectedKegiatan}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => showToast("Gagal memuat persyaratan", "error"));
  };

  useEffect(() => {
    if (selectedKegiatan) fetchPersyaratan();
  }, [selectedKegiatan]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nama: "", jenis: "file" as Persyaratan["jenis"], wajib: true, opsi: "" });

  const handleAdd = async () => {
    if (!formData.nama.trim() || !selectedKegiatan) {
      showToast("Nama persyaratan wajib diisi", "warning");
      return;
    }
    try {
      if (editId !== null) {
        const payload: Record<string, unknown> = { nama: formData.nama, jenis: formData.jenis, wajib: formData.wajib };
        if (formData.jenis === "pilihan_ganda") {
          payload.opsi = formData.opsi.split("\n").map((o) => o.trim()).filter(Boolean);
        } else {
          payload.opsi = undefined;
        }
        const res = await authFetch(`/api/persyaratan/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("Persyaratan berhasil diperbarui", "success");
          fetchPersyaratan();
        } else {
          showToast("Gagal memperbarui persyaratan", "error");
        }
        setEditId(null);
      } else {
        const payload: Record<string, unknown> = { ...formData, kegiatanId: selectedKegiatan };
        if (formData.jenis === "pilihan_ganda") {
          payload.opsi = formData.opsi.split("\n").map((o: string) => o.trim()).filter(Boolean);
        } else {
          delete payload.opsi;
        }
        const res = await authFetch("/api/persyaratan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("Persyaratan berhasil ditambahkan", "success");
          fetchPersyaratan();
        } else {
          showToast("Gagal menambahkan persyaratan", "error");
        }
      }
      setFormData({ nama: "", jenis: "file", wajib: true, opsi: "" });
      setShowForm(false);
    } catch {
      showToast("Terjadi kesalahan", "error");
    }
  };

  const handleEdit = (item: Persyaratan) => {
    setFormData({ nama: item.nama, jenis: item.jenis, wajib: item.wajib, opsi: item.opsi?.join("\n") || "" });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setDeleteTarget(null);
    try {
      const res = await authFetch(`/api/persyaratan/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Persyaratan berhasil dihapus", "success");
        fetchPersyaratan();
      } else {
        showToast("Gagal menghapus persyaratan", "error");
      }
    } catch {
      showToast("Gagal menghapus persyaratan", "error");
    }
  };

  if (loading) {
    return <div className="p-6 text-imm-gray-dark">Memuat...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-imm-black">Manajemen Persyaratan</h1>
          <p className="text-sm text-imm-gray-dark">Atur persyaratan pendaftaran per kegiatan</p>
        </div>
        {selectedKegiatan && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setFormData({ nama: "", jenis: "file", wajib: true, opsi: "" });
            }}
            className="inline-flex items-center gap-2 bg-imm-red text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
          >
            <Plus size={18} />
            Tambah Persyaratan
          </button>
        )}
      </div>

      {/* Pilih Kegiatan */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-imm-black mb-2">
          <CalendarRange size={16} className="inline mr-1" />
          Pilih Kegiatan
        </label>
        {kegiatanList.length === 0 ? (
          <p className="text-sm text-imm-gray-dark">Belum ada kegiatan</p>
        ) : (
          <select
            value={selectedKegiatan ?? ""}
            onChange={(e) => setSelectedKegiatan(Number(e.target.value))}
            className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
          >
            {kegiatanList.map((kg) => (
              <option key={kg.id} value={kg.id}>
                {kg.namaKegiatan} ({kg.singkatan})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Form Tambah/Edit */}
      {showForm && selectedKegiatan && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-imm-black mb-4">
            {editId !== null ? "Edit Persyaratan" : "Tambah Persyaratan Baru"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-imm-black mb-1">Nama Persyaratan</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
                placeholder="Contoh: Scan KTA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">Jenis Input</label>
              <select
                value={formData.jenis}
                onChange={(e) => setFormData({ ...formData, jenis: e.target.value as Persyaratan["jenis"] })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              >
                <option value="file">File Upload</option>
                <option value="teks">Jawaban Singkat</option>
                <option value="paragraf">Paragraf</option>
                <option value="pilihan_ganda">Pilihan Ganda</option>
                <option value="checkbox">Kotak Centang</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">Wajib</label>
              <select
                value={formData.wajib ? "ya" : "tidak"}
                onChange={(e) => setFormData({ ...formData, wajib: e.target.value === "ya" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              >
                <option value="ya">Ya (Wajib)</option>
                <option value="tidak">Tidak (Opsional)</option>
              </select>
            </div>
          </div>
          {formData.jenis === "pilihan_ganda" && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-imm-black mb-1">Opsi Pilihan (satu per baris)</label>
              <textarea
                value={formData.opsi}
                onChange={(e) => setFormData({ ...formData, opsi: e.target.value })}
                rows={4}
                placeholder={"Opsi 1\nOpsi 2\nOpsi 3"}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAdd}
              className="bg-imm-red text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
            >
              {editId !== null ? "Update" : "Simpan"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); }}
              className="border border-gray-300 text-imm-gray-dark font-semibold px-5 py-2.5 rounded-xl hover:bg-imm-gray transition-colors text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Daftar Persyaratan */}
      {selectedKegiatan && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-imm-black">Daftar Persyaratan ({items.length})</h3>
          </div>
          {items.length === 0 ? (
            <div className="p-8 text-center text-imm-gray-dark text-sm">
              Belum ada persyaratan untuk kegiatan ini
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-imm-gray/50">
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-gray-300" />
                    <div>
                      <p className="font-medium text-imm-black text-sm">{item.nama}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {item.jenis === "file" ? "File" : item.jenis === "teks" ? "Jawaban Singkat" : item.jenis === "paragraf" ? "Paragraf" : item.jenis === "pilihan_ganda" ? "Pilihan Ganda" : "Kotak Centang"}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            item.wajib ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.wajib ? "Wajib" : "Opsional"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      aria-label="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus Persyaratan"
        message="Apakah Anda yakin ingin menghapus persyaratan ini? Tindakan ini tidak dapat dibatalkan."
        variant="danger"
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
