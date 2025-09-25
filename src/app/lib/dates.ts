import { DateRangeWithoutDisplayLevel } from "../date_picker";

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMinMaxDate = (ranges: DateRangeWithoutDisplayLevel[]) => ({
    minDate: ranges.reduce((min, range) => range.start < min.start ? range : min, ranges[0]).start,
    maxDate: ranges.reduce((max, range) => range.end > max.end ? range : max, ranges[0]).end
  });



  export const addDisplayLevel = (ranges: (DateRangeWithoutDisplayLevel)[]) => {
    type Level = (string | null)[]
    const { minDate, maxDate } = getMinMaxDate(ranges);
    const dayMs = 1000 * 60 * 60 * 24;
    const getEmptyLevel = ()=>Array(Math.ceil((maxDate.getTime() - minDate.getTime()) / dayMs)).fill(null)
    const getLevelIndexForDate = (date: Date) => Math.floor((date.getTime() - minDate.getTime()) / dayMs)

    const rangeIdToLevel: { [key: string]: number } = {}
    const addRangeToLevel = (range: DateRangeWithoutDisplayLevel, levelIndex: number, level:Level
    ) => {
        for (let i = getLevelIndexForDate(range.start); i <= getLevelIndexForDate(range.end); i++){
            level[i] = range.id
        }
        rangeIdToLevel[range.id] = levelIndex
    }
    const initializeLevels = () =>{
        const levels = [getEmptyLevel()]
        for(const range of ranges){
            if (range.displayLevel==null){
                continue;
            }
            while(range.displayLevel>=levels.length){
                levels.push(getEmptyLevel())
            }

            addRangeToLevel(range,range.displayLevel, levels[range.displayLevel])
            rangeIdToLevel[range.id] = range.displayLevel
        }
        return levels as Level[]
    }
    const levels = initializeLevels()
    
    const doesRangeFit = (range: DateRangeWithoutDisplayLevel, level: Level) => {
        for (let i = getLevelIndexForDate(range.start); i <= getLevelIndexForDate(range.end); i++){
            if (level[i] !== null) return false
        }
        return true
    }
    
    for (const range of ranges){
        if (range.displayLevel!=null){
            continue;
        }
        let added = false
        for (let levelIndex = 0; levelIndex < levels.length; levelIndex++){
            if (doesRangeFit(range, levels[levelIndex])){

                addRangeToLevel(range,levelIndex, levels[levelIndex]);
                added = true
                break
            }
        }
        if (!added){

            levels.push(getEmptyLevel())
            addRangeToLevel(range,levels.length - 1, levels[levels.length - 1])
        }
    }
    return ranges.map((range) => ({
        ...range,
        displayLevel: rangeIdToLevel[range.id]
    }))

    }


  export const  getRangesOfDate = (
    date: Date,
    ranges: DateRangeWithoutDisplayLevel[],
  ) => {
    return ranges.filter((range) => date >= range.start && date <= range.end);
  };