import React, {ReactElement, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {ExerciseSet, LocalWorkoutExercise, Workout, WorkoutExercise} from "../models/workout";
import {Exercise} from "../models/exercise";
import {DBContext} from "./dbContext";

interface IWorkoutContext {
    timeStarted?: Date;
    followingWorkout?: Workout;
    workoutExercises?: LocalWorkoutExercise[];
    currentWorkout?: Workout;
    currentSet?: ExerciseSet;
    currentSetNumber: number;
    currentWorkoutExercise?: WorkoutExercise;
    currentWorkoutExerciseNumber: number;
    setCurrentWorkout?: (currentWorkout?: Workout) => void;
    setCurrentSet?: (currentSet?: ExerciseSet) => void;
    setCurrentSetNumber?: (currentSetNumber: number) => void;
    setCurrentWorkoutExercise?: (currentWorkoutExercise?: WorkoutExercise) => void;
    setCurrentWorkoutExerciseNumber?: (currentWorkoutExerciseNumber: number) => void;
    focusedExercise?: Exercise;
    startWorkout?: (followingWorkout?: Workout) => Promise<void>;
    saveExercise?: (workoutExercise: LocalWorkoutExercise) => void;
    setFocusedExercise?: (exercise: Exercise) => void;
}

export const WorkoutContext = React.createContext({
    timeStarted: undefined,
    followingWorkout: undefined,
    workoutExercises: [],
    focusedExercise: undefined,
    currentWorkout: undefined,
    currentSet: undefined,
    currentSetNumber: 1,
    currentWorkoutExercise: undefined,
    currentWorkoutExerciseNumber: 0
} as IWorkoutContext);

export const WorkoutContextProvider = (props: { children: ReactElement }) => {
    const {children} = props;
    const [timeStarted, setTimeStarted] = useState<Date | undefined>(undefined);
    const [workoutExercises, setWorkoutExercises] = useState<LocalWorkoutExercise[] | undefined>(undefined);
    const [focusedExercise, setFocusedExercise] = useState<Exercise | undefined>(undefined);
    const [currentWorkout, setCurrentWorkout] = useState<Workout | undefined>(undefined);
    const [currentSet, setCurrentSet] = useState<ExerciseSet | undefined>(undefined);
    const [currentSetNumber, setCurrentSetNumber] = useState(1);
    const [currentWorkoutExercise, setCurrentWorkoutExercise] = useState<WorkoutExercise | undefined>(undefined);
    const [currentWorkoutExerciseNumber, setCurrentWorkoutExerciseNumber] = useState(0);
    const [followingWorkout, setFollowingWorkout] = useState<Workout | undefined>(undefined);
    const {db} = useContext(DBContext);

    const startWorkout = useCallback(async (followingWorkout?: Workout) => {
        setTimeStarted(new Date());
        setWorkoutExercises([]);
        setFocusedExercise(undefined);
        setCurrentSetNumber(1);
        setCurrentWorkoutExerciseNumber(0);
        setFollowingWorkout(followingWorkout);
        setFocusedExercise(undefined);
        setCurrentSet(undefined);
    }, [db, setTimeStarted, setWorkoutExercises, setCurrentSetNumber, setCurrentWorkoutExerciseNumber, setFollowingWorkout, setFocusedExercise]);

    useEffect(() => {
        if (!setCurrentWorkout) return;
        if (!followingWorkout) {
            setCurrentWorkout(undefined);
            return;
        }
        db?.workout.get(followingWorkout.id).then((workout) => {
            if (workout) {
                setCurrentWorkout(workout);
            }
        });
    }, [followingWorkout, setCurrentWorkout, db]);

    useEffect(() => {
        if (!setCurrentWorkoutExercise) return;
        if (!currentWorkout) {
            setCurrentWorkoutExercise(undefined);
            return;
        }
        db?.workoutExercise.get(currentWorkout.workoutExerciseIds[currentWorkoutExerciseNumber]).then((workoutExercise) => {
            if (workoutExercise) {
                setCurrentWorkoutExercise(workoutExercise);
            }
        });
    }, [currentWorkout, currentWorkoutExerciseNumber, setCurrentWorkoutExercise, db]);

    useEffect(() => {
        if (!setCurrentSet) return;
        if (!currentWorkoutExercise) {
            setCurrentSet(undefined);
            return;
        }
        db?.exerciseSet.get(currentWorkoutExercise.setIds[currentSetNumber - 1]).then((set) => {
            if (set) {
                setCurrentSet(set);
            }
        });
    }, [currentWorkoutExercise, currentSetNumber, setCurrentSet, db]);

    useEffect(() => {
        if (!currentWorkoutExercise) {
            return;
        }
        db?.exercise.get(currentWorkoutExercise.exerciseId).then((exercise) => {
            if (exercise && setFocusedExercise) {
                setFocusedExercise(exercise);
            }
        });
    }, [currentWorkoutExercise, setFocusedExercise, db]);

    const saveExercise = useCallback((workoutExercise: LocalWorkoutExercise) => {
        setWorkoutExercises((prevExercises) => prevExercises?.concat([workoutExercise]));
    }, [db, setWorkoutExercises]);

    const context = useMemo(() => ({
        timeStarted,
        followingWorkout,
        workoutExercises,
        focusedExercise,
        currentWorkout,
        currentSet,
        currentSetNumber,
        currentWorkoutExercise,
        currentWorkoutExerciseNumber,
        setCurrentWorkout,
        setCurrentSet,
        setCurrentSetNumber,
        setCurrentWorkoutExercise,
        setFocusedExercise,
        setCurrentWorkoutExerciseNumber,
        startWorkout, saveExercise
    }), [timeStarted,
        followingWorkout,
        workoutExercises,
        focusedExercise,
        currentWorkout,
        currentSet,
        currentSetNumber,
        currentWorkoutExercise,
        currentWorkoutExerciseNumber,
        setCurrentWorkout,
        setCurrentSet,
        setCurrentSetNumber,
        setCurrentWorkoutExercise,
        setFocusedExercise,
        setCurrentWorkoutExerciseNumber,
        startWorkout, saveExercise])
    return <WorkoutContext.Provider value={context}>
        {children}
    </WorkoutContext.Provider>
}