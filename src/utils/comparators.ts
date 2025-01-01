/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
import {ExerciseSet} from "../models/workout";
import {Exercise} from "../models/exercise";

export const compareWithDate = <T extends {date: Date}>(v1: T, v2: T) => {
    const day1 = Math.floor(v1.date.getTime() / (1000 * 3600 * 24));
    const day2 = Math.floor(v2.date.getTime() / (1000 * 3600 * 24));
    return Math.sign(day1 - day2);
}

export const compareSetHistoryEntries = (set1: ExerciseSet, set2: ExerciseSet) => {
    if (!set1.date || !set2.date) return set1.id - set2.id;
    // sort by day descending and by set number ascending
    const day1 = Math.floor(set1.date.getTime() / (1000 * 3600 * 24));
    const day2 = Math.floor(set2.date.getTime() / (1000 * 3600 * 24));
    if (day1 < day2) {
        return 1;
    }
    if (day2 < day1) {
        return -1;
    }
    if (set1.setNumber && set2.setNumber && set1.setNumber < set2.setNumber) {
        return -1;
    }
    if (set2.setNumber && set1.setNumber && set2.setNumber < set1.setNumber) {
        return 1;
    }
    return 0;
}

export const compareExercises = (exercise1: Exercise, exercise2: Exercise) => {
    return exercise1.name.localeCompare(exercise2.name);
}

export const isSameDay = (date1: Date, date2: Date) => {
    const day1 = Math.floor(date1.getTime() / (1000 * 3600 * 24));
    const day2 = Math.floor(date2.getTime() / (1000 * 3600 * 24));
    return day1 === day2;
}
