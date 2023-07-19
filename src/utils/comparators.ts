import {ExerciseSet} from "../models/workout";

export const compareSetHistoryEntries = (set1: ExerciseSet, set2: ExerciseSet) => {
    // sort by day descending and by set number ascending
    const day1 = Math.floor(set1.date.getTime() / (1000 * 3600 * 24));
    const day2 = Math.floor(set2.date.getTime() / (1000 * 3600 * 24));
    if (day1 < day2) {
        return 1;
    }
    if (day2 < day1) {
        return -1;
    }
    if (set1.setNumber < set2.setNumber) {
        return -1;
    }
    if (set2.setNumber < set1.setNumber) {
        return 1;
    }
    return 0;
}
