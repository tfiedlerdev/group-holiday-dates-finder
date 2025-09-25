'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { RangeType, RangeTypeSelector } from './components/range_type_selector';


export interface DateRange {
  start: Date;
  end: Date;
  id: string;
  type: RangeType;
  username: string;
}

export interface DatePickerProps {
  selectedRanges?: DateRange[];
  onRangesChange?: (ranges: DateRange[]) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  currentUsername?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CURRENT_USER = 'current_user'; // Hardcoded username for demo

export default function DatePicker({
  selectedRanges = [],
  onRangesChange,
  minDate,
  maxDate,
  className = '',
  currentUsername = CURRENT_USER
}: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [tempRange, setTempRange] = useState<{ start: Date; end?: Date; type: RangeType } | null>(null);
  const [ranges, setRanges] = useState<DateRange[]>(selectedRanges);

  useEffect(() => {
    console.log('ranges', ranges);
  }, [ranges]);

  const [selectedType, setSelectedType] = useState<RangeType>('rather_not');

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

  // Check if a date is within any selected range and get range details
  const getDateRangeInfo = useCallback((date: Date): { isInRange: boolean; range?: DateRange } => {
    for (const range of ranges) {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);
      if (date >= rangeStart && date <= rangeEnd) {
        return { isInRange: true, range };
      }
    }
    return { isInRange: false };
  }, [ranges]);

  // Check if a date is a range start or end
  const isRangeStart = useCallback((date: Date) => {
    return ranges.some(range => 
      date.getTime() === new Date(range.start).getTime()
    );
  }, [ranges]);

  const isRangeEnd = useCallback((date: Date) => {
    return ranges.some(range => 
      date.getTime() === new Date(range.end).getTime()
    );
  }, [ranges]);

  // Check if date is in temp range (currently being selected)
  const isDateInTempRange = useCallback((date: Date) => {
    if (!tempRange || !tempRange.end) return false;
    const start = new Date(tempRange.start);
    const end = new Date(tempRange.end);
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
      setTempRange({ start: date, type: selectedType });
    } else if (tempRange) {
      // Complete range selection
      const start = new Date(tempRange.start);
      const end = new Date(date);
      const newRange: DateRange = {
        start: start < end ? start : end,
        end: start > end ? start : end,
        id: `${Date.now()}-${Math.random()}`,
        type: selectedType,
        username: currentUsername
      };

      setRanges(prevRanges => {
        const newRanges = [...prevRanges, newRange];
        onRangesChange?.(newRanges);
        return newRanges;
      });
      
      setIsSelecting(false);
      setTempRange(null);
    }
  }, [isSelecting, tempRange, onRangesChange, isDateDisabled, selectedType, currentUsername]);

  // Handle date hover (for desktop)
  const handleDateHover = useCallback((date: Date) => {
    if (isSelecting && tempRange && !isDateDisabled(date)) {
      setTempRange(prev => prev ? { ...prev, end: date } : null);
    }
  }, [isSelecting, tempRange, isDateDisabled]);

  // Remove a selected range
  const removeRange = useCallback((rangeId: string) => {
    
    
    setRanges(prevRanges => {
      const range = prevRanges.find(r => r.id === rangeId);
    if (range?.username !== currentUsername) return prevRanges; // Only allow removing own ranges

      const newRanges = prevRanges.filter(range => range.id !== rangeId);
      onRangesChange?.(newRanges);
      return newRanges;
    });
  }, [onRangesChange, currentUsername]);

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

     <RangeTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} />

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

          const { isInRange, range } = getDateRangeInfo(date);
          const isInTempRange = isDateInTempRange(date);
          const isStart = isRangeStart(date);
          const isEnd = isRangeEnd(date);
          const isDisabled = isDateDisabled(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isOtherUser = range?.username !== currentUsername;

          let cellClasses = 'aspect-square flex items-center justify-center text-sm cursor-pointer transition-all duration-150 touch-manipulation select-none relative ';
          
          if (isDisabled) {
            cellClasses += 'text-gray-300 cursor-not-allowed ';
          } else if (!isOtherUser && (isStart || isEnd)) {
            if (range?.type === 'strict_no') {
              cellClasses += 'bg-red-600 text-white font-semibold rounded-lg ';
            } else if (range?.type === 'rather_not') {
              cellClasses += 'bg-yellow-500 text-white font-semibold rounded-lg ';
            } else if (range?.type === 'favorite') {
              cellClasses += 'bg-green-600 text-white font-semibold rounded-lg ';
            }
          } else if (!isOtherUser && isInRange) {
            if (range?.type === 'strict_no') {
              cellClasses += 'bg-red-100 text-red-800 ';
            } else if (range?.type === 'rather_not') {
              cellClasses += 'bg-yellow-100 text-yellow-800 ';
            } else if (range?.type === 'favorite') {
              cellClasses += 'bg-green-100 text-green-800 ';
            }
          } else if (isInTempRange) {
            if (selectedType === 'strict_no') {
              cellClasses += 'bg-red-100 text-red-800 ';
            } else if (selectedType === 'rather_not') {
              cellClasses += 'bg-yellow-100 text-yellow-800 ';
            } else if (selectedType === 'favorite') {
              cellClasses += 'bg-green-100 text-green-800 ';
            }
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
              {isOtherUser && isInRange && (
                <div 
                  className={`absolute bottom-0 left-0 right-0 h-1 ${
                    range?.type === 'strict_no' 
                      ? 'bg-red-200' 
                      : range?.type === 'rather_not'
                      ? 'bg-yellow-200'
                      : 'bg-green-200'
                  }`}
                >
                  <span className="absolute -top-4 left-0 right-0 text-[8px] text-gray-400 text-center">
                    {range?.username}
                  </span>
                </div>
              )}
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
      {ranges.filter(r => r.username === currentUsername).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Your Selected Ranges:</h3>
          {ranges.filter(r => r.username === currentUsername).map(range => {
            let rangeClasses = 'flex items-center justify-between p-2 rounded-lg border ';
            if (range.type === 'strict_no') {
              rangeClasses += 'bg-red-50 border-red-200';
            } else if (range.type === 'rather_not') {
              rangeClasses += 'bg-yellow-50 border-yellow-200';
            } else if (range.type === 'favorite') {
              rangeClasses += 'bg-green-50 border-green-200';
            }

            return (
              <div
                key={range.id}
                className={rangeClasses}
              >
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700">
                    {formatDate(range.start)} - {formatDate(range.end)}
                  </span>
                </div>
                <button
                  onClick={() => removeRange(range.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors touch-manipulation"
                  type="button"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
