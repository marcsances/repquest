import {DexieDB} from "./db";
import {OneRm} from "../utils/oneRm";
import {ExerciseSet, Plan, Workout, WorkoutExercise, WorkoutHistory} from "../models/workout";
import {User, UserMetric} from "../models/user";
import {Exercise} from "../models/exercise";
import getId from "../utils/id";

export interface BackupObject {
    date: string;
    exercises: Exercise[];
    workouts?: Workout[];
    exerciseSets?: ExerciseSet[];
    workoutExercises?: WorkoutExercise[];
    plans?: Plan[];
    users?: User[];
    workoutHistory?: WorkoutHistory[];
    userMetric?: UserMetric[];
    settings?: Record<string, string | undefined>;
}

async function generateBackup(db: DexieDB, level: string) {
    const backupObject: BackupObject = {
        date: new Date().toJSON(),
        exercises: await db.exercise.toArray()
    };
    if (["workouts", "plans", "everything", "restoreBackup"].includes(level)) {
        backupObject.workouts = await db.workout.toArray();
        backupObject.exerciseSets = await db.exerciseSet.toArray();
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
            showRpe: localStorage.getItem("showRpe") || undefined,
            showRir: localStorage.getItem("showRir") || undefined,
            weightUnit: localStorage.getItem("useLbs") === "true" ? "lbs" : "kg",
            wakeLock: localStorage.getItem("wakeLock") || undefined,
            oneRmFormula: localStorage.getItem("oneRm") ? OneRm[parseInt(localStorage.getItem("oneRm") || "0")] : undefined
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

export function importFromJSON(db: DexieDB, level: string, payload: BackupObject): Promise<void> {
    return new Promise((resolve, reject) => {
        db.transaction("rw", [db.exercise, db.exerciseSet, db.workout, db.workoutExercise, db.plan, db.user, db.userMetric, db.workoutHistory], (trans) => {
            (async () => {
                if (level === "restoreBackup") {
                    await trans.db.table("exercise").clear();
                    await trans.db.table("exerciseSet").clear();
                    await trans.db.table("workout").clear();
                    await trans.db.table("workoutExercise").clear();
                    await trans.db.table("plan").clear();
                    await trans.db.table("user").clear();
                    await trans.db.table("userMetric").clear();
                    await trans.db.table("workoutHistory").clear();
                    await localStorage.clear();
                }
                const exerciseIds: Record<number, number> = {};
                for (const exercise of payload.exercises) {
                    const maybeExercise = await db.table("exercise").get({name: exercise.name});
                    const id = maybeExercise ? maybeExercise.id : getId();
                    exerciseIds[exercise.id] = id;
                    await trans.db.table("exercise").put({
                        ...exercise,
                        id
                    });
                }
                if (["workouts", "plans", "everything", "restoreBackup"].includes(level) && payload.workoutExercises && payload.exerciseSets && payload.workouts && payload.plans) {
                    const setIds: Record<number, number> = {};
                    for (const set of payload.exerciseSets) {
                        const id = getId();
                        setIds[set.id] = id;
                        await trans.db.table("exerciseSet").put({
                            ...set,
                            id,
                            exerciseId: exerciseIds[set.id]
                        });
                    }
                    const workoutExerciseIds: Record<number, number> = {};
                    for (const workoutExercise of payload.workoutExercises) {
                        const id = getId();
                        workoutExerciseIds[workoutExercise.id] = id;
                        await trans.db.table("workoutExercise").put({
                            ...workoutExercise,
                            id,
                            exerciseId: exerciseIds[workoutExercise.exerciseId],
                            setIds: workoutExercise.setIds.map((it) => setIds[it])
                        })
                    }
                    const workoutIds: Record<number, number> = {};
                    for (const workout of payload.workouts) {
                        const id = getId();
                        workoutIds[workout.id] = id;
                        await trans.db.table("workout").put({
                            ...workout,
                            id,
                            workoutExerciseIds: workout.workoutExerciseIds.map((it) => workoutExerciseIds[it])
                        })
                    }
                    const planIds: Record<number, number> = {};
                    if (["plans", "everything", "restoreBackup"].includes(level)) {
                        for (const plan of payload.plans) {
                            const id = getId();
                            planIds[plan.id] = id;
                            await trans.db.table("plan").put({
                                ...plan,
                                id,
                                workoutIds: plan.workoutIds.map((it) => workoutIds[it])
                            })
                        }
                    }
                    if (["everything", "restoreBackup"].includes(level) && payload.users) {
                        for (const user of payload.users) {
                            await trans.db.table("user").put(user)
                        }
                    }
                    if (["everything", "restoreBackup"].includes(level) && payload.workoutHistory) {
                        for (const entry of payload.workoutHistory) {
                            const id = getId();
                            await trans.db.table("workoutHistory").put({
                                ...entry,
                                id,
                                workoutExerciseIds: entry.workoutExerciseIds.map((it) => workoutExerciseIds[it])
                            })
                        }
                    }
                    if (["everything, restoreBackup"].includes(level) && payload.userMetric) {
                        for (const entry of payload.userMetric) {
                            const id = getId();
                            await trans.db.table("userMetric").put({
                                ...entry,
                                id
                            })
                        }
                    }
                    if (["everything", "restoreBackup"].includes(level) && payload.settings) {
                        localStorage.setItem("showRpe", payload.settings.showRpe || "true");
                        localStorage.setItem("showRir", payload.settings.showRir || "true");
                        localStorage.setItem("useLbs", payload.settings.weightUnit === "lbs" ? "true" : "false");
                        localStorage.setItem("wakeLock", payload.settings.wakeLock || "true");
                        localStorage.setItem("oneRmFormula", payload.settings.oneRmFormula === "BRZYCKI" ? "1" : "0")
                    }
                }
            })().then(() => {
                resolve();
            }).catch((e) => {
                trans.abort();
                reject(e);
            })
        })
    })

}
