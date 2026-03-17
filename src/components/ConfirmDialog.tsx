"use client";

import { AlertTriangle, X } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const btnClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : variant === "warning"
      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
      : "bg-imm-red hover:bg-imm-red-dark text-white";

  const iconBg =
    variant === "danger"
      ? "bg-red-100 text-red-600"
      : variant === "warning"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-blue-100 text-blue-600";

  return (
    <div className="fixed inset-0 bg-black/50 z-90 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-imm-black">{title}</h3>
              <p className="text-sm text-imm-gray-dark mt-1">{message}</p>
            </div>
            <button onClick={onCancel} className="shrink-0 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-imm-gray-dark border border-gray-300 rounded-xl hover:bg-imm-gray transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
