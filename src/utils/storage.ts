import { Book, UserSession } from '../types.ts';

export const STORAGE_KEY = 'libraryBooks';
export const SESSION_STORAGE_KEY = 'libraryUserSession';

export const SAMPLE_BOOKS: Book[] = [
  {
    id: '101',
    title: 'Java Programming',
    author: 'James',
    category: 'Programming',
    price: 500,
    status: 'Available',
    dateAdded: '2026-09-20',
    shelfLocation: 'Rack A-12',
    issuedTo: null,
  },
  {
    id: '102',
    title: 'Python Basics',
    author: 'John',
    category: 'Programming',
    price: 450,
    status: 'Issued',
    dateAdded: '2026-09-22',
    shelfLocation: 'Rack A-14',
    issuedTo: {
      studentName: 'Asmita',
      studentRollNo: '24CS101',
      studentDepartment: 'CSBS',
      issueDate: '2026-09-24',
    },
  },
  {
    id: '103',
    title: 'Database Management',
    author: 'Robert',
    category: 'Database',
    price: 600,
    status: 'Available',
    dateAdded: '2026-09-24',
    shelfLocation: 'Rack B-05',
    issuedTo: null,
  },
  {
    id: '104',
    title: 'Operating System Concepts',
    author: 'Silberschatz',
    category: 'Computer Science',
    price: 750,
    status: 'Available',
    dateAdded: '2026-09-25',
    shelfLocation: 'Rack C-02',
    issuedTo: null,
  },
  {
    id: '105',
    title: 'Computer Networks',
    author: 'Andrew Tanenbaum',
    category: 'Networking',
    price: 680,
    status: 'Issued',
    dateAdded: '2026-09-26',
    shelfLocation: 'Rack B-09',
    issuedTo: {
      studentName: 'Rahul Verma',
      studentRollNo: '24IT105',
      studentDepartment: 'IT',
      issueDate: '2026-09-26',
    },
  },
  {
    id: '106',
    title: 'Data Structures and Algorithms',
    author: 'Mark Allen Weiss',
    category: 'Programming',
    price: 620,
    status: 'Available',
    dateAdded: '2026-09-27',
    shelfLocation: 'Rack A-08',
    issuedTo: null,
  },
];

/**
 * Load books from browser localStorage.
 * If no books exist (first launch), seed with SAMPLE_BOOKS.
 */
export function getStoredBooks(): Book[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // First launch: initialize with sample data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_BOOKS));
      return SAMPLE_BOOKS;
    }
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all items have issuedTo initialized correctly
      return parsed.map((book: any) => ({
        ...book,
        issuedTo: book.issuedTo || null,
      }));
    }
    return SAMPLE_BOOKS;
  } catch (error) {
    console.error('Error reading library books from localStorage:', error);
    return SAMPLE_BOOKS;
  }
}

/**
 * Save books array to localStorage
 */
export function saveStoredBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Error saving library books to localStorage:', error);
  }
}

/**
 * Reset localStorage to initial sample books (helpful for college project demos)
 */
export function resetToSampleBooks(): Book[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_BOOKS));
    return SAMPLE_BOOKS;
  } catch (error) {
    console.error('Error resetting books in localStorage:', error);
    return SAMPLE_BOOKS;
  }
}

/**
 * Helper to suggest the next numeric Book ID
 */
export function getNextBookId(books: Book[]): string {
  const numericIds = books
    .map((b) => parseInt(b.id, 10))
    .filter((n) => !isNaN(n));
  
  if (numericIds.length === 0) return '101';
  const maxId = Math.max(...numericIds);
  return String(maxId + 1);
}

/**
 * Load logged in user session (Student or Admin)
 */
export function getStoredSession(): UserSession {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading user session:', e);
    return null;
  }
}

/**
 * Save current user session
 */
export function saveStoredSession(session: UserSession): void {
  try {
    if (!session) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Error saving user session:', e);
  }
}

/**
 * Clear session on logout
 */
export function clearStoredSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing user session:', e);
  }
}
