export interface User {
    name: string;
    metricIds: number[];
    workoutIds: number[];
}

export interface UserMetric {
    id: number;
    name: string;
    value: number;
}