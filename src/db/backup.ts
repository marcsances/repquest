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
import {DexieDB} from "./db";
import {OneRm} from "../utils/oneRm";
import {ExerciseSet, Plan, Workout, WorkoutExercise, WorkoutHistory} from "../models/workout";
import {User, UserMetric} from "../models/user";
import {Exercise} from "../models/exercise";
import getId from "../utils/id";
import {MasterDB} from "./masterDb";
import {ISettingsContext} from "../context/settingsContext";

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

export async function generateBackup(db: DexieDB, level: string, user: User, settings: ISettingsContext) {
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
        backupObject.users = [ user ];
        backupObject.workoutHistory = await db.workoutHistory.toArray();
        backupObject.userMetric = await db.userMetric.toArray();
        backupObject.settings = {
            weightUnit: settings.useLbs ? "lbs" : "kg",
            wakeLock: settings.wakeLock ? settings.wakeLock.toString() : undefined,
            oneRmFormula: OneRm[settings.oneRm || OneRm.BRZYCKI],
            autostop: settings.autostop.toString(),
            lang: settings.lang,
            sound: settings.sound.toString(),
            emojis: settings.emojis.join(";"),
            featureLevel: settings.featureLevel,
            theme: settings.theme
        }
    }
    return backupObject;
}

export async function backupToJSON(db: DexieDB, level: string, user: User, settings: ISettingsContext) {
    const backup = await generateBackup(db, level, user, settings);
    const jsonObject = JSON.stringify(backup);
    const blob = new Blob([jsonObject], {type: "application/octet-stream"});
    return URL.createObjectURL(blob);
}

export async function backupWorkout(db: DexieDB, workout: Workout): Promise<BackupObject> {
    const workoutExercises = await db.workoutExercise.bulkGet(workout.workoutExerciseIds);
    if (!workoutExercises) return Promise.reject();
    const exercises = await db.exercise.bulkGet(workoutExercises.filter((we) => !!we).map((we) => we!.exerciseId));
    if (!exercises) return Promise.reject();
    const exerciseSets = await db.exerciseSet.bulkGet(workoutExercises.filter((we) => !!we).flatMap((we) => we!.setIds));
    if (!exerciseSets) return Promise.reject();
    return {
        date: new Date().toJSON(),
        plans: [{ id: getId(), name: workout.name, workoutIds: [workout.id] }],
        workouts: [workout],
        exercises: exercises.filter((it) => !!it).map((it) => it!),
        workoutExercises: workoutExercises.filter((it) => !!it).map((it) => it!),
        exerciseSets: exerciseSets.filter((it) => !!it).map((it) => it!)
    };
}

export async function backupPlan(db: DexieDB, plan: Plan): Promise<BackupObject> {
    const workouts = await db.workout.bulkGet(plan.workoutIds);
    if (!workouts) return Promise.reject();
    const backups = [];
    for (let i = 0; i < workouts.length; i++) {
        if (!!workouts[i]) {
             backups.push(await backupWorkout(db, workouts[i]!));
        }
    }
    return {
        date: new Date().toJSON(),
        plans: [plan],
        workouts: backups.filter((it) => !!it).flatMap((it) => it.workouts!),
        exercises: backups.filter((it) => !!it).flatMap((it) => it.exercises!),
        workoutExercises: backups.filter((it) => !!it).flatMap((it) => it.workoutExercises!),
        exerciseSets: backups.filter((it) => !!it).flatMap((it) => it.exerciseSets!)
    };
}

export async function backupExercise(db: DexieDB, exercise: Exercise): Promise<BackupObject> {
    return {
        date: new Date().toJSON(),
        exercises: [exercise]
    };
}

export async function entityToJson<T>(db: DexieDB, backer: (db: DexieDB, entity: T) => Promise<BackupObject>, entity: T): Promise<Blob> {
    const backup = await backer(db, entity);
    const jsonObject = JSON.stringify(backup);
    return new Blob([jsonObject], {type: "text/plain"});
}

export async function shareBlob(blob: Blob, title: string) {
    try {
        const data = {files: [ new File([blob], title + ".txt")], title};
        if (navigator.share && navigator.canShare && navigator.canShare(data)) {
            await navigator.share(data);
            return Promise.resolve();
        }
    } catch {
        // go to fall back
    }
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute("download", title + ".json");
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
}

