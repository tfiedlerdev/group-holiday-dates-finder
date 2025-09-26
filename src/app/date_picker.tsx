"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { RangeTypeSelector } from "./components/range_type_selector";
import { RangeType } from "@prisma/client";
import { getRangesOfDate } from "./lib/dates";
import { SelectedRanges } from "./components/selected_ranges";
import { DateBox } from "./components/date_box";
import Tour from "@reactour/tour";

const steps = [
  {
    selector: ".range-type-selector",
    content: "Select the type of the range you want to add",
  },
  {
    selector: ".date-range-picker",
    content: "Select date ranges by clicking on the dates",
  },
];
export interface DateRangeWithoutDisplayLevel {
  start: Date;
  end: Date;
  id: string;
  type: RangeType;
  userName: string;
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
  currentUsername?: string;
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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DatePicker({
  userRanges,
  otherUserRanges,
  onUserRangesChange,
  minDate,
  maxDate,
  className = "",
  currentUsername,
}: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(minDate || new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [tempRange, setTempRange] = useState<{
    start: Date;
    end?: Date;
    type: RangeType;
  } | null>(null);

  const [selectedType, setSelectedType] = useState<RangeType>("rather_not");
  const maxDisplayLevel = useMemo(() => {
    return otherUserRanges.reduce((max, range) => {
      return Math.max(max, range.displayLevel ?? 0);
    }, 0);
  }, [otherUserRanges]);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [disabledActions, setDisabledActions] = useState(false);
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenDatePickerTour");
    if (!hasSeenTour && currentUsername) {
      setIsTourOpen(true);
      localStorage.setItem("hasSeenDatePickerTour", "true");
    }
  }, [currentUsername]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay();
    // Convert Sunday (0) to 6 for Monday-based week
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

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
      if (!tempRange || !tempRange.end)
        return date.getTime() === tempRange?.start.getTime();
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
      if (!currentUsername) return;
      if (getRangesOfDate(date, userRanges).length > 0) return;

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
          userName: currentUsername,
          displayLevel: null,
        };

        onUserRangesChange((prevRanges) => {
          const alreadyAdded = prevRanges.find((r) => r.id === newRange.id);
          if (alreadyAdded) {
            return prevRanges;
          }
          const newRanges = [...prevRanges, newRange];
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
      userRanges,
    ],
  );

  // Handle date hover (for desktop)
  const handleDateHover = useCallback(
    (date: Date) => {
      if (
        isSelecting &&
        tempRange &&
        !isDateDisabled(date) &&
        getRangesOfDate(date, userRanges).length === 0
      ) {
        setTempRange((prev) => (prev ? { ...prev, end: date } : null));
      }
    },
    [isSelecting, tempRange, isDateDisabled, userRanges],
  );

  // Remove a selected range
  const removeRange = useCallback(
    (rangeId: string) => {
      onUserRangesChange((prevRanges) => {
        const range = prevRanges.find((r) => r.id === rangeId);
        if (range?.userName !== currentUsername) return prevRanges; // Only allow removing own ranges

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

  const isPreviousMonthDisabled = useMemo(() => {
    if (!minDate) return false;

    const lastDayOfPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0,
    );
    return lastDayOfPreviousMonth < minDate;
  }, [currentDate, minDate]);

  const isNextMonthDisabled = useMemo(() => {
    if (!maxDate) return false;

    const firstDayOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    return firstDayOfNextMonth > maxDate;
  }, [currentDate, maxDate]);

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm mx-auto ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            disabled={isPreviousMonthDisabled}
            className={`p-2 rounded-lg transition-colors touch-manipulation ${
              isPreviousMonthDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            type="button"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={goToNextMonth}
            disabled={isNextMonthDisabled}
            className={`p-2 rounded-lg transition-colors touch-manipulation ${
              isNextMonthDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            type="button"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <RangeTypeSelector
          onlyLegend={currentUsername == null}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2 ">
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
        <div className="grid grid-cols-7 gap-1 mb-4 relative date-range-picker">
          {calendarDays.map((date, index) => {
            return date ? (
              <DateBox
                key={date.getTime()}
                date={date}
                isInTempRange={isDateInTempRange(date)}
                selectedType={selectedType}
                userRanges={userRanges}
                otherUserRanges={currentUsername ? [] : otherUserRanges}
                disabled={isDateDisabled(date) || !currentUsername}
                onHover={() => handleDateHover(date)}
                onClick={() => handleDateClick(date)}
                maxDisplayLevel={maxDisplayLevel}
              />
            ) : (
              <div className="aspect-square" key={index} />
            );
          })}
        </div>

        {/* Selected ranges */}
        <SelectedRanges
          ranges={userRanges}
          onRangeRemove={removeRange}
          currentUsername={currentUsername}
        />
      </div>
      {isTourOpen && (
        <Tour
          styles={{
            popover: (base) => ({
              ...base,
              color: "black",
            }),
          }}
          steps={steps}
          isOpen={isTourOpen}
          setIsOpen={setIsTourOpen}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          disabledActions={disabledActions}
          setDisabledActions={setDisabledActions}
        />
      )}
    </>
  );
}
