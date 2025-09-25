"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  SetStateAction,
  Dispatch,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { RangeType, RangeTypeSelector } from "./components/range_type_selector";
import { SelectionStatus } from "./components/selection_status";
import { addDisplayLevel, formatDate } from "./lib/dates";
import { SelectedRanges } from "./components/selected_ranges";
import { DateBox } from "./components/date_box";

export interface DateRangeWithoutDisplayLevel {
  start: Date;
  end: Date;
  id: string;
  type: RangeType;
  username: string;
  displayLevel: number | null;
}

export type DateRange = DateRangeWithoutDisplayLevel & {
  displayLevel: number;
};

export interface DatePickerProps {
  userRanges: DateRangeWithoutDisplayLevel[];
  otherUserRanges: DateRange[];
  onUserRangesChange: Dispatch<SetStateAction<DateRangeWithoutDisplayLevel[]>>;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  currentUsername: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DatePicker({
  userRanges,
  otherUserRanges,
  onUserRangesChange,
  minDate,
  maxDate,
  className = "",
  currentUsername,
}: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [tempRange, setTempRange] = useState<{
    start: Date;
    end?: Date;
    type: RangeType;
  } | null>(null);

  const [selectedType, setSelectedType] = useState<RangeType>("rather_not");

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

  // Check if date is in temp range (currently being selected)
  const isDateInTempRange = useCallback(
    (date: Date) => {
      if (!tempRange || !tempRange.end) return false;
      const start = new Date(tempRange.start);
      const end = new Date(tempRange.end);
      const minDate = start < end ? start : end;
      const maxDate = start > end ? start : end;
      return date >= minDate && date <= maxDate;
    },
    [tempRange],
  );

  // Check if date is disabled
  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [minDate, maxDate],
  );

  // Handle date click/tap
  const handleDateClick = useCallback(
    (date: Date) => {
      if (isDateDisabled(date)) return;

      if (!isSelecting) {
        // Start new range selection
        setIsSelecting(true);
        setTempRange({ start: date, type: selectedType });
      } else if (tempRange) {
        // Complete range selection
        const start = new Date(tempRange.start);
        const end = new Date(date);
        const newRange: DateRangeWithoutDisplayLevel = {
          start: start < end ? start : end,
          end: start > end ? start : end,
          id: `${Date.now()}-${Math.random()}`,
          type: selectedType,
          username: currentUsername,
          displayLevel: null,
        };

        onUserRangesChange((prevRanges) => {
          const alreadyAdded = prevRanges.find((r) => r.id === newRange.id);
          if (alreadyAdded) {
            return prevRanges;
          }
          const newRanges = addDisplayLevel([...prevRanges, newRange]);
          onUserRangesChange(newRanges);
          return newRanges;
        });

        setIsSelecting(false);
        setTempRange(null);
      }
    },
    [
      isSelecting,
      tempRange,
      onUserRangesChange,
      isDateDisabled,
      selectedType,
      currentUsername,
    ],
  );

  // Handle date hover (for desktop)
  const handleDateHover = useCallback(
    (date: Date) => {
      if (isSelecting && tempRange && !isDateDisabled(date)) {
        setTempRange((prev) => (prev ? { ...prev, end: date } : null));
      }
    },
    [isSelecting, tempRange, isDateDisabled],
  );

  // Remove a selected range
  const removeRange = useCallback(
    (rangeId: string) => {
      onUserRangesChange((prevRanges) => {
        const range = prevRanges.find((r) => r.id === rangeId);
        if (range?.username !== currentUsername) return prevRanges; // Only allow removing own ranges

        const newRanges = prevRanges.filter((range) => range.id !== rangeId);
        onUserRangesChange(newRanges);
        return newRanges;
      });
    },
    [onUserRangesChange, currentUsername],
  );

  // Navigate months
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  }, []);

  // Cancel current selection
  const cancelSelection = useCallback(() => {
    setIsSelecting(false);
    setTempRange(null);
  }, []);

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm mx-auto ${className}`}
    >
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

      <RangeTypeSelector
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4 relative">
        {calendarDays.map((date, index) => {
          return date ? (
            <DateBox
              key={date.getTime()}
              date={date}
              currentUsername={currentUsername}
              isInTempRange={isDateInTempRange(date)}
              selectedType={selectedType}
              userRanges={userRanges}
              otherUserRanges={otherUserRanges}
              disabled={isDateDisabled(date)}
              onHover={() => handleDateHover(date)}
              onClick={() => handleDateClick(date)}
            />
          ) : (
            <div className="aspect-square" key={index} />
          );
        })}
      </div>

      {/* Selection status */}
      {isSelecting && tempRange && (
        <SelectionStatus
          tempRange={tempRange}
          formatDate={formatDate}
          cancelSelection={cancelSelection}
        />
      )}

      {/* Selected ranges */}
      <SelectedRanges
        ranges={userRanges}
        onRangeRemove={removeRange}
        currentUsername={currentUsername}
      />
    </div>
  );
}
