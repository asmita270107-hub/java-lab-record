import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastNotification } from '../types.ts';

interface ToastProps {
  toast: ToastNotification | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-xl border border-slate-200/80 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
          isSuccess
            ? 'bg-emerald-100 text-emerald-600'
            : isError
            ? 'bg-rose-100 text-rose-600'
            : 'bg-indigo-100 text-indigo-600'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5" />}
        {isError && <AlertCircle className="w-5 h-5" />}
        {!isSuccess && !isError && <Info className="w-5 h-5" />}
      </div>
      <div className="text-sm font-semibold text-slate-800 pr-2">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
