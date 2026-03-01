'use client';

import { useState, useRef, useEffect } from 'react';
import {
  HiOutlineCalendar,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DatePicker({
  value,
  onChange,
  disabled,
  placeholder = 'Select date',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    return new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = selected.toISOString().split('T')[0];
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const selectedDate = value ? new Date(value) : null;

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-1 rounded border-gray-300 bg-gray-300 px-2 py-1 text-xs text-gray-900 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <HiOutlineCalendar className="text-gray-500" />
        <span>{value ? formatDisplayDate(value) : placeholder}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-1 w-64 rounded-lg border border-gray-300 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <HiChevronLeft className="text-gray-700 dark:text-gray-400" />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <HiChevronRight className="text-gray-700 dark:text-gray-400" />
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={i} className="aspect-square">
                {day && (
                  <button
                    type="button"
                    onClick={() => handleSelectDate(day)}
                    className={`h-full w-full rounded text-xs transition-colors ${
                      selectedDate &&
                      selectedDate.getFullYear() === year &&
                      selectedDate.getMonth() === month &&
                      selectedDate.getDate() === day
                        ? 'bg-yellow-500 font-medium text-gray-900 dark:bg-yellow-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 w-full rounded bg-white py-1 text-xs text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
