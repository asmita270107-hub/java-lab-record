export type BookStatus = 'Available' | 'Issued';

export interface IssuedRecord {
  studentName: string;
  studentRollNo: string;
  studentDepartment: string;
  issueDate: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  status: BookStatus;
  dateAdded: string;
  shelfLocation?: string;
  isbn?: string;
  issuedTo?: IssuedRecord | null;
}

export interface Student {
  name: string;
  rollNo: string;
  department: string;
}

export interface AdminUser {
  name: string;
  staffId: string;
  role: 'Librarian';
}

export type UserSession = 
  | { type: 'student'; student: Student }
  | { type: 'admin'; admin: AdminUser }
  | null;

export type AdminTab = 'dashboard' | 'books' | 'issued' | 'add';
export type StudentTab = 'browse' | 'my-books' | 'rules';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface BookFormData {
  id: string;
  title: string;
  author: string;
  category: string;
  price: string | number;
  status: BookStatus;
}
