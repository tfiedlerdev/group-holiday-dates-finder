import { useMemo } from "react";
import { DateRange, DateRangeWithoutDisplayLevel } from "../date_picker";
import { RangeType } from "./range_type_selector";
import { getRangesOfDate } from "../lib/dates";
const getMiddleDate = (start: Date, end: Date) => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const middleDays = Math.floor(diffDays / 2);
  return new Date(start.getTime() + middleDays * 24 * 60 * 60 * 1000);
};

// Check if a date is a range start or end
const isRangeStart = (date: Date, range: DateRangeWithoutDisplayLevel) => {
  return date.getTime() === new Date(range.start).getTime();
};

const isRangeEnd = (date: Date, range: DateRangeWithoutDisplayLevel) => {
  return date.getTime() === new Date(range.end).getTime();
};

export function DateBox({
  date,
  isInTempRange,
  selectedType,
  disabled,
  onHover,
  onClick,
  userRanges,
  otherUserRanges,
  maxDisplayLevel,
}: {
  date: Date;
  isInTempRange: boolean;
  selectedType: RangeType;
  disabled: boolean;
  onHover: () => void;
  onClick: () => void;
  userRanges: DateRangeWithoutDisplayLevel[];
  otherUserRanges: DateRange[];
  maxDisplayLevel: number;
}) {
  const userRangeOfDate = useMemo(() => {
    const range = getRangesOfDate(date, userRanges)[0];
    return range ? range : null;
  }, [userRanges, date]);
  const otherUserRangesOfDate = useMemo(
    () => getRangesOfDate(date, otherUserRanges),
    [otherUserRanges, date],
  );

  const isStart = userRangeOfDate ? isRangeStart(date, userRangeOfDate) : false;
  const isEnd = userRangeOfDate ? isRangeEnd(date, userRangeOfDate) : false;
  const isToday = date.toDateString() === new Date().toDateString();

  let cellClasses =
    "aspect-square flex items-center justify-center text-sm cursor-pointer transition-all duration-150 touch-manipulation select-none relative ";

  if (disabled) {
    cellClasses += "text-gray-300 cursor-not-allowed ";
  } else if (isStart || isEnd) {
    if (userRangeOfDate?.type === "strict_no") {
      cellClasses += "bg-red-600 text-white font-semibold rounded-lg ";
    } else if (userRangeOfDate?.type === "rather_not") {
      cellClasses += "bg-yellow-500 text-white font-semibold rounded-lg ";
    } else if (userRangeOfDate?.type === "favorite") {
      cellClasses += "bg-green-600 text-white font-semibold rounded-lg ";
    }
  } else if (userRangeOfDate) {
    if (userRangeOfDate.type === "strict_no") {
      cellClasses += "bg-red-100 text-red-800 ";
    } else if (userRangeOfDate.type === "rather_not") {
      cellClasses += "bg-yellow-100 text-yellow-800 ";
    } else if (userRangeOfDate.type === "favorite") {
      cellClasses += "bg-green-100 text-green-800 ";
    }
  } else if (isInTempRange) {
    if (selectedType === "strict_no") {
      cellClasses += "bg-red-100 text-red-800 ";
    } else if (selectedType === "rather_not") {
      cellClasses += "bg-yellow-100 text-yellow-800 ";
    } else if (selectedType === "favorite") {
      cellClasses += "bg-green-100 text-green-800 ";
    }
  } else if (isToday) {
    cellClasses += "bg-gray-100 text-gray-900 font-semibold rounded-lg ";
  } else {
    cellClasses += "text-gray-700 hover:bg-gray-50 rounded-lg ";
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      disabled={disabled}
      className={cellClasses}
      type="button"
    >
      {date.getDate()}
      {otherUserRangesOfDate.map((range) => {
        const isRangeStart = date.getTime() === range.start.getTime();
        const isRangeEnd = date.getTime() === range.end.getTime();

        let barClasses = "absolute left-0 right-0 opacity-40 ";

        if (range.type === "strict_no") {
          barClasses += "bg-red-600 ";
        } else if (range.type === "rather_not") {
          barClasses += "bg-yellow-500 ";
        } else if (range.type === "favorite") {
          barClasses += "bg-green-600 ";
        }

        if (isRangeStart) {
          barClasses += "rounded-l ";
        }
        if (isRangeEnd) {
          barClasses += "rounded-r ";
        }
        const _maxDisplayLevel = Math.max(maxDisplayLevel, 2);

        return (
          <div
            key={range.id}
            className={barClasses}
            style={{
              top: `${((range.displayLevel || 0) / (_maxDisplayLevel + 1)) * 100}%`,
              height: `${100 / (_maxDisplayLevel + 1)}%`,
              zIndex: _maxDisplayLevel - (range.displayLevel || 0),
            }}
          >
            {date.getTime() ===
              getMiddleDate(range.start, range.end).getTime() && (
              <span className="text-[10px] font-medium text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                {range.username}
              </span>
            )}
          </div>
        );
      })}
    </button>
  );
}
