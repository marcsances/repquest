import React, {ReactElement, ReactNode, useCallback, useContext, useState} from "react";
import {LocalWorkoutExercise, Workout, WorkoutExercise} from "../models/workout";
import {Exercise} from "../models/exercise";
import {DBContext} from "./dbContext";

interface IWorkoutContext {
    timeStarted?: Date;
    followingWorkout?: Workout;
    workoutExercises: LocalWorkoutExercise[];
    focusedExercise?: Exercise;
    startWorkout?: (followingWorkout?: Workout) => Promise<void>;
    saveExercise?: (workoutExercise: LocalWorkoutExercise) => void;
    focusExercise?: (exercise: Exercise) => void;
}

export const WorkoutContext = React.createContext({
    timeStarted: undefined,
    followingWorkout: undefined,
    workoutExercises: [],
    focusedExercise: undefined
} as IWorkoutContext);

export const WorkoutContextProvider = (props: {children: ReactElement}) => {
    const { children } = props;
    const [workoutContext, setWorkoutContext] = useState<IWorkoutContext>({workoutExercises: []});
    const {db} = useContext(DBContext);
    const startWorkout = useCallback(async (followingWorkout?: Workout) => {
        let focusedExercise: Exercise | undefined;
        if (followingWorkout && followingWorkout.workoutExerciseIds.length > 0) {
            const workoutExercise = await db?.workoutExercise.get(followingWorkout.workoutExerciseIds[0]);
            focusedExercise = workoutExercise ? await db?.exercise.get(workoutExercise.exerciseId) : undefined;
        }
        setWorkoutContext({
            timeStarted: new Date(),
            followingWorkout,
            workoutExercises: [],
            focusedExercise
        })
    }, [db, setWorkoutContext]);
    const saveExercise = useCallback(async (workoutExercise: LocalWorkoutExercise) => {
        setWorkoutContext((prevContext) => ({
            ...prevContext,
            workoutExercises: prevContext.workoutExercises.concat([workoutExercise])
        }))
    }, [db, setWorkoutContext]);
    const focusExercise = useCallback(async (exercise: Exercise) => {
        setWorkoutContext((prevContext) => ({
            ...prevContext,
            focusedExercise: exercise
        }))
    }, [setWorkoutContext]);
    return <WorkoutContext.Provider value={{...workoutContext, startWorkout, saveExercise, focusExercise}}>
        {children}
    </WorkoutContext.Provider>
}