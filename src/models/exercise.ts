/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
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
    deleted?: boolean;
    synced?: Date;
}
