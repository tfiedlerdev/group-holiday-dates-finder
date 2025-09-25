export type RangeType = 'strict_no' | 'rather_not' | 'favorite';

export function RangeTypeSelector({ selectedType, setSelectedType }: { selectedType: RangeType, setSelectedType: (type: RangeType) => void }) {
    return  (
        
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setSelectedType('strict_no')}
        className={`px-3 py-1 rounded-full text-sm ${
          selectedType === 'strict_no' 
            ? 'bg-red-600 text-white' 
            : 'bg-red-100 text-red-800'
        }`}
        type="button"
      >
        Strict No
      </button>
      <button
        onClick={() => setSelectedType('rather_not')}
        className={`px-3 py-1 rounded-full text-sm ${
          selectedType === 'rather_not'
            ? 'bg-yellow-500 text-white'
            : 'bg-yellow-100 text-yellow-800'
        }`}
        type="button"
      >
        Rather Not
      </button>
      <button
        onClick={() => setSelectedType('favorite')}
        className={`px-3 py-1 rounded-full text-sm ${
          selectedType === 'favorite'
            ? 'bg-green-600 text-white'
            : 'bg-green-100 text-green-800'
        }`}
        type="button"
      >
        Favorite
      </button>
    </div>
    )
}