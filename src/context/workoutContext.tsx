import React, {ReactElement, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {ExerciseSet, Workout, WorkoutExercise} from "../models/workout";
import {Exercise} from "../models/exercise";
import {DBContext} from "./dbContext";
import {v4} from "uuid";

interface IWorkoutContext {
    timeStarted?: Date;
    followingWorkout?: Workout;
    workoutExercises?: WorkoutExercise[];
    currentWorkout?: Workout;
    currentSet?: ExerciseSet;
    currentSetNumber: number;
    currentRestTime: number;
    setCurrentRestTime?: (restTime: number) => void;
    currentWorkoutExercise?: WorkoutExercise;
    currentWorkoutExerciseNumber: number;
    setCurrentWorkout?: (currentWorkout?: Workout) => void;
    setCurrentSet?: (currentSet?: ExerciseSet) => void;
    setCurrentSetNumber?: (currentSetNumber: number) => void;
    setCurrentWorkoutExercise?: (currentWorkoutExercise?: WorkoutExercise) => void;
    setCurrentWorkoutExerciseNumber?: (currentWorkoutExerciseNumber: number) => void;
    focusedExercise?: Exercise;
    startWorkout?: (followingWorkout?: Workout) => Promise<void>;
    saveSet?: (set: ExerciseSet) => Promise<void>;
    startRest?: (rest: number) => void;
    stopRest?: () => void;
    setFocusedExercise?: (exercise: Exercise) => void;
}

export const WorkoutContext = React.createContext({
    timeStarted: undefined,
    followingWorkout: undefined,
    workoutExercises: [],
    focusedExercise: undefined,
    currentWorkout: undefined,
    currentSet: undefined,
    currentRestTime: 0,
    currentSetNumber: 1,
    currentWorkoutExercise: undefined,
    currentWorkoutExerciseNumber: 0
} as IWorkoutContext);

export const WorkoutContextProvider = (props: { children: ReactElement }) => {
    const {children} = props;
    const [timeStarted, setTimeStarted] = useState<Date | undefined>(undefined);
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[] | undefined>(undefined);
    const [focusedExercise, setFocusedExercise] = useState<Exercise | undefined>(undefined);
    const [currentWorkout, setCurrentWorkout] = useState<Workout | undefined>(undefined);
    const [currentSet, setCurrentSet] = useState<ExerciseSet | undefined>(undefined);
    const [currentSetNumber, setCurrentSetNumber] = useState(1);
    const [currentWorkoutExercise, setCurrentWorkoutExercise] = useState<WorkoutExercise | undefined>(undefined);
    const [currentWorkoutExerciseNumber, setCurrentWorkoutExerciseNumber] = useState(0);
    const [currentRestTime, setCurrentRestTime] = useState(0);
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
        setCurrentRestTime(0);
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
        if (!currentWorkoutExercise) {
            setCurrentSet(undefined);
            return;
        }
        if (!setCurrentSet || currentWorkoutExercise.setIds[currentSetNumber] === currentSet?.id) return;
        db?.exerciseSet.get(currentWorkoutExercise.setIds[currentSetNumber - 1]).then((set) => {
            if (set) {
                setCurrentSet(set);
            }
        });
    }, [currentWorkoutExercise, currentSetNumber, setCurrentSet, db]);

    useEffect(() => {
        if (!currentWorkoutExercise || focusedExercise?.id === currentWorkoutExercise.exerciseId) {
            return;
        }
        db?.exercise.get(currentWorkoutExercise.exerciseId).then((exercise) => {
            if (exercise && setFocusedExercise) {
                setFocusedExercise(exercise);
            }
        });
    }, [currentWorkoutExercise, setFocusedExercise, db]);

    const saveSet = useCallback(async (set: ExerciseSet) => {
        if (!currentWorkoutExercise || !currentWorkoutExercise.setIds) return;
        await db?.exerciseSet.put(set);
        currentWorkoutExercise.setIds[currentSetNumber] = set.id;
        await db?.workoutExercise.update(currentWorkoutExercise.id, currentWorkoutExercise);
        setCurrentSetNumber((prevNumber) => {
            if (prevNumber >= currentWorkoutExercise.setIds.length - 1) {
                setCurrentWorkoutExerciseNumber((prevNumber) => prevNumber + 1);
                return 1;
            }
            return prevNumber + 1;
        });
        if (set.rest) {
            startRest(set.rest);
        }
    }, [db, currentWorkoutExercise]);


    const [ restTimer, setRestTimer ] = useState<NodeJS.Timeout | undefined>(undefined);

    const timeoutHandler = useCallback(() => {
        setCurrentRestTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, [setCurrentRestTime]);

    const startRest = useCallback((time: number) => {
        setCurrentRestTime(time);
        if (restTimer) clearInterval(restTimer);
        setRestTimer(setInterval(timeoutHandler, 1000));
    }, [timeoutHandler, setRestTimer, restTimer]);

    const stopRest = useCallback(() => {
        setCurrentRestTime(0);
        clearInterval(restTimer);
    }, [setCurrentRestTime, restTimer]);

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
        setCurrentRestTime,
        startWorkout, saveSet, startRest, stopRest, currentRestTime
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
        setCurrentRestTime,
        startWorkout, saveSet, startRest, stopRest, currentRestTime])
    return <WorkoutContext.Provider value={context}>
        {children}
    </WorkoutContext.Provider>
}