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
  currentUsername,
  isInTempRange,
  selectedType,
  disabled,
  onHover,
  onClick,
  userRanges,
  otherUserRanges,
}: {
  date: Date;
  currentUsername: string;
  isInTempRange: boolean;
  selectedType: RangeType;
  disabled: boolean;
  onHover: () => void;
  onClick: () => void;
  userRanges: DateRangeWithoutDisplayLevel[];
  otherUserRanges: DateRange[];
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
  const isOtherUser = userRangeOfDate?.username !== currentUsername;

  let cellClasses =
    "aspect-square flex items-center justify-center text-sm cursor-pointer transition-all duration-150 touch-manipulation select-none relative ";

  if (disabled) {
    cellClasses += "text-gray-300 cursor-not-allowed ";
  } else if (!isOtherUser && (isStart || isEnd)) {
    if (userRangeOfDate?.type === "strict_no") {
      cellClasses += "bg-red-600 text-white font-semibold rounded-lg ";
    } else if (userRangeOfDate?.type === "rather_not") {
      cellClasses += "bg-yellow-500 text-white font-semibold rounded-lg ";
    } else if (userRangeOfDate?.type === "favorite") {
      cellClasses += "bg-green-600 text-white font-semibold rounded-lg ";
    }
  } else if (!isOtherUser && userRangeOfDate != null) {
    if (userRangeOfDate?.type === "strict_no") {
      cellClasses += "bg-red-100 text-red-800 ";
    } else if (userRangeOfDate?.type === "rather_not") {
      cellClasses += "bg-yellow-100 text-yellow-800 ";
    } else if (userRangeOfDate?.type === "favorite") {
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
      {isOtherUser && userRangeOfDate != null && (
        <div
          className={`pointer-events-none absolute inset-0 ${
            userRangeOfDate?.type === "strict_no"
              ? "bg-red-200/50"
              : userRangeOfDate?.type === "rather_not"
                ? "bg-yellow-200/50"
                : "bg-green-200/50"
          } ${isStart ? "rounded-l-lg" : ""} ${isEnd ? "rounded-r-lg" : ""}`}
        >
          {date.getTime() ===
            getMiddleDate(
              userRangeOfDate!.start,
              userRangeOfDate!.end,
            ).getTime() && (
            <span className="absolute -top-4 left-0 right-0 text-[8px] text-gray-400 text-center">
              {userRangeOfDate?.username}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
