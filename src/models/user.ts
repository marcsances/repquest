/*
    This file is part of WeightLog.

    WeightLog is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WeightLog is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WeightLog.  If not, see <https://www.gnu.org/licenses/>.
 */
import {OneRm} from "../utils/oneRm";

export enum FeatureSet {
    SIMPLE,
    ADVANCED
}

export interface User {
    name: string;
    picture?: string;
    pin?: number;
    showRpe?: boolean;
    showRir?: boolean;
    autostop?: boolean;
    useLbs?: boolean;
    sound?: boolean;
    oneRm?: OneRm;
    lang?: string;
    wakeLock?: boolean;
    emojis?: string[];
    refreshToken?: string;
    fullname?: string;
    featureSet: FeatureSet;
}

export enum Metric {
    BODYWEIGHT = "body_weight",
    HEIGHT = "height",
    BODYFAT = "body_fat",
    CHEST = "chest",
    LEFT_ARM = "left_arm",
    RIGHT_ARM = "right_arm",
    LEFT_THIGH = "left_thigh",
    RIGHT_THIGH = "right_thigh",
    WAIST = "waist",
    NECK = "neck",
    BMI = "bmi",
    HIP = "hip"
}

export interface UserMetric {
    id: number;
    metric: Metric;
    value: number;
    date: Date;
}
