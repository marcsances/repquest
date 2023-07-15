import {DexieDB} from "./db";
import sampleDb from "./sampleDb.json";
export async function InjectData(db: DexieDB) {
    return db.transaction("rw", [db.exercise, db.workout, db.workoutExercise, db.exerciseSet, db.user], async () => {
        for (const exercise of sampleDb.exercises) {
            await db.exercise.put(exercise)
        }
        for (const set of sampleDb.sets) {
            await db.exerciseSet.put(set);
        }
        for (const workoutExercise of sampleDb.workoutExercises) {
            await db.workoutExercise.put(workoutExercise);
        }
        for (const workout of sampleDb.workouts) {
            await db.workout.put(workout);
        }
        for (const user of sampleDb.users) {
            await db.user.put(user);
        }
    })
}