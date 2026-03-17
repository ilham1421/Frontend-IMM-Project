"use client";

import { useState, useEffect } from "react";
import { Search, Download, Eye, X, User, Mail, Phone, MapPin, GraduationCap, Calendar, FileText, CheckCircle, Clock, XCircle, ImageIcon, History } from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

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

type StatusLog = {
  id: number;
  statusLama: string;
  statusBaru: string;
  diubahOleh: string;
  role: string;
  waktu: string;
  emailTerkirim: boolean;
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
  jawaban?: { persyaratanId: number; nama: string; jenis: string; nilai: string }[];
};

export default function AdminPesertaPage() {
  const [search, setSearch] = useState("");
  const [peserta, setPeserta] = useState<PesertaListItem[]>([]);
  const [komisariat, setKomisariat] = useState("");
  const [selectedPeserta, setSelectedPeserta] = useState<PesertaDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const { showToast } = useToast();

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    variant: "danger" | "warning" | "default";
    onConfirm: () => void;
  }>({ open: false, title: "", message: "", variant: "default", onConfirm: () => {} });

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
      .catch(() => showToast("Gagal memuat data peserta", "error"));
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
      const [pesRes, logRes] = await Promise.all([
        authFetch(`/api/peserta/${id}`),
        authFetch(`/api/peserta/${id}/logs`),
      ]);
      if (!pesRes.ok) { showToast("Gagal memuat detail peserta", "error"); setShowModal(false); return; }
      setSelectedPeserta(await pesRes.json());
      setStatusLogs(logRes.ok ? await logRes.json() : []);
    } catch {
      showToast("Gagal memuat detail peserta", "error");
      setSelectedPeserta(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    const pesertaItem = peserta.find((p) => p.id === id);
    if (!pesertaItem || pesertaItem.status === newStatus) return;

    setConfirmDialog({
      open: true,
      title: "Ubah Status Peserta",
      message: `Ubah status ${pesertaItem.namaLengkap} dari "${pesertaItem.status}" ke "${newStatus}"? Email notifikasi akan dikirim ke peserta.`,
      variant: newStatus === "Ditolak" ? "danger" : "warning",
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        try {
          const res = await authFetch(`/api/peserta/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });
          if (res.ok) {
            showToast(`Status berhasil diubah ke ${newStatus}`, "success");
            fetchPeserta();
            if (selectedPeserta && selectedPeserta.id === id) {
              setSelectedPeserta({ ...selectedPeserta, status: newStatus });
              const logRes = await authFetch(`/api/peserta/${id}/logs`);
              if (logRes.ok) setStatusLogs(await logRes.json());
            }
          } else {
            const data = await res.json();
            showToast(data.error || "Gagal mengubah status", "error");
          }
        } catch {
          showToast("Gagal mengubah status", "error");
        }
      },
    });
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

  const isImage = (filename: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (komisariat) params.set("komisariat", komisariat);
    try {
      const res = await authFetch(`/api/peserta/export/csv?${params.toString()}`);
      if (!res.ok) { showToast("Gagal mengekspor data", "error"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `peserta-${komisariat || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Data berhasil diekspor", "success");
    } catch {
      showToast("Gagal mengekspor data", "error");
    }
  };

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
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm"
        >
          <Download size={16} />
          Export CSV
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

                  {/* Jawaban Persyaratan */}
                  {selectedPeserta.jawaban && selectedPeserta.jawaban.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-imm-black mb-3 flex items-center gap-2">
                        <FileText size={16} className="text-imm-red" />
                        Jawaban Persyaratan
                      </h3>
                      <div className="space-y-3">
                        {selectedPeserta.jawaban.map((j, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
                            <p className="text-xs text-imm-gray-dark font-medium mb-1">{j.nama}</p>
                            <p className="text-sm text-imm-black whitespace-pre-wrap">{j.nilai}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                        {selectedPeserta.berkas.map((b, i) => {
                          const tkn = typeof window !== "undefined" ? localStorage.getItem("token") : "";
                          const fileUrl = `/uploads/${b.namaFile}?token=${tkn}`;
                          return (
                          <div key={i} className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-imm-gray-dark mb-2 font-medium">{b.namaBerkas}</p>
                            {isImage(b.namaFile) ? (
                              <div className="mb-2">
                                <img
                                  src={fileUrl}
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
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-imm-red hover:underline"
                            >
                              <Download size={14} />
                              Download / Lihat File
                            </a>
                          </div>
                          );
                        })}
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

                  {/* Riwayat Perubahan Status */}
                  {statusLogs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-imm-black mb-3 flex items-center gap-2">
                        <History size={16} className="text-imm-red" />
                        Riwayat Perubahan Status
                      </h3>
                      <div className="space-y-2">
                        {statusLogs.map((log) => (
                          <div key={log.id} className="bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              log.statusBaru === "Terverifikasi" ? "bg-green-100" : log.statusBaru === "Ditolak" ? "bg-red-100" : "bg-yellow-100"
                            }`}>
                              {log.statusBaru === "Terverifikasi" && <CheckCircle size={14} className="text-green-600" />}
                              {log.statusBaru === "Ditolak" && <XCircle size={14} className="text-red-600" />}
                              {log.statusBaru === "Menunggu" && <Clock size={14} className="text-yellow-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-imm-black">
                                <span className="font-medium">{log.diubahOleh}</span>
                                <span className="text-imm-gray-dark"> mengubah status dari </span>
                                <span className="font-medium">{log.statusLama}</span>
                                <span className="text-imm-gray-dark"> → </span>
                                <span className="font-medium">{log.statusBaru}</span>
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-[11px] text-imm-gray-dark">
                                  {new Date(log.waktu).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                                </p>
                                {log.emailTerkirim && (
                                  <span className="text-[11px] text-green-600 flex items-center gap-1">
                                    <Mail size={10} /> Email terkirim
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
