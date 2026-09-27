import React, { useState, useEffect, useCallback } from 'react';
import { Book, AdminTab, UserSession, ToastNotification } from './types.ts';
import {
  getStoredBooks,
  saveStoredBooks,
  resetToSampleBooks,
  getStoredSession,
  saveStoredSession,
  clearStoredSession,
} from './utils/storage.ts';
import { Sidebar } from './components/Sidebar.tsx';
import { Topbar } from './components/Topbar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { BookList } from './components/BookList.tsx';
import { BookForm } from './components/BookForm.tsx';
import { BookDetailsModal } from './components/BookDetailsModal.tsx';
import { EditBookModal } from './components/EditBookModal.tsx';
import { ConfirmDialog } from './components/ConfirmDialog.tsx';
import { Toast } from './components/Toast.tsx';
import StudentLogin from './components/StudentLogin.tsx';
import StudentDashboard from './components/StudentDashboard.tsx';
import AdminIssuedBooks from './components/AdminIssuedBooks.tsx';
import { GraduationCap, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Session State
  const [session, setSession] = useState<UserSession>(() => getStoredSession());

  // Books State
  const [books, setBooks] = useState<Book[]>([]);

  // Admin Navigation Tab
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showVivaGuide, setShowVivaGuide] = useState<boolean>(false);

  // Modals state
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  // Toast Notifications
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({
        id: String(Date.now()),
        message,
        type,
      });
    },
    []
  );

  // Load books on mount from localStorage
  useEffect(() => {
    const loadedBooks = getStoredBooks();
    setBooks(loadedBooks);
  }, []);

  // Update localStorage whenever books changes
  const updateBooks = (newBooks: Book[]) => {
    setBooks(newBooks);
    saveStoredBooks(newBooks);
  };

  // Login handler
  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
    saveStoredSession(newSession);
    if (newSession?.type === 'student') {
      showToast(`Welcome, ${newSession.student.name}!`, 'success');
    } else if (newSession?.type === 'admin') {
      showToast(`Logged in as Librarian (${newSession.admin.name})`, 'success');
    }
  };

  // Logout handler
  const handleLogout = () => {
    clearStoredSession();
    setSession(null);
    showToast('Logged out successfully.', 'info');
  };

  // Add Book handler (Admin)
  const handleAddBook = (newBook: Book) => {
    const updated = [newBook, ...books];
    updateBooks(updated);
    showToast('Book added successfully!', 'success');
  };

  // Update Book handler (Admin)
  const handleUpdateBook = (updatedBook: Book) => {
    const updated = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
    updateBooks(updated);
    if (viewingBook && viewingBook.id === updatedBook.id) {
      setViewingBook(updatedBook);
    }
    showToast('Book updated successfully!', 'success');
  };

  // Delete Book handler (Admin)
  const handleConfirmDelete = () => {
    if (!deletingBook) return;
    const updated = books.filter((b) => b.id !== deletingBook.id);
    updateBooks(updated);
    setDeletingBook(null);
    showToast('Book deleted successfully!', 'success');
  };

  // Student or Admin Issue Book handler
  const handleIssueBook = (bookId: string) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    if (targetBook.status !== 'Available') {
      // As requested: if students request an already issued book, inform them clearly
      showToast('This book is currently issued.', 'error');
      return;
    }

    if (session?.type !== 'student') {
      showToast('Only students can issue books directly in the student portal.', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const updatedBook: Book = {
      ...targetBook,
      status: 'Issued',
      issuedTo: {
        studentName: session.student.name,
        studentRollNo: session.student.rollNo,
        studentDepartment: session.student.department,
        issueDate: today,
      },
    };

    const updated = books.map((b) => (b.id === bookId ? updatedBook : b));
    updateBooks(updated);

    if (viewingBook && viewingBook.id === bookId) {
      setViewingBook(updatedBook);
    }

    showToast('Book issued successfully!', 'success');
  };

  // Student or Admin Return Book handler
  const handleReturnBook = (bookId: string) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    const updatedBook: Book = {
      ...targetBook,
      status: 'Available',
      issuedTo: null,
    };

    const updated = books.map((b) => (b.id === bookId ? updatedBook : b));
    updateBooks(updated);

    if (viewingBook && viewingBook.id === bookId) {
      setViewingBook(updatedBook);
    }

    showToast('Book returned successfully!', 'success');
  };

  // Admin Quick toggle status
  const handleToggleStatus = (book: Book) => {
    if (book.status === 'Available') {
      // Toggle to issued (for demo admin)
      const updatedBook: Book = {
        ...book,
        status: 'Issued',
        issuedTo: {
          studentName: 'Campus Student',
          studentRollNo: '24CS999',
          studentDepartment: 'General',
          issueDate: new Date().toISOString().split('T')[0],
        },
      };
      const updated = books.map((b) => (b.id === book.id ? updatedBook : b));
      updateBooks(updated);
      showToast('Book marked as Issued!', 'info');
    } else {
      // Return book
      handleReturnBook(book.id);
    }
  };

  // Reset to initial sample books (useful for viva demo)
  const handleResetData = () => {
    const samples = resetToSampleBooks();
    setBooks(samples);
    showToast('Sample library records restored successfully!', 'info');
  };

  // Search focus helper for Admin
  const handleFocusSearch = () => {
    setAdminTab('books');
  };

  // If user is not logged in, show Student Login Page
  if (!session) {
    return (
      <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <StudentLogin onLogin={handleLogin} />
      </>
    );
  }

  // Active counts
  const issuedBooksCount = books.filter((b) => b.status === 'Issued').length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ADMIN VIEW */}
      {session.type === 'admin' ? (
        <>
          {/* Admin Sidebar */}
          <Sidebar
            currentTab={adminTab}
            onSelectTab={setAdminTab}
            totalBooksCount={books.length}
            issuedBooksCount={issuedBooksCount}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            adminUser={session.admin}
            onLogout={handleLogout}
          />

          {/* Main App Container for Admin */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
            <Topbar
              currentTab={adminTab}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              searchTerm={searchTerm}
              onSearchChange={(term) => {
                setSearchTerm(term);
                if (adminTab !== 'books') {
                  setAdminTab('books');
                }
              }}
              onNavigateToAdd={() => setAdminTab('add')}
              onResetData={handleResetData}
              session={session}
              onLogout={handleLogout}
            />

            {/* Presentation Guide Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs border-b border-indigo-900/60">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-semibold tracking-wide">
                  Librarian Portal Active:
                </span>
                <span className="text-slate-300 hidden sm:inline">
                  Manage books catalog, track student issues, and process returns
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowVivaGuide(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 rounded-lg text-xs font-medium transition cursor-pointer text-white"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Project Demo Guide</span>
              </button>
            </div>

            {/* Admin Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {/* TAB 1: DASHBOARD */}
              {adminTab === 'dashboard' && (
                <Dashboard
                  books={books}
                  onNavigate={setAdminTab}
                  onViewBook={(book) => setViewingBook(book)}
                  onFocusSearch={handleFocusSearch}
                />
              )}

              {/* TAB 2: ALL BOOKS (CRUD) */}
              {adminTab === 'books' && (
                <BookList
                  books={books}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onViewBook={(book) => setViewingBook(book)}
                  onEditBook={(book) => setEditingBook(book)}
                  onDeleteBook={(book) => setDeletingBook(book)}
                  onToggleStatus={handleToggleStatus}
                  onNavigateToAdd={() => setAdminTab('add')}
                />
              )}

              {/* TAB 3: ISSUED BOOKS REGISTRY */}
              {adminTab === 'issued' && (
                <AdminIssuedBooks
                  books={books}
                  onReturnBook={handleReturnBook}
                  onViewBook={(book) => setViewingBook(book)}
                />
              )}

              {/* TAB 4: ADD BOOK */}
              {adminTab === 'add' && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                    <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Add Book to Catalog
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Fill out the required information to register a new textbook in the system.
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    </div>

                    <BookForm
                      mode="add"
                      existingBooks={books}
                      onSubmit={(newBook) => {
                        handleAddBook(newBook);
                      }}
                    />
                  </div>
                </div>
              )}
            </main>

            <footer className="mt-auto border-t border-slate-200/60 bg-white/50 px-6 py-4 text-center text-xs text-slate-400">
              <span>College Library Management System • Librarian Administration Portal</span>
            </footer>
          </div>
        </>
      ) : (
        /* STUDENT VIEW */
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            session={session}
            onResetData={handleResetData}
            onLogout={handleLogout}
          />

          {/* Student Banner Sub-bar */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs border-b border-indigo-800">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-300 shrink-0" />
              <span className="font-semibold tracking-wide">
                Student Self-Service Portal:
              </span>
              <span className="text-indigo-200 hidden sm:inline">
                Logged in as {session.student.name} ({session.student.rollNo}) • {session.student.department}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowVivaGuide(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition cursor-pointer text-white"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Project Demo Guide</span>
            </button>
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <StudentDashboard
              student={session.student}
              books={books}
              onIssueBook={handleIssueBook}
              onReturnBook={handleReturnBook}
              onViewBook={(book) => setViewingBook(book)}
            />
          </main>

          <footer className="mt-auto border-t border-slate-200/60 bg-white/50 px-6 py-4 text-center text-xs text-slate-400">
            <span>College Library Management System • Student Portal</span>
          </footer>
        </div>
      )}

      {/* VIEW BOOK MODAL */}
      <BookDetailsModal
        isOpen={!!viewingBook}
        book={viewingBook}
        session={session}
        onClose={() => setViewingBook(null)}
        onEdit={(book) => {
          setViewingBook(null);
          setEditingBook(book);
        }}
        onIssueBook={handleIssueBook}
        onReturnBook={handleReturnBook}
      />

      {/* EDIT BOOK MODAL (Admin only) */}
      <EditBookModal
        isOpen={!!editingBook}
        book={editingBook}
        existingBooks={books}
        onClose={() => setEditingBook(null)}
        onSave={handleUpdateBook}
      />

      {/* DELETE CONFIRMATION DIALOG (Admin only) */}
      <ConfirmDialog
        isOpen={!!deletingBook}
        book={deletingBook}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingBook(null)}
      />

      {/* COLLEGE PROJECT VIVA & DEMO GUIDE MODAL */}
      {showVivaGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Project Presentation & Viva Guide
                  </h3>
                  <p className="text-xs text-slate-500">
                    Student Login, Issue/Return, & Isolation Evaluation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVivaGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-wider mb-1">
                  1. Student Authentication & Isolation
                </h4>
                <p className="text-xs text-indigo-950 leading-relaxed">
                  Requires <strong>Student Name</strong>, <strong>Roll Number</strong>, and <strong>Department</strong> (No email, no password needed). Each student&apos;s issued books are tied to their unique <strong>Roll Number</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Test Scenarios (Viva Ready)
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600">
                  <li>
                    <strong>Login as Student 1 (Asmita, 24CS101):</strong> She sees her issued book &quot;Python Basics&quot; in &quot;My Issued Books&quot;. She can issue &quot;Java Programming&quot; and return books instantly.
                  </li>
                  <li>
                    <strong>Switch to Student 2 (Jeevitha, 24CS102):</strong> Jeevitha cannot see Asmita&apos;s books in &quot;My Issued Books&quot;. In the catalog, any book taken by Asmita shows &quot;Currently Issued&quot; with a clear notification that another student has already taken it.
                  </li>
                  <li>
                    <strong>Admin/Librarian Portal:</strong> View all books CRUD, plus the <strong>Issued Books Registry</strong> showing each borrower student&apos;s Name, Roll No, Department, and Issue Date with one-click return capability.
                  </li>
                  <li>
                    <strong>Logout Flow:</strong> Clear student session and return to login without losing any library data.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVivaGuide(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
