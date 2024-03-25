/*
    This file is part of WeightLog.

    WeightLog is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WeightLog is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WeightLog.  If not, see <https://www.gnu.org/licenses/>.
 */
import {DayOfWeek} from "./base";

export interface Workout {
    id: number;
    name: string;
    daysOfWeek: DayOfWeek[];
    workoutExerciseIds: number[];
    deleted?: boolean;
    color?: string;
}

export interface WorkoutHistory {
    id: number;
    userName: string;
    workoutName: string;
    date: Date;
    workoutExerciseIds: number[];
}

export interface WorkoutExercise {
    id: number;
    exerciseId: number;
    setIds: number[];
    initial: boolean;
    superset?: boolean;
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
}

export interface Plan {
    id: number;
    name: string;
    workoutIds: number[];
    deleted?: boolean;
}

