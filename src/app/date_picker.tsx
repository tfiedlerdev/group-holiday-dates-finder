'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface DateRange {
  start: Date;
  end: Date;
  id: string;
}

export interface DatePickerProps {
  selectedRanges?: DateRange[];
  onRangesChange?: (ranges: DateRange[]) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DatePicker({
  selectedRanges = [],
  onRangesChange,
  minDate,
  maxDate,
  className = ''
}: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [tempRange, setTempRange] = useState<{ start: Date; end?: Date } | null>(null);
  const [ranges, setRanges] = useState<DateRange[]>(selectedRanges);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentDate]);

  // Check if a date is within any selected range
  const isDateInRange = useCallback((date: Date) => {
    return ranges.some(range => 
      date >= range.start && date <= range.end
    );
  }, [ranges]);

  // Check if a date is a range start or end
  const isRangeStart = useCallback((date: Date) => {
    return ranges.some(range => 
      date.getTime() === range.start.getTime()
    );
  }, [ranges]);

  const isRangeEnd = useCallback((date: Date) => {
    return ranges.some(range => 
      date.getTime() === range.end.getTime()
    );
  }, [ranges]);

  // Check if date is in temp range (currently being selected)
  const isDateInTempRange = useCallback((date: Date) => {
    if (!tempRange) return false;
    const start = tempRange.start;
    const end = tempRange.end || tempRange.start;
    const minDate = start < end ? start : end;
    const maxDate = start > end ? start : end;
    return date >= minDate && date <= maxDate;
  }, [tempRange]);

  // Check if date is disabled
  const isDateDisabled = useCallback((date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }, [minDate, maxDate]);

  // Handle date click/tap
  const handleDateClick = useCallback((date: Date) => {
    if (isDateDisabled(date)) return;

    if (!isSelecting) {
      // Start new range selection
      setIsSelecting(true);
      setTempRange({ start: date });
    } else {
      // Complete range selection
      if (tempRange) {
        const start = tempRange.start;
        const end = date;
        const newRange: DateRange = {
          start: start < end ? start : end,
          end: start > end ? start : end,
          id: `${Date.now()}-${Math.random()}`
        };

        const newRanges = [...ranges, newRange];
        setRanges(newRanges);
        onRangesChange?.(newRanges);
      }
      setIsSelecting(false);
      setTempRange(null);
    }
  }, [isSelecting, tempRange, ranges, onRangesChange, isDateDisabled]);

  // Handle date hover (for desktop)
  const handleDateHover = useCallback((date: Date) => {
    if (isSelecting && tempRange && !isDateDisabled(date)) {
      setTempRange({ ...tempRange, end: date });
    }
  }, [isSelecting, tempRange, isDateDisabled]);

  // Remove a selected range
  const removeRange = useCallback((rangeId: string) => {
    const newRanges = ranges.filter(range => range.id !== rangeId);
    setRanges(newRanges);
    onRangesChange?.(newRanges);
  }, [ranges, onRangesChange]);

  // Navigate months
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  // Cancel current selection
  const cancelSelection = useCallback(() => {
    setIsSelecting(false);
    setTempRange(null);
  }, []);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          type="button"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          type="button"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="aspect-square" />;
          }

          const isInRange = isDateInRange(date);
          const isInTempRange = isDateInTempRange(date);
          const isStart = isRangeStart(date);
          const isEnd = isRangeEnd(date);
          const isDisabled = isDateDisabled(date);
          const isToday = date.toDateString() === new Date().toDateString();

          let cellClasses = 'aspect-square flex items-center justify-center text-sm cursor-pointer transition-all duration-150 touch-manipulation select-none ';
          
          if (isDisabled) {
            cellClasses += 'text-gray-300 cursor-not-allowed ';
          } else if (isStart || isEnd) {
            cellClasses += 'bg-blue-600 text-white font-semibold rounded-lg ';
          } else if (isInRange || isInTempRange) {
            cellClasses += 'bg-blue-100 text-blue-800 ';
          } else if (isToday) {
            cellClasses += 'bg-gray-100 text-gray-900 font-semibold rounded-lg ';
          } else {
            cellClasses += 'text-gray-700 hover:bg-gray-50 rounded-lg ';
          }

          return (
            <button
              key={date.getTime()}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => handleDateHover(date)}
              disabled={isDisabled}
              className={cellClasses}
              type="button"
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Selection status */}
      {isSelecting && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {tempRange?.end 
                ? `${formatDate(tempRange.start)} - ${formatDate(tempRange.end)}`
                : `Starting: ${formatDate(tempRange!.start)}`
              }
            </span>
            <button
              onClick={cancelSelection}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              type="button"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {tempRange?.end ? 'Click to confirm selection' : 'Select end date'}
          </p>
        </div>
      )}

      {/* Selected ranges */}
      {ranges.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Selected Ranges:</h3>
          {ranges.map(range => (
            <div
              key={range.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
            >
              <span className="text-sm text-gray-700">
                {formatDate(range.start)} - {formatDate(range.end)}
              </span>
              <button
                onClick={() => removeRange(range.id)}
                className="text-gray-400 hover:text-red-600 transition-colors touch-manipulation"
                type="button"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
