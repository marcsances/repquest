import {ExerciseSet, SetSide, SetType} from "../models/workout";

export const getLabelForSet = (set: ExerciseSet, useLbs: boolean, t: (key: string) => string) => {
    let label = "";
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

    if (set.rest) {
        label = label + " (" + t("rest") + " " + set.rest + " s)"
    }
    return label;
}
