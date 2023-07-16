import React, {ReactElement, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {ExerciseSet, Workout, WorkoutExercise, WorkoutHistory} from "../models/workout";
import {Exercise} from "../models/exercise";
import {DBContext} from "./dbContext";

interface IWorkoutContext {
    timeStarted?: Date;
    followingWorkout?: Workout;
    workoutExercises?: WorkoutExercise[];
    currentWorkout?: Workout;
    currentSet?: ExerciseSet;
    currentSetNumber: number;
    currentRestTime: number;
    currentWorkoutHistory?: WorkoutHistory;
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
    stopWorkout?: () => Promise<void>;
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
    currentWorkoutHistory: undefined,
    currentSetNumber: 1,
    currentWorkoutExercise: undefined,
    currentWorkoutExerciseNumber: 0
} as IWorkoutContext);

export const WorkoutContextProvider = (props: { children: ReactElement }) => {
    const {children} = props;
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[] | undefined>(undefined);
    const [focusedExercise, setFocusedExercise] = useState<Exercise | undefined>(undefined);
    const [currentWorkout, setCurrentWorkout] = useState<Workout | undefined>(undefined);
    const [currentWorkoutHistory, setCurrentWorkoutHistory] = useState<WorkoutHistory | undefined>(undefined);
    const [currentSet, setCurrentSet] = useState<ExerciseSet | undefined>(undefined);
    const [currentSetNumber, setCurrentSetNumber] = useState(1);
    const [currentWorkoutExercise, setCurrentWorkoutExercise] = useState<WorkoutExercise | undefined>(undefined);
    const [currentWorkoutExerciseNumber, setCurrentWorkoutExerciseNumber] = useState(0);
    const [currentRestTime, setCurrentRestTime] = useState(0);
    const [followingWorkout, setFollowingWorkout] = useState<Workout | undefined>(undefined);
    const [init, setInit] = useState(false);
    const {db} = useContext(DBContext);

    // Session recovery if we navigate away
    useEffect(() => {
        const storageContext = localStorage.getItem("workoutContext");
        if (storageContext) {
            const context = JSON.parse(storageContext) as IWorkoutContext;
            setWorkoutExercises(context.workoutExercises);
            setFocusedExercise(context.focusedExercise);
            setCurrentWorkout(context.currentWorkout);
            if (context.currentWorkoutHistory) setCurrentWorkoutHistory({
                ...context.currentWorkoutHistory,
                date: new Date(context.currentWorkoutHistory.date)
            });
            setCurrentSet(context.currentSet);
            setCurrentSetNumber(context.currentSetNumber);
            setCurrentWorkoutExercise(context.currentWorkoutExercise);
            setCurrentWorkoutExerciseNumber(context.currentWorkoutExerciseNumber);
            setFollowingWorkout(context.followingWorkout);
            setCurrentRestTime(context.currentRestTime);
        }
        setInit(true);
    }, []);

    const startWorkout = useCallback(async (followingWorkout?: Workout) => {
        setWorkoutExercises([]);
        setFocusedExercise(undefined);
        setCurrentSetNumber(1);
        setCurrentWorkoutExerciseNumber(0);
        setCurrentWorkoutHistory({
            id: new Date().getTime(),
            userName: "Default User",
            date: new Date(),
            workoutExerciseIds: [],
        })
        setFollowingWorkout(followingWorkout);
        setFocusedExercise(undefined);
        setCurrentSet(undefined);
        setCurrentRestTime(0);
    }, [setCurrentWorkoutHistory, setWorkoutExercises, setCurrentSetNumber, setCurrentWorkoutExerciseNumber, setFollowingWorkout, setFocusedExercise]);

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
                setCurrentSetNumber(1);
                setCurrentWorkoutExercise(workoutExercise);
            }
        });
    }, [currentWorkout, currentWorkoutExerciseNumber, setCurrentWorkoutExercise, db]);

    useEffect(() => {
        if (!currentWorkoutExercise) {
            setCurrentSet(undefined);
            return;
        }
        if (!setCurrentSet || currentWorkoutExercise.setIds[currentSetNumber - 1] === currentSet?.id || !currentWorkoutExercise.setIds[currentSetNumber - 1]) return;
        db?.exerciseSet.get(currentWorkoutExercise.setIds[currentSetNumber - 1]).then((set) => {
            if (set) {
                setCurrentSet(set);
            }
        });
    }, [currentSet, currentWorkoutExercise, currentSetNumber, setCurrentSet, db]);

    useEffect(() => {
        if (!currentWorkoutExercise || focusedExercise?.id === currentWorkoutExercise.exerciseId) {
            return;
        }
        db?.exercise.get(currentWorkoutExercise.exerciseId).then((exercise) => {
            if (exercise && setFocusedExercise) {
                setFocusedExercise(exercise);
            }
        });
    }, [focusedExercise, currentWorkoutExercise, setFocusedExercise, db]);

    const [restTimer, setRestTimer] = useState<NodeJS.Timeout | undefined>(undefined);

    const timeoutHandler = useCallback(() => {
        setCurrentRestTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, [setCurrentRestTime]);

    const startRest = useCallback((time: number) => {
        setCurrentRestTime(time);
        if (restTimer) clearInterval(restTimer);
        setRestTimer(setInterval(timeoutHandler, 1000));
    }, [timeoutHandler, setRestTimer, restTimer]);

    const saveSet = useCallback(async (set: ExerciseSet) => {
        if (!currentWorkoutExercise || !currentWorkoutExercise.setIds) return;
        await db?.exerciseSet.put(set);
        currentWorkoutExercise.setIds[currentSetNumber - 1] = set.id;
        await db?.workoutExercise.update(currentWorkoutExercise.id, currentWorkoutExercise);
        if (currentSetNumber >= currentWorkoutExercise.setIds.length) {
            const exerciseId = new Date().getTime();
            await db?.workoutExercise.put({...currentWorkoutExercise, id: exerciseId});
            setCurrentWorkoutHistory((prevHistory) => {
                return prevHistory ? {
                    ...prevHistory,
                    workoutExerciseIds: prevHistory?.workoutExerciseIds.concat([exerciseId])
                } : undefined
            });
            setCurrentWorkoutExerciseNumber((prevNumber) => prevNumber + 1);
            setCurrentSetNumber(1);
        } else {
            setCurrentSetNumber((prevNumber) => prevNumber + 1);
        }
        if (set.rest) {
            startRest(set.rest);
        }
    }, [db, currentWorkoutExercise, currentSetNumber, setCurrentWorkoutHistory, setCurrentWorkoutExerciseNumber, setCurrentSetNumber, startRest]);


    const stopRest = useCallback(() => {
        setCurrentRestTime(0);
        clearInterval(restTimer);
    }, [setCurrentRestTime, restTimer]);

    const stopWorkout = useCallback(async () => {
        if (currentWorkoutHistory) await db?.workoutHistory.put(currentWorkoutHistory);
        setWorkoutExercises(undefined);
        setFocusedExercise(undefined);
        setCurrentSetNumber(1);
        setCurrentWorkoutExerciseNumber(0);
        setCurrentWorkoutHistory(undefined)
        setFollowingWorkout(undefined);
        setFocusedExercise(undefined);
        setCurrentSet(undefined);
        setCurrentRestTime(0);
    }, [db, currentWorkoutHistory, setWorkoutExercises, setCurrentSetNumber,
        setCurrentWorkoutExerciseNumber, setCurrentWorkoutHistory, setFollowingWorkout, setFocusedExercise,
        setCurrentSet, setCurrentRestTime]);

    const context = useMemo(() => ({
        timeStarted: currentWorkoutHistory?.date,
        followingWorkout,
        workoutExercises,
        focusedExercise,
        currentWorkout,
        currentSet,
        currentSetNumber,
        currentWorkoutExercise,
        currentWorkoutExerciseNumber,
        currentWorkoutHistory,
        setCurrentWorkout,
        setCurrentSet,
        setCurrentSetNumber,
        setCurrentWorkoutExercise,
        setFocusedExercise,
        setCurrentWorkoutExerciseNumber,
        setCurrentRestTime,
        setCurrentWorkoutHistory,
        startWorkout, saveSet, stopWorkout, startRest, stopRest, currentRestTime
    }), [currentWorkoutHistory,
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
        setCurrentWorkoutHistory,
        startWorkout, saveSet, stopWorkout, startRest, stopRest, currentRestTime]);

    useEffect(() => {
        if (!init) {
            return;
        }
        localStorage.setItem("workoutContext", JSON.stringify(context));
    }, [init, context]);

    return <WorkoutContext.Provider value={context}>
        {children}
    </WorkoutContext.Provider>
}