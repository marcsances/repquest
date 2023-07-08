import {Exercise} from "./exercise";

export interface Workout {
    name: string;
    exercises: WorkoutExercise[];
}

export interface WorkoutRecord {
    date: Date;
    workout: Workout;
}

export interface WorkoutExercise {
    sets: ExerciseSet[];
    superset: boolean;
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
    exercise: Exercise;
    type: SetType;
    weight?: number;
    reps_time: number;
    rpe?: number;
    rir?: number;
    rest?: number;
    cues?: string;
}

