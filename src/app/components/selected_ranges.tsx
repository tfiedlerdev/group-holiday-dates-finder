import { XMarkIcon } from "@heroicons/react/24/outline";
import { DateRangeWithoutDisplayLevel } from "../date_picker";
import { formatDate } from "../lib/dates";

export function SelectedRanges({
  ranges,
  onRangeRemove,
  currentUsername,
}: {
  ranges: DateRangeWithoutDisplayLevel[];
  onRangeRemove: (rangeId: string) => void;
  currentUsername?: string;
}) {
  return (
    <>
      (
      {ranges.filter((r) => r.username === currentUsername).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            Your Selected Ranges:
          </h3>
          {ranges
            .filter((r) => r.username === currentUsername)
            .map((range) => {
              let rangeClasses =
                "flex items-center justify-between p-2 rounded-lg border ";
              if (range.type === "strict_no") {
                rangeClasses += "bg-red-50 border-red-200";
              } else if (range.type === "rather_not") {
                rangeClasses += "bg-yellow-50 border-yellow-200";
              } else if (range.type === "favorite") {
                rangeClasses += "bg-green-50 border-green-200";
              }

              return (
                <div key={range.id} className={rangeClasses}>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700">
                      {formatDate(range.start)} - {formatDate(range.end)}
                    </span>
                  </div>
                  <button
                    onClick={() => onRangeRemove(range.id)}
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
      )
    </>
  );
}
