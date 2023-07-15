import {Exercise} from "./exercise";
import {DayOfWeek} from "./base";

export interface Workout {
    name: string;
    daysOfWeek: DayOfWeek[];
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

