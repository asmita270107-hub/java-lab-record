import { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Hash, 
  GraduationCap, 
  BookMarked, 
  RotateCcw, 
  Info, 
  Tag, 
  IndianRupee, 
  AlertCircle,
  Eye,
  Calendar,
  Layers
} from 'lucide-react';
import { Book, Student, StudentTab } from '../types.ts';

interface StudentDashboardProps {
  student: Student;
  books: Book[];
  onIssueBook: (bookId: string) => void;
  onReturnBook: (bookId: string) => void;
  onViewBook: (book: Book) => void;
}

export default function StudentDashboard({
  student,
  books,
  onIssueBook,
  onReturnBook,
  onViewBook,
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<StudentTab>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'issued'>('all');

  // Filter books issued by THIS student (matching Roll Number strictly)
  const myIssuedBooks = useMemo(() => {
    return books.filter(
      (b) => b.status === 'Issued' && b.issuedTo?.studentRollNo === student.rollNo
    );
  }, [books, student.rollNo]);

  // Overall catalog stats
  const totalBooks = books.length;
  const availableCount = books.filter((b) => b.status === 'Available').length;
  const issuedTotal = books.filter((b) => b.status === 'Issued').length;

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, [books]);

  // Filter books for catalog browsing
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Category filter
      if (selectedCategory !== 'All' && b.category !== selectedCategory) {
        return false;
      }

      // Availability filter
      if (availabilityFilter === 'available' && b.status !== 'Available') {
        return false;
      }
      if (availabilityFilter === 'issued' && b.status !== 'Issued') {
        return false;
      }

      // Search query filter (matches ID, title, author, category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = b.id.toLowerCase().includes(q);
        const matchTitle = b.title.toLowerCase().includes(q);
        const matchAuthor = b.author.toLowerCase().includes(q);
        const matchCat = b.category.toLowerCase().includes(q);
        return matchId || matchTitle || matchAuthor || matchCat;
      }

      return true;
    });
  }, [books, selectedCategory, availabilityFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Student Welcome & Profile Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 rounded-2xl text-white p-6 sm:p-7 shadow-lg shadow-indigo-600/15">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-indigo-50 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              Student Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {student.name}!
            </h1>
            <p className="text-indigo-100 text-sm">
              Explore library books, issue titles for study, and manage your current borrowings.
            </p>
          </div>

          {/* Student Profile Card Details */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3.5 sm:px-5 flex flex-wrap gap-4 text-xs font-medium text-white shadow-inner">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-200" />
              <div>
                <span className="text-indigo-200 text-[10px] block uppercase font-bold tracking-wider">Name</span>
                <span className="font-semibold">{student.name}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-200" />
              <div>
                <span className="text-indigo-200 text-[10px] block uppercase font-bold tracking-wider">Roll Number</span>
                <span className="font-bold text-amber-200">{student.rollNo}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-200" />
              <div>
                <span className="text-indigo-200 text-[10px] block uppercase font-bold tracking-wider">Department</span>
                <span className="font-semibold">{student.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metric counters inside banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-indigo-200 text-xs block">My Issued Books</span>
            <span className="text-2xl font-bold text-amber-200">{myIssuedBooks.length}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-indigo-200 text-xs block">Available in Library</span>
            <span className="text-2xl font-bold text-emerald-300">{availableCount}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-indigo-200 text-xs block">Total Books Catalog</span>
            <span className="text-2xl font-bold text-white">{totalBooks}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-indigo-200 text-xs block">Total Issued (Campus)</span>
            <span className="text-2xl font-bold text-purple-200">{issuedTotal}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('browse')}
          className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'browse'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse & Search Books</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
            {books.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-books')}
          className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'my-books'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>My Issued Books</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              myIssuedBooks.length > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {myIssuedBooks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'rules'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Borrowing Rules</span>
        </button>
      </div>

      {/* TAB 1: BROWSE & SEARCH BOOKS */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Book ID, Title, Author, or Category..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
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

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setAvailabilityFilter('all')}
                className={`text-xs px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                  availabilityFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({books.length})
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('available')}
                className={`text-xs px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                  availabilityFilter === 'available'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Available ({availableCount})
              </button>
              <button
                type="button"
                onClick={() => setAvailabilityFilter('issued')}
                className={`text-xs px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                  availabilityFilter === 'issued'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Issued ({issuedTotal})
              </button>
            </div>
          </div>

          {/* Book Cards Grid / Table */}
          {filteredBooks.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No books found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                No library titles match your current search or filter criteria. Try adjusting the query.
              </p>
              {(searchQuery || selectedCategory !== 'All' || availabilityFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setAvailabilityFilter('all');
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => {
                const isIssuedToMe = book.status === 'Issued' && book.issuedTo?.studentRollNo === student.rollNo;
                const isIssuedToOther = book.status === 'Issued' && !isIssuedToMe;
                const isAvailable = book.status === 'Available';

                return (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                  >
                    <div className="p-5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          ID: {book.id}
                        </span>

                        {isAvailable && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            Available
                          </span>
                        )}

                        {isIssuedToMe && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Clock className="w-3 h-3" />
                            Issued by You
                          </span>
                        )}

                        {isIssuedToOther && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <XCircle className="w-3 h-3" />
                            Currently Issued
                          </span>
                        )}
                      </div>

                      {/* Title & Author */}
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">by {book.author}</p>

                      {/* Meta info */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {book.category}
                          </span>
                        </div>
                        <div className="flex items-center font-semibold text-slate-800">
                          <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                          <span>{book.price}</span>
                        </div>
                      </div>

                      {/* Issue status message if taken by another student */}
                      {isIssuedToOther && (
                        <div className="mt-3 p-2 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-amber-800 flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                          <span>
                            This book is currently issued to another student. You can request it once returned.
                          </span>
                        </div>
                      )}

                      {/* Issue status message if issued to current student */}
                      {isIssuedToMe && (
                        <div className="mt-3 p-2 bg-indigo-50/70 border border-indigo-200/80 rounded-lg text-[11px] text-indigo-800 flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                          <span>
                            Issued on {book.issuedTo?.issueDate}. Return when you are finished reading.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onViewBook(book)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      {isAvailable && (
                        <button
                          type="button"
                          onClick={() => onIssueBook(book.id)}
                          className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Issue Book</span>
                        </button>
                      )}

                      {isIssuedToMe && (
                        <button
                          type="button"
                          onClick={() => onReturnBook(book.id)}
                          className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return Book</span>
                        </button>
                      )}

                      {isIssuedToOther && (
                        <span className="text-xs font-semibold text-slate-400 bg-slate-200/60 px-3 py-1.5 rounded-lg cursor-not-allowed">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ISSUED BOOKS */}
      {activeTab === 'my-books' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-indigo-600" />
                <span>My Issued Books</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing all books currently issued under student Roll Number: <strong className="text-indigo-600">{student.rollNo}</strong>
              </p>
            </div>

            <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
              Active Borrowings: <strong>{myIssuedBooks.length}</strong>
            </div>
          </div>

          {myIssuedBooks.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <BookMarked className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">You have no issued books</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                You haven&apos;t borrowed any titles yet. Head over to the catalogue to find and issue available books.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Available Books</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Book ID</th>
                      <th className="py-3 px-4">Book Title</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {myIssuedBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-indigo-50/20 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-xs">
                          #{book.id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {book.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">
                          {book.author}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {book.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1 text-indigo-700 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{book.issuedTo?.issueDate || 'Today'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Issued
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onViewBook(book)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onReturnBook(book.id)}
                              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Return Book</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BORROWING RULES & GUIDELINES */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Info className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900">College Library Rules & Guidelines</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Borrowing Limit & Duration
              </h4>
              <p>• Undergraduate students may borrow up to 3 books concurrently.</p>
              <p>• Standard borrowing duration is 14 days from the date of issue.</p>
              <p>• Books must be returned in good physical condition without ink marks or torn pages.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                Returns & Overdue Policy
              </h4>
              <p>• Return books on or before the due date to allow fellow students to access them.</p>
              <p>• You can return any issued book instantly using the &quot;Return Book&quot; button in your portal.</p>
              <p>• Reference copies and rare journals marked with red stickers cannot be checked out.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
