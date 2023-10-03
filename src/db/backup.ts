import {DexieDB} from "./db";
import {OneRm} from "../utils/oneRm";

async function generateBackup(db: DexieDB, level: string) {
    const backupObject: Record<string, unknown> = {
        date: new Date().toJSON(),
        exercises: await db.exercise.toArray()
    };
    if (["workouts", "plans", "everything", "restoreBackup"].includes(level)) {
        backupObject.workouts = await db.workout.toArray();
        backupObject.exerciseSets = (await db.exerciseSet.toArray()).filter((it) => it.initial || it.id < 100);
        backupObject.workoutExercises = await db.workoutExercise.toArray();
    }
    if (["plans", "everything", "restoreBackup"].includes(level)) {
        backupObject.plans = await db.plan.toArray();
    }
    if (["everything", "restoreBackup"].includes(level)) {
        backupObject.users = await db.user.toArray();
        backupObject.workoutHistory = await db.workoutHistory.toArray();
        backupObject.userMetric = await db.userMetric.toArray();
        backupObject.settings = {
            showRpe: localStorage.getItem("showRpe"),
            showRir: localStorage.getItem("showRir"),
            weightUnit: localStorage.getItem("useLbs") ? "lbs" : "kg",
            wakeLock: localStorage.getItem("wakeLock"),
            oneRmFormula: localStorage.getItem("oneRm") ? OneRm[parseInt(localStorage.getItem("oneRem") || "0")] : null
        }
    }
    return backupObject;
}

export async function backupToJSON(db: DexieDB, level: string) {
    const backup = await generateBackup(db, level);
    const jsonObject = JSON.stringify(backup);
    const blob = new Blob([jsonObject], {type: "application/octet-stream"});
    return URL.createObjectURL(blob);
}
