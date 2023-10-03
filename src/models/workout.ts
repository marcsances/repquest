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
    workoutName: string;
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
    date: Date;
    setNumber: number;
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
}

export interface Plan {
    id: number;
    name: string;
    workoutIds: number[];
}

