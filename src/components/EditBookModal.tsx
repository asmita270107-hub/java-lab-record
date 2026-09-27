import React from 'react';
import { X, Edit3 } from 'lucide-react';
import { Book } from '../types.ts';
import { BookForm } from './BookForm.tsx';

interface EditBookModalProps {
  isOpen: boolean;
  book: Book | null;
  existingBooks: Book[];
  onClose: () => void;
  onSave: (updatedBook: Book) => void;
}

export const EditBookModal: React.FC<EditBookModalProps> = ({
  isOpen,
  book,
  existingBooks,
  onClose,
  onSave,
}) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Update Book Information
              </h3>
              <p className="text-xs text-slate-500">
                Editing catalog details for ID #{book.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <BookForm
            mode="edit"
            initialData={book}
            existingBooks={existingBooks}
            onSubmit={(updated) => {
              onSave(updated);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};
