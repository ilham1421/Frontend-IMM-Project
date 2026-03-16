"use client";

import { useState, useEffect } from "react";
import { Search, Download, Eye, X, User, Mail, Phone, MapPin, GraduationCap, Calendar, FileText, CheckCircle, Clock, XCircle, ImageIcon } from "lucide-react";
import { authFetch } from "@/lib/authFetch";

type Berkas = {
  namaBerkas: string;
  namaFile: string;
  originalName?: string;
};

type PesertaListItem = {
  id: number;
  namaLengkap: string;
  nim: string;
  createdAt: string;
  status: "Terverifikasi" | "Menunggu" | "Ditolak";
};

type PesertaDetail = {
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
  createdAt: string;
  updatedAt: string;
  berkas: Berkas[];
};

export default function AdminPesertaPage() {
  const [search, setSearch] = useState("");
  const [peserta, setPeserta] = useState<PesertaListItem[]>([]);
  const [komisariat, setKomisariat] = useState("");
  const [selectedPeserta, setSelectedPeserta] = useState<PesertaDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setKomisariat(user.komisariat || "");
  }, []);

  const fetchPeserta = () => {
    if (!komisariat) return;
    const params = new URLSearchParams();
    params.set("komisariat", komisariat);
    if (search) params.set("search", search);
    authFetch(`/api/peserta?${params.toString()}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setPeserta(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchPeserta();
  }, [komisariat]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPeserta(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleViewDetail = async (id: number) => {
    setLoadingDetail(true);
    setShowModal(true);
    try {
      const res = await authFetch(`/api/peserta/${id}`);
      const data = await res.json();
      setSelectedPeserta(data);
    } catch {
      setSelectedPeserta(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    await authFetch(`/api/peserta/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchPeserta();
    if (selectedPeserta && selectedPeserta.id === id) {
      setSelectedPeserta({ ...selectedPeserta, status });
    }
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

  const isImage = (filename: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-imm-black">Data Peserta</h1>
        <p className="text-sm text-imm-gray-dark">Data peserta pendaftaran komisariat kamu</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau NIM..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-imm-red focus:border-transparent outline-none"
          />
        </div>
        <button className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-imm-gray">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-imm-gray-dark">No</th>
                <th className="text-left px-6 py-3 font-medium text-imm-gray-dark">Nama</th>
                <th className="text-left px-6 py-3 font-medium text-imm-gray-dark">NIM</th>
                <th className="text-left px-6 py-3 font-medium text-imm-gray-dark">Tgl Daftar</th>
                <th className="text-left px-6 py-3 font-medium text-imm-gray-dark">Status</th>
                <th className="text-left px-6 py-3 font-medium text-imm-gray-dark">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {peserta.map((p, i) => (
                <tr key={p.id} className="hover:bg-imm-gray/50">
                  <td className="px-6 py-4 text-imm-gray-dark">{i + 1}</td>
                  <td className="px-6 py-4 font-medium text-imm-black">{p.namaLengkap}</td>
                  <td className="px-6 py-4 text-imm-gray-dark">{p.nim}</td>
                  <td className="px-6 py-4 text-imm-gray-dark">{new Date(p.createdAt).toLocaleDateString("id-ID")}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      p.status === "Terverifikasi"
                        ? "bg-green-100 text-green-700"
                        : p.status === "Menunggu"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetail(p.id)}
                        className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none"
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Terverifikasi">Terverifikasi</option>
                        <option value="Ditolak">Ditolak</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {peserta.length === 0 && (
          <div className="p-8 text-center text-imm-gray-dark text-sm">
            Tidak ada data peserta ditemukan.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            {loadingDetail ? (
              <div className="p-12 text-center">
                <div className="w-6 h-6 border-2 border-imm-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-imm-gray-dark">Memuat detail...</p>
              </div>
            ) : selectedPeserta ? (
              <>
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <div>
                    <h2 className="text-lg font-bold text-imm-black">Detail Peserta</h2>
                    <p className="text-xs text-imm-gray-dark">No. Pendaftaran: {selectedPeserta.noPendaftaran}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      selectedPeserta.status === "Terverifikasi"
                        ? "bg-green-100 text-green-700"
                        : selectedPeserta.status === "Menunggu"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedPeserta.status === "Terverifikasi" && <CheckCircle size={12} className="inline mr-1" />}
                      {selectedPeserta.status === "Menunggu" && <Clock size={12} className="inline mr-1" />}
                      {selectedPeserta.status === "Ditolak" && <XCircle size={12} className="inline mr-1" />}
                      {selectedPeserta.status}
                    </span>
                    <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Data Diri */}
                  <div>
                    <h3 className="text-sm font-bold text-imm-black mb-3 flex items-center gap-2">
                      <User size={16} className="text-imm-red" />
                      Data Diri
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Nama Lengkap", value: selectedPeserta.namaLengkap },
                        { label: "NIM", value: selectedPeserta.nim },
                        { label: "Jenis Kelamin", value: selectedPeserta.jenisKelamin === "L" ? "Laki-laki" : "Perempuan" },
                        { label: "Tempat, Tanggal Lahir", value: `${selectedPeserta.tempatLahir}, ${formatDate(selectedPeserta.tanggalLahir)}` },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
                          <p className="text-[11px] text-imm-gray-dark uppercase tracking-wider mb-0.5">{item.label}</p>
                          <p className="text-sm font-medium text-imm-black">{item.value || "-"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kontak */}
                  <div>
                    <h3 className="text-sm font-bold text-imm-black mb-3 flex items-center gap-2">
                      <Mail size={16} className="text-imm-red" />
                      Kontak
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Email", value: selectedPeserta.email, icon: Mail },
                        { label: "No. HP / WhatsApp", value: selectedPeserta.noHp, icon: Phone },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
                          <p className="text-[11px] text-imm-gray-dark uppercase tracking-wider mb-0.5">{item.label}</p>
                          <p className="text-sm font-medium text-imm-black">{item.value || "-"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Akademik */}
                  <div>
                    <h3 className="text-sm font-bold text-imm-black mb-3 flex items-center gap-2">
                      <GraduationCap size={16} className="text-imm-red" />
                      Informasi Akademik
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Universitas", value: selectedPeserta.universitas },
                        { label: "Fakultas", value: selectedPeserta.fakultas },
                        { label: "Program Studi", value: selectedPeserta.prodi },
                        { label: "Komisariat", value: selectedPeserta.komisariat },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
                          <p className="text-[11px] text-imm-gray-dark uppercase tracking-wider mb-0.5">{item.label}</p>
                          <p className="text-sm font-medium text-imm-black">{item.value || "-"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alamat */}
                  <div>
                    <h3 className="text-sm font-bold text-imm-black mb-3 flex items-center gap-2">
                      <MapPin size={16} className="text-imm-red" />
                      Alamat Domisili
                    </h3>
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <p className="text-sm text-imm-black">{selectedPeserta.alamat || "-"}</p>
                    </div>
                  </div>

                  {/* Berkas */}
                  <div>
                    <h3 className="text-sm font-bold text-imm-black mb-3 flex items-center gap-2">
                      <FileText size={16} className="text-imm-red" />
                      Berkas yang Diupload
                    </h3>
                    {selectedPeserta.berkas.length === 0 ? (
                      <div className="bg-gray-50 rounded-xl px-4 py-6 text-center">
                        <p className="text-sm text-imm-gray-dark">Tidak ada berkas yang diupload.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedPeserta.berkas.map((b, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-imm-gray-dark mb-2 font-medium">{b.namaBerkas}</p>
                            {isImage(b.namaFile) ? (
                              <div className="mb-2">
                                <img
                                  src={`/uploads/${b.namaFile}`}
                                  alt={b.namaBerkas}
                                  className="max-w-full max-h-64 rounded-lg border border-gray-200 object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mb-2 text-imm-gray-dark">
                                <FileText size={20} />
                                <span className="text-sm">{b.originalName || b.namaFile}</span>
                              </div>
                            )}
                            <a
                              href={`/uploads/${b.namaFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-imm-red hover:underline"
                            >
                              <Download size={14} />
                              Download / Lihat File
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Waktu */}
                  <div>
                    <h3 className="text-sm font-bold text-imm-black mb-3 flex items-center gap-2">
                      <Calendar size={16} className="text-imm-red" />
                      Informasi Pendaftaran
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="text-[11px] text-imm-gray-dark uppercase tracking-wider mb-0.5">Tanggal Daftar</p>
                        <p className="text-sm font-medium text-imm-black">{formatDate(selectedPeserta.createdAt)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="text-[11px] text-imm-gray-dark uppercase tracking-wider mb-0.5">Terakhir Diperbarui</p>
                        <p className="text-sm font-medium text-imm-black">{formatDate(selectedPeserta.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Change */}
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-imm-black mb-3">Ubah Status</h3>
                    <div className="flex gap-2">
                      {(["Menunggu", "Terverifikasi", "Ditolak"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(selectedPeserta.id, s)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                            selectedPeserta.status === s
                              ? s === "Terverifikasi" ? "bg-green-600 text-white" : s === "Ditolak" ? "bg-red-600 text-white" : "bg-yellow-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-imm-gray-dark text-sm">Data tidak ditemukan.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
