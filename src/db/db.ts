import Dexie, { Table } from 'dexie';
import {Exercise} from "../models/exercise";
import {ExerciseSet, Workout, WorkoutExercise, WorkoutHistory} from "../models/workout";
import {User, UserMetric} from "../models/user";
import {InjectData} from "./dbInjector";

export class DexieDB extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    exercise!: Table<Exercise>;
    workout!: Table<Workout>;
    workoutHistory!: Table<WorkoutHistory>;
    workoutExercise!: Table<WorkoutExercise>;
    exerciseSet!: Table<ExerciseSet>;
    user!: Table<User>;
    userMetric!: Table<UserMetric>;
    constructor() {
        super('weightlog');
        this.version(1).stores({
            exercise: "++id, name, type, *tags",
            workout: "++id, name",
            workoutHistory: "++id, userId, date, workoutExerciseIds",
            workoutExercise: "++id",
            exerciseSet: "++id, exerciseId, type",
            user: "++name",
            userMetric: "++id"
        });
        this.user.count().then((count) => {
            if (count === 0) {
                InjectData(this).then(() => {
                    window.location.reload();
                });
            }
        })
    }
}

export const db = new DexieDB();