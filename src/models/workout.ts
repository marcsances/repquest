import {DayOfWeek} from "./base";

export interface Workout {
    id: number;
    name: string;
    daysOfWeek: DayOfWeek[];
    workoutExerciseIds: number[];
}

export interface WorkoutHistory {
    id: number;
    userName: string;
    date: Date;
    workoutExerciseIds: number[];
}

export interface WorkoutExercise {
    id: number;
    exerciseId: number;
    setIds: number[];
}

export enum SetType {
    STANDARD,
    WARMUP,
    DROPSET,
    DROPUP,
    PYRAMID,
    FAILURE
}

export interface ExerciseSet {
    id: number;
    exerciseId: number;
    date: Date;
    setNumber: number;
    type: SetType;
    weight?: number;
    reps?: number;
    time?: number;
    rpe?: number;
    rir?: number;
    rest?: number;
    cues?: string;
    initial?: boolean;
}

