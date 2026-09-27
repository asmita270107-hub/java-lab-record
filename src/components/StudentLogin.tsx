import { useState } from 'react';
import { BookOpen, User, Hash, GraduationCap, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Student, AdminUser, UserSession } from '../types.ts';

interface StudentLoginProps {
  onLogin: (session: UserSession) => void;
}

export default function StudentLogin({ onLogin }: StudentLoginProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');

  // Student Form State (Strictly Name, Roll No, Department - NO email, NO password)
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('CSBS');
  const [studentError, setStudentError] = useState('');

  // Admin Form State
  const [adminName, setAdminName] = useState('Dr. S. Ramanathan');
  const [staffId, setStaffId] = useState('LIB-ADMIN-01');

  const commonDepartments = ['CSBS', 'CSE', 'IT', 'AI & DS', 'ECE', 'EEE', 'Mechanical', 'Civil'];

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');

    const cleanName = studentName.trim();
    const cleanRollNo = rollNo.trim().toUpperCase();
    const cleanDept = department.trim();

    if (!cleanName) {
      setStudentError('Please enter your full name');
      return;
    }
    if (!cleanRollNo) {
      setStudentError('Please enter your student Roll Number (e.g. 24CS101)');
      return;
    }
    if (!cleanDept) {
      setStudentError('Please specify your Department');
      return;
    }

    const student: Student = {
      name: cleanName,
      rollNo: cleanRollNo,
      department: cleanDept,
    };

    onLogin({ type: 'student', student });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const admin: AdminUser = {
      name: adminName.trim() || 'Chief Librarian',
      staffId: staffId.trim() || 'LIB-01',
      role: 'Librarian',
    };
    onLogin({ type: 'admin', admin });
  };

  const handleQuickStudentLogin = (name: string, roll: string, dept: string) => {
    onLogin({
      type: 'student',
      student: { name, rollNo: roll, department: dept },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/25 mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          College Library Management System
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Departmental & Central Library Access Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-200/80">
          {/* Tab Selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              Student Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Librarian / Admin
            </button>
          </div>

          {activeTab === 'student' ? (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">Student Sign In</h2>
                <p className="text-xs text-slate-500">
                  Enter your college details to browse, issue, and return books.
                </p>
              </div>

              {studentError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg">
                  {studentError}
                </div>
              )}

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                {/* Student Name */}
                <div>
                  <label htmlFor="studentName" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Student Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="studentName"
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Asmita"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium transition"
                      required
                    />
                  </div>
                </div>

                {/* Roll Number */}
                <div>
                  <label htmlFor="rollNo" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Roll Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      id="rollNo"
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. 24CS101"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium uppercase transition"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your unique college registration/roll number
                  </p>
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <select
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium transition"
                    >
                      {commonDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition cursor-pointer"
                >
                  <span>Login to Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Logins for Viva/Testing */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>One-Click Demo Profiles (For Project Evaluation):</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickStudentLogin('Asmita', '24CS101', 'CSBS')}
                    className="text-left p-2.5 border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100 rounded-xl transition cursor-pointer text-xs"
                  >
                    <div className="font-semibold text-indigo-950 flex items-center gap-1">
                      <span>Asmita</span>
                      <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1 py-0.2 rounded">CSBS</span>
                    </div>
                    <div className="text-[11px] text-indigo-700 mt-0.5">Roll: 24CS101</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickStudentLogin('Jeevitha', '24CS102', 'CSBS')}
                    className="text-left p-2.5 border border-purple-100 bg-purple-50/60 hover:bg-purple-100 rounded-xl transition cursor-pointer text-xs"
                  >
                    <div className="font-semibold text-purple-950 flex items-center gap-1">
                      <span>Jeevitha</span>
                      <span className="text-[10px] bg-purple-200 text-purple-800 px-1 py-0.2 rounded">CSBS</span>
                    </div>
                    <div className="text-[11px] text-purple-700 mt-0.5">Roll: 24CS102</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">Librarian & Admin Portal</h2>
                <p className="text-xs text-slate-500">
                  Manage catalog, books inventory, student issue records, and returns.
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Librarian / Staff Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Staff / Admin ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    Full administrative privileges: Add Book, Edit Book, Delete Book, View all student issues, and manage returns.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Login as Librarian</span>
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          College Mini Project • Simple LocalStorage Data Persistence • No Password Required
        </div>
      </div>
    </div>
  );
}
