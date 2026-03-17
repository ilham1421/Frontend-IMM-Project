"use client";

import { useState, useCallback, createContext, useContext } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const icon = (type: ToastType) => {
    switch (type) {
      case "success": return <CheckCircle size={18} className="text-green-500 shrink-0" />;
      case "error": return <XCircle size={18} className="text-red-500 shrink-0" />;
      case "warning": return <AlertTriangle size={18} className="text-yellow-500 shrink-0" />;
      case "info": return <Info size={18} className="text-blue-500 shrink-0" />;
    }
  };

  const bg = (type: ToastType) => {
    switch (type) {
      case "success": return "border-green-200 bg-green-50";
      case "error": return "border-red-200 bg-red-50";
      case "warning": return "border-yellow-200 bg-yellow-50";
      case "info": return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in ${bg(t.type)}`}
          >
            {icon(t.type)}
            <p className="text-sm text-gray-800 flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="shrink-0 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
