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
import {DayOfWeek} from "./base";
import {Exercise} from "./exercise";

export interface Workout {
    id: number;
    name: string;
    daysOfWeek: DayOfWeek[];
    workoutExerciseIds: number[];
    deleted?: boolean;
    color?: string;
    synced?: Date;
    order?: number;
}

export interface WorkoutExercise {
    id: number;
    exerciseId: number;
    setIds: number[];
    initial: boolean;
    superset?: boolean;
    synced?: Date;
}

export interface WorkoutExerciseListEntry {
    position: number;
    exercise: Exercise;
}

export enum SetType {
    STANDARD,
    WARMUP,
    DROPSET,
    FAILURE
}

export enum SetSide {
    BOTH,
    LEFT,
    RIGHT
}

export interface ExerciseSet {
    id: number;
    exerciseId: number;
    date?: Date;
    setNumber?: number;
    type: SetType;
    weight?: number;
    reps?: number;
    time?: number;
    distance?: number;
    laps?: number;
    rpe?: number;
    rir?: number;
    rest?: number;
    cues?: string;
    initial?: boolean;
    side?: SetSide;
    notes?: string;
    emoji?: string;
    synced?: Date;
}

export interface Plan {
    id: number;
    name: string;
    workoutIds: number[];
    deleted?: boolean;
    synced?: boolean;
}

