import React from 'react';
import {
  Menu,
  Search,
  Plus,
  RotateCcw,
  User,
  LogOut,
  GraduationCap,
  ShieldCheck,
  Hash,
} from 'lucide-react';
import { AdminTab, UserSession } from '../types.ts';

interface TopbarProps {
  currentTab?: AdminTab;
  onOpenMobileMenu?: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onNavigateToAdd?: () => void;
  onResetData: () => void;
  session: UserSession;
  onLogout: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  onOpenMobileMenu,
  searchTerm = '',
  onSearchChange,
  onNavigateToAdd,
  onResetData,
  session,
  onLogout,
}) => {
  const isStudent = session?.type === 'student';
  const isAdmin = session?.type === 'admin';

  const getAdminTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Librarian Dashboard';
      case 'books':
        return 'Library Books Inventory';
      case 'issued':
        return 'Issued Books Registry';
      case 'add':
        return 'Add New Book';
      default:
        return 'Library System';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Mobile menu toggle / System branding */}
      <div className="flex items-center gap-3 min-w-0">
        {isAdmin && onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {isAdmin ? getAdminTitle() : 'College Library Portal'}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block truncate">
            {isAdmin
              ? 'Central Library Administration & Circulation Desk'
              : 'Browse, issue, and manage your college textbooks'}
          </p>
        </div>
      </div>

      {/* Right side tools: Reset Demo Data, User Info, and Visible Logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Reset Sample Data Button (Helpful for viva demo) */}
        <button
          type="button"
          onClick={onResetData}
          title="Reset to default sample books (useful for viva / lab presentation)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Reset Demo Data</span>
        </button>

        {/* Admin Quick Add shortcut */}
        {isAdmin && currentTab !== 'add' && onNavigateToAdd && (
          <button
            type="button"
            onClick={onNavigateToAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Book</span>
          </button>
        )}

        {/* User Badge Info */}
        {isStudent && session && (
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-bold text-indigo-950 flex items-center gap-1">
                <span>{session.student.name}</span>
                <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1 py-0.2 rounded font-mono font-bold">
                  {session.student.rollNo}
                </span>
              </div>
              <div className="text-[11px] text-indigo-600 font-medium">
                Dept: {session.student.department}
              </div>
            </div>
          </div>
        )}

        {isAdmin && session && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs">
            <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900 leading-tight">
                {session.admin.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Staff ID: {session.admin.staffId}
              </div>
            </div>
          </div>
        )}

        {/* Clearly Visible Logout Button as strictly requested */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shadow-2xs cursor-pointer"
          title="Sign out of current account"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
