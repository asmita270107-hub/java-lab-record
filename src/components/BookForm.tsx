import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  BookPlus,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { Book, BookStatus } from '../types.ts';
import { getNextBookId } from '../utils/storage.ts';

interface BookFormProps {
  mode: 'add' | 'edit';
  initialData?: Book | null;
  existingBooks: Book[];
  onSubmit: (bookData: Book) => void;
  onCancel?: () => void;
}

const DEFAULT_CATEGORIES = [
  'Programming',
  'Database',
  'Computer Science',
  'Networking',
  'AI & ML',
  'Electronics',
  'Mathematics',
  'Management',
  'General',
];

export const BookForm: React.FC<BookFormProps> = ({
  mode,
  initialData,
  existingBooks,
  onSubmit,
  onCancel,
}) => {
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [category, setCategory] = useState<string>('Programming');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [price, setPrice] = useState<string>('');
  const [status, setStatus] = useState<BookStatus>('Available');
  const [shelfLocation, setShelfLocation] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize or reset form
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setId(initialData.id);
      setTitle(initialData.title);
      setAuthor(initialData.author);
      if (DEFAULT_CATEGORIES.includes(initialData.category)) {
        setCategory(initialData.category);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setIsCustomCategory(true);
        setCustomCategory(initialData.category);
      }
      setPrice(String(initialData.price));
      setStatus(initialData.status);
      setShelfLocation(initialData.shelfLocation || '');
      setErrors({});
      setTouched({});
    } else if (mode === 'add') {
      // Suggest next numeric ID
      const nextId = getNextBookId(existingBooks);
      setId(nextId);
      setTitle('');
      setAuthor('');
      setCategory('Programming');
      setIsCustomCategory(false);
      setCustomCategory('');
      setPrice('');
      setStatus('Available');
      setShelfLocation('Rack A-01');
      setErrors({});
      setTouched({});
    }
  }, [mode, initialData, existingBooks]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Book ID validation
    if (!id.trim()) {
      newErrors.id = 'Book ID is required';
    } else if (mode === 'add') {
      const isDuplicate = existingBooks.some(
        (b) => b.id.trim().toLowerCase() === id.trim().toLowerCase()
      );
      if (isDuplicate) {
        newErrors.id = 'This Book ID already exists. Please choose a unique ID.';
      }
    }

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Book Title is required';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Book Title must be at least 2 characters';
    }

    // Author validation
    if (!author.trim()) {
      newErrors.author = 'Author name is required';
    }

    // Category validation
    const resolvedCategory = isCustomCategory ? customCategory.trim() : category;
    if (!resolvedCategory) {
      newErrors.category = 'Please select or enter a Category';
    }

    // Price validation
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        newErrors.price = 'Please enter a valid numeric price (>= 0)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      id: true,
      title: true,
      author: true,
      category: true,
      price: true,
    });

    if (!validate()) {
      return;
    }

    const finalCategory = isCustomCategory
      ? customCategory.trim() || 'General'
      : category;

    const bookToSave: Book = {
      id: id.trim(),
      title: title.trim(),
      author: author.trim(),
      category: finalCategory,
      price: Number(price),
      status: status,
      dateAdded: initialData?.dateAdded || new Date().toISOString().split('T')[0],
      shelfLocation: shelfLocation.trim() || 'General Stack',
      issuedTo: status === 'Issued' ? (initialData?.issuedTo || null) : null,
    };

    onSubmit(bookToSave);

    // If add mode, reset form
    if (mode === 'add') {
      const nextId = getNextBookId([...existingBooks, bookToSave]);
      setId(nextId);
      setTitle('');
      setAuthor('');
      setCategory('Programming');
      setIsCustomCategory(false);
      setCustomCategory('');
      setPrice('');
      setStatus('Available');
      setShelfLocation('Rack A-01');
      setErrors({});
      setTouched({});
    }
  };

  const handleReset = () => {
    if (mode === 'add') {
      const nextId = getNextBookId(existingBooks);
      setId(nextId);
      setTitle('');
      setAuthor('');
      setCategory('Programming');
      setIsCustomCategory(false);
      setCustomCategory('');
      setPrice('');
      setStatus('Available');
      setShelfLocation('Rack A-01');
      setErrors({});
      setTouched({});
    } else if (initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setCategory(initialData.category);
      setPrice(String(initialData.price));
      setStatus(initialData.status);
      setShelfLocation(initialData.shelfLocation || '');
      setErrors({});
      setTouched({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Book ID */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Book ID <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={id}
              disabled={mode === 'edit'}
              onChange={(e) => {
                setId(e.target.value);
                if (errors.id) setErrors((prev) => ({ ...prev, id: '' }));
              }}
              onBlur={() => handleBlur('id')}
              placeholder="e.g. 104, BK-202"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all tabular-nums ${
                mode === 'edit'
                  ? 'bg-slate-100/90 text-slate-500 cursor-not-allowed border-slate-200'
                  : errors.id && touched.id
                  ? 'border-rose-400 bg-rose-50/30 text-slate-900 focus:ring-2 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500'
              }`}
            />
            {mode === 'edit' && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center gap-1 text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Locked</span>
              </span>
            )}
          </div>
          {mode === 'edit' ? (
            <p className="text-[11px] text-slate-400 mt-1">
              Book ID is a primary key and cannot be changed during update.
            </p>
          ) : errors.id && touched.id ? (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.id}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Must be unique for each book in the library.
            </p>
          )}
        </div>

        {/* Book Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Book Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            onBlur={() => handleBlur('title')}
            placeholder="e.g. Complete Reference Java"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
              errors.title && touched.title
                ? 'border-rose-400 bg-rose-50/30 text-slate-900 focus:ring-2 focus:ring-rose-200 focus:border-rose-500'
                : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
          />
          {errors.title && touched.title ? (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.title}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Full official title of the textbook or volume.
            </p>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Author <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              if (errors.author) setErrors((prev) => ({ ...prev, author: '' }));
            }}
            onBlur={() => handleBlur('author')}
            placeholder="e.g. Herbert Schildt"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
              errors.author && touched.author
                ? 'border-rose-400 bg-rose-50/30 text-slate-900 focus:ring-2 focus:ring-rose-200 focus:border-rose-500'
                : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
          />
          {errors.author && touched.author ? (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.author}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Author(s) or publication house name.
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Category <span className="text-rose-500">*</span>
          </label>
          <div className="space-y-2">
            <select
              value={isCustomCategory ? 'Other' : category}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setIsCustomCategory(true);
                } else {
                  setIsCustomCategory(false);
                  setCategory(e.target.value);
                }
                if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="Other">+ Custom / Other Category</option>
            </select>

            {isCustomCategory && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type custom category name..."
                className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/30 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              />
            )}
          </div>
          {errors.category && touched.category && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Price (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
              ₹
            </span>
            <input
              type="number"
              step="any"
              min="0"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
              }}
              onBlur={() => handleBlur('price')}
              placeholder="e.g. 500"
              className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm transition-all tabular-nums ${
                errors.price && touched.price
                  ? 'border-rose-400 bg-rose-50/30 text-slate-900 focus:ring-2 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500'
              }`}
            />
          </div>
          {errors.price && touched.price ? (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.price}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Numerical acquisition price or catalog value.
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Status <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus('Available')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                status === 'Available'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Available</span>
            </button>
            <button
              type="button"
              onClick={() => setStatus('Issued')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                status === 'Issued'
                  ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Issued</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Indicates whether the book is on shelf or currently borrowed.
          </p>
        </div>

        {/* Shelf Location */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Rack / Shelf Location <span className="text-slate-400 font-normal text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            value={shelfLocation}
            onChange={(e) => setShelfLocation(e.target.value)}
            placeholder="e.g. Rack A-12, Section B"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        {mode === 'edit' && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}

        {mode === 'add' && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Form</span>
          </button>
        )}

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          {mode === 'add' ? (
            <>
              <BookPlus className="w-4 h-4" />
              <span>Add Book to Library</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