export function importFromJSON(db: DexieDB, masterDb: MasterDB, userName: string, level: string, payload: BackupObject): Promise<void> {
    return db.transaction("rw", [db.exercise, db.exerciseSet, db.workout, db.workoutExercise, db.plan, db.user, db.userMetric, db.workoutHistory], async (trans) => {
        if (level === "restoreBackup") {
            await trans.db.table("exercise").clear();
            await trans.db.table("exerciseSet").clear();
            await trans.db.table("workout").clear();
            await trans.db.table("workoutExercise").clear();
            await trans.db.table("plan").clear();
            await trans.db.table("user").clear();
            await trans.db.table("userMetric").clear();
            await trans.db.table("workoutHistory").clear();
        }
        await trans.db.table("exercise").bulkPut(payload.exercises);

        if (["workouts", "plans", "everything", "restoreBackup"].includes(level) && payload.workoutExercises && payload.exerciseSets && payload.workouts && payload.plans) {
            await trans.db.table("exerciseSet").bulkPut(payload.exerciseSets.filter((it) => ["everything", "restoreBackup"].includes(level) || it.initial).map((set) => ({
                ...set,
                date: set.date ? new Date(set.date) : set.date
            })));
            await trans.db.table("workout").bulkPut(payload.workouts);
            await trans.db.table("workoutExercise").bulkPut(payload.workoutExercises);
            if (["plans", "everything", "restoreBackup"].includes(level)) {
                await trans.db.table("plan").bulkPut(payload.plans);
            }
            if (["everything", "restoreBackup"].includes(level) && payload.users) {
                await trans.db.table("user").bulkPut(payload.users);
            }
            if (["everything", "restoreBackup"].includes(level) && payload.workoutHistory) {
                await trans.db.table("workoutHistory").bulkPut(payload.workoutHistory.map((entry) => ({
                    ...entry,
                    date: entry.date ? new Date(entry.date) : entry.date
                })));
            }
            if (["everything", "restoreBackup"].includes(level) && payload.userMetric) {
                await trans.db.table("userMetric").bulkPut(payload.userMetric.map((entry) => ({
                    ...entry,
                    date: entry.date ? new Date(entry.date) : entry.date
                })));
            }
            if (["everything", "restoreBackup"].includes(level) && payload.settings) {
                if (userName === "Default User") {
                    localStorage.setItem("showRpe", payload.settings.showRpe || "true");
                    localStorage.setItem("showRir", payload.settings.showRir || "true");
                    localStorage.setItem("useLbs", payload.settings.weightUnit === "lbs" ? "true" : "false");
                    localStorage.setItem("wakeLock", payload.settings.wakeLock || "true");
                    localStorage.setItem("oneRmFormula", payload.settings.oneRmFormula === "BRZYCKI" ? "1" : "0")
                    localStorage.setItem("autostop", payload.settings.autostop || "true")
                    localStorage.setItem("sound", payload.settings.sound || "false")
                    if (payload.settings.emojis) localStorage.setItem("emojis", payload.settings.emojis)
                    if (payload.settings.lang) localStorage.setItem("lang", payload.settings.lang)
                    if (payload.settings.theme) localStorage.setItem("theme", payload.settings.theme)
                    if (payload.settings.featureLevel) localStorage.setItem("featureLevel", payload.settings.featureLevel)
                } else {
                    masterDb?.user.update(userName, {
                        picture: payload.users?.filter((it) => it.name === userName)[0]?.picture,
                        showRpe: payload.settings.showRpe === "true",
                        showRir: payload.settings.showRir === "true",
                        useLbs: payload.settings.weightUnit === "lbs",
                        oneRm: payload.settings.oneRmFormula === "BRZYCKI" ? "1" : "0",
                        wakeLock: payload.settings.wakeLock === "true",
                        autostop: payload.settings.autostop === "true",
                        lang: payload.settings.lang,
                        theme: payload.settings.theme,
                        featureLevel: payload.settings.featureLevel
                    })
                }

            }
        }
    })

}
