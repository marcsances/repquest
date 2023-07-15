import {WorkoutHistory} from "./workout";

export interface User {
    name: string;
    metricIds: number[];
    workoutHistoryIds: number[];
    workoutIds: number[];
}

export interface UserMetric {
    id: number;
    name: string;
    value: number;
}