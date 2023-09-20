import Dexie, {Table} from 'dexie';
import {Exercise} from "../models/exercise";
import {ExerciseSet, Plan, Workout, WorkoutExercise, WorkoutHistory} from "../models/workout";
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
    plan!: Table<Plan>;
    constructor() {
        super('weightlog');
        this.version(1).stores({
            exercise: "++id, name, type, *tags",
            workout: "++id, name",
            workoutHistory: "++id, userName, date, workoutExerciseIds",
            workoutExercise: "++id, exerciseId",
            exerciseSet: "++id, exerciseId, type",
            user: "++name",
            userMetric: "++id"
        });
        this.version(2).upgrade((trans) => {
            trans.db.table("exerciseSet").toCollection().modify((set: ExerciseSet) => {
                set.date = new Date();
                set.initial = set.id < 100;
                set.setNumber = 0;
            })
        });
        this.version(3).stores({
            exercise: "++id, name, type, *tags",
            workout: "++id, name",
            workoutHistory: "++id, userName, date, workoutExerciseIds",
            workoutExercise: "++id, exerciseId, setIds",
            exerciseSet: "++id, exerciseId, type",
            user: "++name",
            userMetric: "++id"
        });
        this.version(4).stores({
            exercise: "++id, name, type, *tags",
            workout: "++id, name",
            workoutHistory: "++id, userName, date, workoutExerciseIds",
            workoutExercise: "++id, exerciseId, setIds",
            exerciseSet: "++id, exerciseId, type",
            user: "++name",
            userMetric: "++id",
            plan: "++id, workoutId, name"
        }).upgrade((trans) => {
            trans.db.table("plan").add({
                id: 1,
                name: "Upper / Lower",
                workoutIds: [ 1, 2, 3, 4, 5]
            })
        })
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
