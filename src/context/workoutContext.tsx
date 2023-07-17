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
    restStarted?: Date;
    restTime: number;
    currentWorkoutHistory?: WorkoutHistory;
    currentWorkoutExercise?: WorkoutExercise;
    completedExercises: number[];
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
    setRestTime?: (rest: number) => void;
    setFocusedExercise?: (exercise: Exercise) => void;
    time: Date;
}

export const WorkoutContext = React.createContext({
    timeStarted: undefined,
    followingWorkout: undefined,
    workoutExercises: [],
    focusedExercise: undefined,
    currentWorkout: undefined,
    currentSet: undefined,
    completedExercises: [],
    restStarted: undefined,
    restTime: 0,
    currentWorkoutHistory: undefined,
    currentSetNumber: 1,
    currentWorkoutExercise: undefined,
    currentWorkoutExerciseNumber: 0,
    time: new Date()
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
    const [completedExercises, setCompletedExercises] = useState<number[]>([]);
    const [restStarted, setRestStarted] = useState<Date | undefined>(undefined);
    const [restTime, setRestTime] = useState<number>(0);
    const [followingWorkout, setFollowingWorkout] = useState<Workout | undefined>(undefined);
    const [init, setInit] = useState(false);
    const {db} = useContext(DBContext);

    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [setTime]);


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
            setRestStarted(context.restStarted ? new Date(context.restStarted) : undefined);
            setRestTime(context.restTime);
            setCompletedExercises(context.completedExercises);
        }
        setInit(true);
    }, []);

    const startWorkout = useCallback(async (followingWorkout?: Workout) => {
        setWorkoutExercises([]);
        setFocusedExercise(undefined);
        setCurrentSetNumber(1);
        setCurrentWorkoutExerciseNumber(0);
        setCurrentWorkoutHistory({
            id: new Date().getTime() * 100 + (Math.random() % 100),
            userName: "Default User",
            date: new Date(),
            workoutExerciseIds: [],
        })
        setFollowingWorkout(followingWorkout);
        setFocusedExercise(undefined);
        setCurrentSet(undefined);
        setRestStarted(undefined);
        setCompletedExercises([]);
    }, [setCurrentWorkoutHistory, setWorkoutExercises, setCurrentSetNumber, setCurrentWorkoutExerciseNumber, setFollowingWorkout, setFocusedExercise, setCompletedExercises]);

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

    const saveSet = useCallback(async (set: ExerciseSet) => {
        if (!currentWorkoutExercise || !currentWorkoutExercise.setIds) return;
        await db?.exerciseSet.put({...set, initial: false});
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
            setCompletedExercises((prevExercises) => prevExercises.concat([currentWorkoutExercise.exerciseId]))
            setCurrentWorkoutExerciseNumber((prevNumber) => prevNumber + 1);
            setCurrentSetNumber(1);
        } else {
            setCurrentSetNumber((prevNumber) => prevNumber + 1);
        }
        if (set.rest) {
            startRest(set.rest);
        }
    }, [db, currentWorkoutExercise, currentSetNumber, setCurrentWorkoutHistory, setCurrentWorkoutExerciseNumber, setCurrentSetNumber, setCompletedExercises]);
    const startRest = useCallback((time: number) => {
        setRestStarted(new Date());
        setRestTime(time);
    }, [setRestStarted]);

    const stopRest = useCallback(() => {
        setRestStarted(undefined);
        setRestTime(0);
    }, [setRestStarted]);

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
        setRestStarted(undefined);
        setRestTime(0);
        setCompletedExercises([]);
    }, [db, currentWorkoutHistory, setWorkoutExercises, setCurrentSetNumber,
        setCurrentWorkoutExerciseNumber, setCurrentWorkoutHistory, setFollowingWorkout, setFocusedExercise, setCompletedExercises,
        setCurrentSet, setRestStarted, setRestTime]);

    const context = useMemo(() => ({
        timeStarted: currentWorkoutHistory?.date,
        followingWorkout,
        workoutExercises,
        focusedExercise,
        currentWorkout,
        currentSet,
        currentSetNumber,
        restTime,
        restStarted,
        time,
        currentWorkoutExercise,
        currentWorkoutExerciseNumber,
        currentWorkoutHistory,
        setCurrentWorkout,
        setCurrentSet,
        setCurrentSetNumber,
        setCurrentWorkoutExercise,
        setFocusedExercise,
        setCurrentWorkoutExerciseNumber,
        setRestStarted,
        setCurrentWorkoutHistory,
        completedExercises,
        startWorkout, saveSet, stopWorkout, startRest, stopRest, setRestTime
    }), [currentWorkoutHistory,
        followingWorkout,
        workoutExercises,
        focusedExercise,
        currentWorkout,
        currentSet,
        currentSetNumber,
        currentWorkoutExercise,
        restTime,
        restStarted,
        time,
        currentWorkoutExerciseNumber,
        setCurrentWorkout,
        setCurrentSet,
        setCurrentSetNumber,
        setCurrentWorkoutExercise,
        setFocusedExercise,
        setCurrentWorkoutExerciseNumber,
        setCurrentWorkoutHistory,
        completedExercises,
        startWorkout, saveSet, stopWorkout, startRest, stopRest, setRestTime]);

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