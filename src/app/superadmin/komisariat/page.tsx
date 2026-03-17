"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Building2 } from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

type Komisariat = {
  id: number;
  nama: string;
};

export default function ManajemenKomisariatPage() {
  const [komisariat, setKomisariat] = useState<Komisariat[]>([]);
  const [loading, setLoading] = useState(true);
  const [namaKomisariat, setNamaKomisariat] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const fetchKomisariat = () => {
    fetch("/api/komisariat")
      .then((res) => res.json())
      .then((data) => setKomisariat(data))
      .catch(() => showToast("Gagal memuat data komisariat", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKomisariat();
  }, []);

  const handleAdd = async () => {
    if (!namaKomisariat.trim()) return;
    try {
      const res = await authFetch("/api/komisariat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: namaKomisariat.trim() }),
      });
      if (res.ok) {
        setNamaKomisariat("");
        setShowForm(false);
        showToast("Komisariat berhasil ditambahkan", "success");
        fetchKomisariat();
      } else {
        const data = await res.json();
        showToast(data.error || "Gagal menambahkan komisariat", "error");
      }
    } catch {
      showToast("Gagal menambahkan komisariat", "error");
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteTarget(null);
    try {
      const res = await authFetch(`/api/komisariat/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Komisariat berhasil dihapus", "success");
        fetchKomisariat();
      } else {
        const data = await res.json();
        showToast(data.error || "Gagal menghapus komisariat", "error");
      }
    } catch {
      showToast("Gagal menghapus komisariat", "error");
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
          <h1 className="text-2xl font-bold text-imm-black">Manajemen Komisariat</h1>
          <p className="text-sm text-imm-gray-dark">
            Kelola daftar komisariat (PIKOM). Untuk mengatur keikutsertaan per kegiatan, buka halaman Manajemen Kegiatan.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-imm-red text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
        >
          <Plus size={18} />
          Tambah Komisariat
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 inline-block">
        <p className="text-xs text-imm-gray-dark mb-1">Total Komisariat</p>
        <p className="text-2xl font-bold text-imm-black">{komisariat.length}</p>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-imm-black mb-4">Tambah Komisariat Baru</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={namaKomisariat}
              onChange={(e) => setNamaKomisariat(e.target.value)}
              placeholder="Nama komisariat (contoh: FKIP)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button
              onClick={handleAdd}
              className="bg-imm-red text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
            >
              Simpan
            </button>
            <button
              onClick={() => { setShowForm(false); setNamaKomisariat(""); }}
              className="border border-gray-300 text-imm-gray-dark font-semibold px-5 py-2.5 rounded-xl hover:bg-imm-gray transition-colors text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Komisariat list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-imm-gray border-b border-gray-200">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-imm-gray-dark uppercase tracking-wider">
                Komisariat
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold text-imm-gray-dark uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {komisariat.map((k) => (
              <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-imm-red">
                      <Building2 size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-imm-black text-sm">{k.nama}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setDeleteTarget(k.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {komisariat.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-imm-gray-dark text-sm">
                  Belum ada komisariat. Klik &quot;Tambah Komisariat&quot; untuk menambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus Komisariat"
        message="Yakin ingin menghapus komisariat ini? Data yang terkait mungkin terpengaruh."
        variant="danger"
        onConfirm={() => deleteTarget !== null && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
