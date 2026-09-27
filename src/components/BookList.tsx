import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Plus,
  RotateCcw,
  BookOpen,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { Book, BookStatus } from '../types.ts';

interface BookListProps {
  books: Book[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewBook: (book: Book) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
  onToggleStatus: (book: Book) => void;
  onNavigateToAdd: () => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  searchTerm,
  onSearchChange,
  onViewBook,
  onEditBook,
  onDeleteBook,
  onToggleStatus,
  onNavigateToAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'author' | 'price'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Derive unique categories from existing books
  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return Array.from(set).sort();
  }, [books]);

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search filter: Book ID, Book Title, Author, Category
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase().trim();
          const matchId = book.id.toLowerCase().includes(query);
          const matchTitle = book.title.toLowerCase().includes(query);
          const matchAuthor = book.author.toLowerCase().includes(query);
          const matchCategory = book.category.toLowerCase().includes(query);
          if (!matchId && !matchTitle && !matchAuthor && !matchCategory) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && book.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && book.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'id') {
          const numA = parseInt(a.id, 10);
          const numB = parseInt(b.id, 10);
          if (!isNaN(numA) && !isNaN(numB)) {
            comparison = numA - numB;
          } else {
            comparison = a.id.localeCompare(b.id);
          }
        } else if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else if (sortBy === 'author') {
          comparison = a.author.localeCompare(b.author);
        } else if (sortBy === 'price') {
          comparison = a.price - b.price;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [books, searchTerm, selectedCategory, selectedStatus, sortBy, sortDirection]);

  const handleSort = (field: 'id' | 'title' | 'author' | 'price') => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleClearFilters = () => {
    onSearchChange('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' || selectedCategory !== 'all' || selectedStatus !== 'all';

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by ID, title, author, or category..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action to Add Book */}
          <button
            onClick={onNavigateToAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Category & Status Dropdown Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status:
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="Available">Available Only</option>
                <option value="Issued">Issued Only</option>
              </select>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Records Counter */}
          <div className="text-xs font-medium text-slate-500 tabular-nums">
            Showing <strong className="text-slate-900">{filteredBooks.length}</strong> of{' '}
            <strong className="text-slate-900">{books.length}</strong> books
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
                  <th
                    onClick={() => handleSort('id')}
                    className="py-3.5 px-4 sm:px-6 cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Book ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('title')}
                    className="py-3.5 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Book Title</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('author')}
                    className="py-3.5 px-4 cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Author</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Category</th>
                  <th
                    onClick={() => handleSort('price')}
                    className="py-3.5 px-4 text-right cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Price</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredBooks.map((book) => {
                  const isAvailable = book.status === 'Available';
                  return (
                    <tr
                      key={book.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Book ID */}
                      <td className="py-3 px-4 sm:px-6 font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        <span className="text-indigo-600 font-semibold text-xs bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                          #{book.id}
                        </span>
                      </td>

                      {/* Book Title */}
                      <td className="py-3 px-4 font-semibold text-slate-900 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onViewBook(book)}>
                            {book.title}
                          </span>
                        </div>
                        {book.shelfLocation && (
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                            Loc: {book.shelfLocation}
                          </div>
                        )}
                      </td>

                      {/* Author */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {book.author}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <span className="text-xs text-slate-700 font-medium">
                          {book.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-right font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                        ₹{book.price.toLocaleString()}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(book)}
                          title={`Click to switch status to ${isAvailable ? 'Issued' : 'Available'}`}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/80'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAvailable ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          <span>{book.status}</span>
                        </button>
                        {book.status === 'Issued' && book.issuedTo && (
                          <div className="mt-1 text-[11px] text-amber-800 font-semibold">
                            To: {book.issuedTo.studentName} ({book.issuedTo.studentRollNo})
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Button */}
                          <button
                            type="button"
                            onClick={() => onViewBook(book)}
                            title="View Book Details"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            aria-label={`View ${book.title}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => onEditBook(book)}
                            title="Edit Book Information"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            aria-label={`Edit ${book.title}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => onDeleteBook(book)}
                            title="Delete Book"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            aria-label={`Delete ${book.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State as required by prompt: "If no book is found, display: No books found." */
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              No books found.
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-5">
              {hasActiveFilters
                ? 'No library records match your current search query or filter selections.'
                : 'There are currently no books registered in the library catalog.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {hasActiveFilters ? (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={onNavigateToAdd}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
                >
                  Add Your First Book
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
