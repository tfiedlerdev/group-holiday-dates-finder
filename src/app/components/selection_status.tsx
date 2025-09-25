import { XMarkIcon } from "@heroicons/react/24/outline";

export function SelectionStatus({
  tempRange,
  formatDate,
  cancelSelection,
}: {
  tempRange: { start: Date; end?: Date };
  formatDate: (date: Date) => string;
  cancelSelection: () => void;
}) {
  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <span className="text-sm text-blue-800">
          {tempRange?.end
            ? `${formatDate(tempRange.start)} - ${formatDate(tempRange.end)}`
            : `Starting: ${formatDate(tempRange!.start)}`}
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
        {tempRange?.end ? "Click to confirm selection" : "Select end date"}
      </p>
    </div>
  );
}
