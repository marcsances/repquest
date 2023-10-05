export enum ExerciseTag {
    WARMUP,
    CARDIO,
    MOBILITY,
    FLEXIBILITY,
    BODY_WEIGHT,
    FREE_WEIGHT,
    MACHINE,
    CABLE_MACHINE,
    CHEST,
    BICEPS,
    TRICEPS,
    FOREARM,
    SHOULDERS,
    TRAPS,
    LATS,
    LOWER_BACK,
    NECK,
    ABS,
    QUADS,
    HAMSTRINGS,
    CALVES,
    GLUTES,
    HIPS
}

export interface Exercise {
    id: number;
    name: string;
    picture?: string;
    yt_video?: string;
    tags: ExerciseTag[];
}
