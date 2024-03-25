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
import {ExerciseSet, SetSide, SetType} from "../models/workout";

export const getLabelForSet = (set: ExerciseSet, useLbs: boolean, t: (key: string) => string, showRest = true) => {
    let label = set.emoji || "";
    if (set.weight) {
        label = set.weight.toString() + (useLbs ? "lbs" : "kg");
    }
    if (set.reps && label === "") {
        label = set.reps.toString();
    } else if (set.reps) {
        label = label + " x " + set.reps.toString();
    }
    if (set.time && label === "") {
        label = set.time.toString() + " min";
    }
    if (set.laps && label === "") {
        label = set.laps.toString() + t("laps");
    }
    if (set.distance && label === "") {
        label = set.distance.toString() + " m";
    }

    if (set.type === SetType.WARMUP) {
        label = label + " (" + t("warmup") + ")";
    } else if (set.type === SetType.FAILURE) {
        label = label  + " (" + t("failure") + ")";
    } else if (set.type === SetType.DROPSET) {
        label = label + " (" + t("dropSet") + ")";
    }

    if (set.side === SetSide.LEFT) {
        label = label + "L";
    } else if (set.side === SetSide.RIGHT) {
        label = label + "R";
    }

    if (set.rest && showRest) {
        label = label + " (" + t("rest") + " " + set.rest + " s)"
    }
    return label;
}
