import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Book } from '../types.ts';

interface ConfirmDialogProps {
  isOpen: boolean;
  book: Book | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  book,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Delete Book Confirmation
        </h3>

        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to delete this book?
        </p>

        {/* Target Book Info Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Book ID: #{book.id}
          </div>
          <div className="text-sm font-bold text-slate-900">
            {book.title}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            By {book.author} · {book.category}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
