import React from 'react';
import {
  LayoutDashboard,
  BookMarked,
  PlusCircle,
  Library,
  Database,
  X,
  Clock,
  LogOut,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { AdminTab, AdminUser } from '../types.ts';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  totalBooksCount: number;
  issuedBooksCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  adminUser?: AdminUser;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  totalBooksCount,
  issuedBooksCount,
  isOpenMobile,
  onCloseMobile,
  adminUser,
  onLogout,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'books' as AdminTab,
      label: 'View All Books',
      icon: BookMarked,
      badge: totalBooksCount,
    },
    {
      id: 'issued' as AdminTab,
      label: 'Issued Books Registry',
      icon: Clock,
      badge: issuedBooksCount > 0 ? issuedBooksCount : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'add' as AdminTab,
      label: 'Add New Book',
      icon: PlusCircle,
      badge: null,
    },
  ];

  const handleNavClick = (tab: AdminTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-sm">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Campus Library
              </h1>
              <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Admin Portal
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Admin Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-semibold tabular-nums ${
                      isActive
                        ? 'bg-indigo-700/80 text-white'
                        : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin User Info & Logout Section */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/60">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                {adminUser?.name || 'Chief Librarian'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono truncate">
                ID: {adminUser?.staffId || 'LIB-01'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout from Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};
