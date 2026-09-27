import React from 'react';
import {
  X,
  User,
  Tag,
  IndianRupee,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Edit3,
  BookOpen,
  RotateCcw,
  Hash,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { Book, UserSession } from '../types.ts';

interface BookDetailsModalProps {
  isOpen: boolean;
  book: Book | null;
  session: UserSession;
  onClose: () => void;
  onEdit?: (book: Book) => void;
  onIssueBook?: (bookId: string) => void;
  onReturnBook?: (bookId: string) => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  isOpen,
  book,
  session,
  onClose,
  onEdit,
  onIssueBook,
  onReturnBook,
}) => {
  if (!isOpen || !book) return null;

  const isAvailable = book.status === 'Available';
  const isStudent = session?.type === 'student';
  const currentStudent = isStudent ? session.student : null;

  const isIssuedToMe =
    book.status === 'Issued' &&
    currentStudent &&
    book.issuedTo?.studentRollNo === currentStudent.rollNo;

  const isIssuedToOther =
    book.status === 'Issued' &&
    currentStudent &&
    book.issuedTo?.studentRollNo !== currentStudent.rollNo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md tabular-nums">
              Book ID #{book.id}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Library Catalog Details
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Main Book Title & Author */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {book.title}
              </h3>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-slate-400" />
                <span>Written by {book.author}</span>
              </p>
            </div>

            {/* Status Indicator */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shrink-0 ${
                isAvailable
                  ? 'bg-emerald-100/90 text-emerald-800'
                  : 'bg-amber-100/90 text-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                }`}
              />
              {book.status}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>Category</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {book.category}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                <span>Price</span>
              </div>
              <p className="text-sm font-bold text-slate-800 tabular-nums">
                ₹{book.price.toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Shelf Location</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {book.shelfLocation || 'Rack A-01'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Date Added</span>
              </div>
              <p className="text-sm font-bold text-slate-800 tabular-nums">
                {book.dateAdded || 'Recently'}
              </p>
            </div>
          </div>

          {/* Issue Record Details if currently issued */}
          {book.status === 'Issued' && book.issuedTo && (
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Current Borrowing Details</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-amber-950 pt-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Student: <strong>{book.issuedTo.studentName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Hash className="w-3.5 h-3.5 text-amber-600" />
                  <span>Roll: <strong>{book.issuedTo.studentRollNo}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dept: <strong>{book.issuedTo.studentDepartment}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Issued: <strong>{book.issuedTo.issueDate}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Notice for Student if issued to other */}
          {isIssuedToOther && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>
                <strong>Notice:</strong> This book is currently issued to another student. You cannot borrow it until it is returned to the library.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Admin can Edit */}
            {session?.type === 'admin' && onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(book);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Book</span>
              </button>
            )}

            {/* Student can Issue if available */}
            {isStudent && isAvailable && onIssueBook && (
              <button
                type="button"
                onClick={() => {
                  onIssueBook(book.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Issue This Book</span>
              </button>
            )}

            {/* Student can Return if issued to them */}
            {isStudent && isIssuedToMe && onReturnBook && (
              <button
                type="button"
                onClick={() => {
                  onReturnBook(book.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return Book</span>
              </button>
            )}

            {/* Admin can Return / Check In any issued book */}
            {session?.type === 'admin' && book.status === 'Issued' && onReturnBook && (
              <button
                type="button"
                onClick={() => {
                  onReturnBook(book.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mark as Returned</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
