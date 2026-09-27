import { useState, useMemo } from 'react';
import { BookOpen, Search, RotateCcw, Calendar, User, Hash, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Book } from '../types.ts';

interface AdminIssuedBooksProps {
  books: Book[];
  onReturnBook: (bookId: string) => void;
  onViewBook: (book: Book) => void;
}

export default function AdminIssuedBooks({
  books,
  onReturnBook,
  onViewBook,
}: AdminIssuedBooksProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const issuedBooks = useMemo(() => {
    return books.filter((b) => b.status === 'Issued');
  }, [books]);

  // Unique students count
  const uniqueStudents = useMemo(() => {
    const rollSet = new Set<string>();
    issuedBooks.forEach((b) => {
      if (b.issuedTo?.studentRollNo) {
        rollSet.add(b.issuedTo.studentRollNo);
      }
    });
    return rollSet.size;
  }, [issuedBooks]);

  const filteredIssuedBooks = useMemo(() => {
    if (!searchQuery.trim()) return issuedBooks;
    const q = searchQuery.toLowerCase().trim();

    return issuedBooks.filter((b) => {
      const matchBook =
        b.id.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      const matchStudent =
        b.issuedTo?.studentName.toLowerCase().includes(q) ||
        b.issuedTo?.studentRollNo.toLowerCase().includes(q) ||
        b.issuedTo?.studentDepartment.toLowerCase().includes(q);
      return matchBook || matchStudent;
    });
  }, [issuedBooks, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Top Banner & Stats */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Circulation & Issued Books Registry</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of which student has borrowed which library title.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900">
            Currently Issued: <strong>{issuedBooks.length}</strong>
          </div>
          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-900">
            Active Borrowers: <strong>{uniqueStudents} Students</strong>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name, roll number (e.g. 24CS101), department, or book title..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {filteredIssuedBooks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {issuedBooks.length === 0
              ? 'No books are currently issued'
              : 'No matching issue records found'}
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {issuedBooks.length === 0
              ? 'All books in the inventory are currently Available on the library racks.'
              : 'Try searching with a different roll number, student name, or book title.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Book Details</th>
                  <th className="py-3 px-4">Issued To (Student)</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4 text-right">Circulation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredIssuedBooks.map((book) => {
                  const studentInfo = book.issuedTo;
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => onViewBook(book)}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition text-left cursor-pointer"
                          >
                            <div>{book.title}</div>
                            <div className="text-xs text-slate-500 font-normal">
                              ID: #{book.id} • by {book.author}
                            </div>
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{studentInfo?.studentName || 'Unknown Student'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-mono font-bold text-indigo-700 text-xs bg-indigo-50 px-2 py-0.5 rounded w-fit border border-indigo-100">
                          <Hash className="w-3 h-3 text-indigo-400" />
                          <span>{studentInfo?.studentRollNo || 'N/A'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          <span>{studentInfo?.studentDepartment || 'General'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{studentInfo?.issueDate || book.dateAdded}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onReturnBook(book.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                          title="Check-in / Return book to shelf"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Check In (Return)</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
