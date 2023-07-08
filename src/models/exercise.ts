export enum ExerciseType {
    WEIGHTED,
    UNWEIGHTED,
    TIMED
}

export interface Exercise {
    name: string;
    type: ExerciseType;
    picture?: string;
    yt_video?: string;
    description?: string;
    substitutions: Exercise[];
}