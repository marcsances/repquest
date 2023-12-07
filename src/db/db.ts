import Dexie, {Table} from 'dexie';
import {Exercise} from "../models/exercise";
import {ExerciseSet, Plan, Workout, WorkoutExercise, WorkoutHistory} from "../models/workout";
import {User, UserMetric} from "../models/user";

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
            workoutExercise: "++id, exerciseId, setIds",
            exerciseSet: "++id, exerciseId, type",
            user: "++name",
            userMetric: "++id",
            plan: "++id, workoutId, name"
        });
        this.plan.count().then((count) => {
            if (count === 0) {
                this.plan.put({
                    id: 1,
                    name: "WeightLog",
                    workoutIds: []
                }).then(() => {
                    window.location.reload();
                })
            }
        });
    }
}

export const db = new DexieDB();
