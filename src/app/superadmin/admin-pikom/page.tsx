"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, UserX, UserCheck } from "lucide-react";
import { authFetch } from "@/lib/authFetch";

type AdminPikom = {
  id: number;
  nama: string;
  username: string;
  komisariat: string;
  aktif: boolean;
};

export default function ManajemenAdminPikomPage() {
  const [admins, setAdmins] = useState<AdminPikom[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = () => {
    authFetch("/api/users")
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nama: "", username: "", komisariat: "", password: "" });

  const handleSave = async () => {
    if (!formData.nama.trim() || !formData.username.trim()) return;
    if (editId !== null) {
      await authFetch(`/api/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: formData.nama,
          username: formData.username,
          komisariat: formData.komisariat,
          ...(formData.password ? { password: formData.password } : {}),
        }),
      });
      setEditId(null);
    } else {
      await authFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setFormData({ nama: "", username: "", komisariat: "", password: "" });
    setShowForm(false);
    fetchAdmins();
  };

  const handleEdit = (admin: AdminPikom) => {
    setFormData({ nama: admin.nama, username: admin.username, komisariat: admin.komisariat, password: "" });
    setEditId(admin.id);
    setShowForm(true);
  };

  const toggleAktif = async (id: number) => {
    const admin = admins.find((a) => a.id === id);
    if (!admin) return;
    await authFetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aktif: !admin.aktif }),
    });
    fetchAdmins();
  };

  if (loading) {
    return <div className="p-6 text-imm-gray-dark">Memuat...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-imm-black">Manajemen Admin PIKOM</h1>
          <p className="text-sm text-imm-gray-dark">Kelola akun admin komisariat</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormData({ nama: "", username: "", komisariat: "", password: "" });
          }}
          className="inline-flex items-center gap-2 bg-imm-red text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-imm-red-dark transition-colors text-sm"
        >
          <Plus size={18} />
          Tambah Admin
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-imm-black mb-4">
            {editId !== null ? "Edit Admin" : "Tambah Admin Baru"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">Komisariat</label>
              <input
                type="text"
                value={formData.komisariat}
                onChange={(e) => setFormData({ ...formData, komisariat: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-imm-black mb-1">
                Password {editId !== null && "(kosongkan jika tidak diubah)"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
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

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${admin.aktif ? "bg-imm-red" : "bg-gray-400"}`}>
                  <span className="text-white text-sm font-bold">
                    {admin.nama.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-imm-black text-sm">{admin.nama}</p>
                  <p className="text-xs text-imm-gray-dark">@{admin.username}</p>
                  <p className="text-xs text-imm-gray-dark">Komisariat: {admin.komisariat}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${admin.aktif ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {admin.aktif ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <div className="flex gap-2 mt-4 border-t border-gray-100 pt-3">
              <button
                onClick={() => handleEdit(admin)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={() => toggleAktif(admin.id)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg transition-colors ${
                  admin.aktif ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"
                }`}
              >
                {admin.aktif ? <><UserX size={14} /> Nonaktifkan</> : <><UserCheck size={14} /> Aktifkan</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
