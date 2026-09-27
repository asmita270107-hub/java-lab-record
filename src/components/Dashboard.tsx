import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  BookmarkCheck,
  Users,
  PlusCircle,
  BookMarked,
  Search,
  Eye,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';
import { Book, AdminTab } from '../types.ts';
import { StatsCard } from './StatsCard.tsx';

interface DashboardProps {
  books: Book[];
  onNavigate: (tab: AdminTab) => void;
  onViewBook: (book: Book) => void;
  onFocusSearch: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  books,
  onNavigate,
  onViewBook,
  onFocusSearch,
}) => {
  // Statistics Calculations
  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.status === 'Available').length;
  const issuedBooks = books.filter((b) => b.status === 'Issued').length;
  
  // Total Students who have issued books (calculated from unique student roll numbers)
  const issuedStudentsCount = new Set(
    books
      .filter((b) => b.status === 'Issued' && b.issuedTo?.studentRollNo)
      .map((b) => b.issuedTo!.studentRollNo)
  ).size;

  const totalCategories = new Set(books.map((b) => b.category)).size;

  // Recent Books: sorted by latest added/reverse order, top 5
  const recentBooks = [...books]
    .sort((a, b) => {
      if (a.dateAdded && b.dateAdded) {
        return b.dateAdded.localeCompare(a.dateAdded);
      }
      return parseInt(b.id, 10) - parseInt(a.id, 10);
    })
    .slice(0, 5);

  // Category counts
  const categoryCounts = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryCounts).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards as specified in Admin requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatsCard
          title="Total Books"
          value={totalBooks}
          icon={BookOpen}
          colorScheme="indigo"
          subtitle="All cataloged volumes"
          onClick={() => onNavigate('books')}
        />
        <StatsCard
          title="Available Books"
          value={availableBooks}
          icon={CheckCircle2}
          colorScheme="emerald"
          subtitle="Ready on library shelves"
          onClick={() => onNavigate('books')}
        />
        <StatsCard
          title="Issued Books"
          value={issuedBooks}
          icon={BookmarkCheck}
          colorScheme="amber"
          subtitle="Currently out on loan"
          onClick={() => onNavigate('issued')}
        />
        <StatsCard
          title="Students with Issued Books"
          value={issuedStudentsCount}
          icon={Users}
          colorScheme="purple"
          subtitle="Active student borrowers"
          onClick={() => onNavigate('issued')}
        />
      </div>

      {/* 2. Quick Actions Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Quick Actions
          </h3>
          <span className="text-xs text-slate-400">
            Common Library Operations
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('add')}
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/90 text-indigo-700 font-semibold text-sm transition-all border border-indigo-100 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <span>+ Add Book</span>
          </button>

          <button
            onClick={() => onNavigate('books')}
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all border border-slate-200/70 cursor-pointer"
          >
            <BookMarked className="w-5 h-5 text-slate-500" />
            <span>View Books</span>
          </button>

          <button
            onClick={onFocusSearch}
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all border border-slate-200/70 cursor-pointer"
          >
            <Search className="w-5 h-5 text-slate-500" />
            <span>Search Book</span>
          </button>
        </div>
      </div>

      {/* 3. Main Dashboard Content Grid: Recent Books & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Books */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Books
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Recently added catalog records and circulation status
              </p>
            </div>
            <button
              onClick={() => onNavigate('books')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            {recentBooks.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-5">ID</th>
                    <th className="py-3 px-4">Book Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentBooks.map((book) => {
                    const isAvailable = book.status === 'Available';
                    return (
                      <tr
                        key={book.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3 px-5 font-semibold text-xs text-indigo-600 tabular-nums">
                          #{book.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 text-sm">
                            {book.title}
                          </div>
                          <div className="text-xs text-slate-400">
                            by {book.author}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          {book.category}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isAvailable ? 'bg-emerald-600' : 'bg-amber-600'
                              }`}
                            />
                            {book.status}
                          </span>
                          {book.status === 'Issued' && book.issuedTo && (
                            <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                              {book.issuedTo.studentName} ({book.issuedTo.studentRollNo})
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <button
                            onClick={() => onViewBook(book)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="View Book Details"
                            aria-label={`View ${book.title}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No books recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Category Distribution Overview & Issued link */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Top Categories
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {totalCategories} categories
              </span>
            </div>

            <div className="space-y-3.5">
              {sortedCategories.slice(0, 5).map(([category, count]) => {
                const percentage = totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">{category}</span>
                      <span className="text-slate-500 tabular-nums">
                        {count} {count === 1 ? 'book' : 'books'} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {sortedCategories.length === 0 && (
                <p className="text-xs text-slate-400">No categories recorded.</p>
              )}
            </div>
          </div>

          {/* Quick jump to Issued Registry */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-xs">
            <button
              onClick={() => onNavigate('issued')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 font-semibold border border-amber-200/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>View Issued Books Registry</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-bold text-xs">
                {issuedBooks}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
