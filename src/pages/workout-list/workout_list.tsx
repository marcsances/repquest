import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {Workout} from "../../models/workout";
import {DBContext} from "../../context/dbContext";
import {WorkoutContext} from "../../context/workoutContext";
import {useNavigate} from "react-router-dom";
import StopIcon from '@mui/icons-material/Stop';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
const daysOfWeek = ["mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays", "sundays"];

export const WorkoutList = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const {startWorkout, timeStarted, currentWorkout} = useContext(WorkoutContext);
    const navigate = useNavigate();
    useEffect(() => {
        db?.workout.toArray().then((workouts) => {
            setWorkouts(workouts);
        })
    }, [setWorkouts, db]);

    const onSelectWorkout = useCallback((workout: Workout) => {
        if (startWorkout) {
            startWorkout(workout).then(() => {
                navigate("/workout");
            })
        }
    }, [startWorkout]);

    const onStopWorkout = useCallback(() => {

    }, []);

    const [timer, setTimer] = useState(0);
    const refreshTimer = useCallback(() => {
        setTimer((prevTimer) => prevTimer + 1);
    }, [setTimer]);
    const [retimer, setRetimer] = useState<NodeJS.Timeout | undefined>(undefined);
    const teardown = useCallback(() => {
        clearInterval(retimer);
    }, [retimer]);
    useEffect(() => {
        setRetimer(setInterval(refreshTimer, 1000));
        return teardown;
    }, [setRetimer, setRetimer, teardown]);

    const workoutLabel = useMemo(() => {
        if (!timeStarted || !currentWorkout) return;
        const startTime = timeStarted.getTime();
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - startTime;
        const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
        const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);
        return `${currentWorkout.name} - ${hours.toString()}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, [currentWorkout, timer]);

    return <Layout title={t("workouts")}><List sx={{width: '100%', height: '100%', bgcolor: 'background.paper'}}>
        {timeStarted && currentWorkout && <><ListItemButton component="a" onClick={() => navigate("/workout")}>
            <ListItemAvatar>
                <Avatar>
                    <DirectionsRunIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("workoutInProgress")} secondary={workoutLabel}/>
        </ListItemButton><ListItemButton component="a" onClick={() => onStopWorkout()}>
            <ListItemAvatar>
                <Avatar>
                    <StopIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("stopWorkout")} secondary={workoutLabel}/>
        </ListItemButton></>}
        {!currentWorkout && workouts.map((workout) =>  <ListItemButton key={workout.id} component="a" onClick={() => onSelectWorkout(workout)}>
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={workout.name} secondary={workout.daysOfWeek.map((d) => t(daysOfWeek[d])).join(",")}/>
        </ListItemButton>)}
    </List></Layout>;
}