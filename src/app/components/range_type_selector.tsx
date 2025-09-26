import { RangeType } from "@prisma/client";

export function RangeTypeSelector({
  selectedType,
  setSelectedType,
  onlyLegend,
}: {
  selectedType: RangeType;
  setSelectedType: (type: RangeType) => void;
  onlyLegend?: boolean;
}) {
  return (
    <div className="flex gap-2 mb-4">
      {onlyLegend ? (
        <>
          <div className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 border border-red-200">
            Strict No
          </div>
          <div className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 border border-yellow-200">
            Rather Not
          </div>
          <div className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
            Favorite
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedType("strict_no")}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedType === "strict_no"
                ? "border-3 border-red-600 text-red-800"
                : "border border-red-100 text-red-800"
            }`}
            type="button"
          >
            Strict No
          </button>
          <button
            onClick={() => setSelectedType("rather_not")}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedType === "rather_not"
                ? "border-3 border-yellow-500 text-yellow-800"
                : "border border-yellow-100 text-yellow-800"
            }`}
            type="button"
          >
            Rather Not
          </button>
          <button
            onClick={() => setSelectedType("favorite")}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedType === "favorite"
                ? "border-3 border-green-600 text-green-800"
                : "border border-green-100 text-green-800"
            }`}
            type="button"
          >
            Favorite
          </button>
        </>
      )}
    </div>
  );
}
