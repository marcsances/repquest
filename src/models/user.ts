import {WorkoutRecord} from "./workout";

export interface User {
    name: string;
    metrics: UserMetric[];
    history: WorkoutRecord[];
}

export interface UserMetric {
    name: string;
    value: number;
}