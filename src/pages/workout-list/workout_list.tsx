import React, {useCallback, useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {Workout} from "../../models/workout";
import {DBContext} from "../../context/dbContext";
import {WorkoutContext} from "../../context/workoutContext";
import {useNavigate} from "react-router-dom";

const daysOfWeek = ["mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays", "sundays"];

export const WorkoutList = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const {startWorkout} = useContext(WorkoutContext);
    const navigate = useNavigate();
    useEffect(() => {
        db?.workout.toArray().then((workouts) => {
            setWorkouts(workouts);
        })
    }, [setWorkouts, db]);

    const onSelectWorkout = (workout: Workout) => {
        debugger;
        if (startWorkout) {
            startWorkout(workout).then(() => {
                navigate("/workout");
            })
        }
    }

    return <Layout title={t("workouts")}><List sx={{width: '100%', height: '100%', bgcolor: 'background.paper'}}>
        {workouts.map((workout) =>  <ListItemButton key={workout.id} component="a" onClick={() => onSelectWorkout(workout)}>
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={workout.name} secondary={workout.daysOfWeek.map((d) => t(daysOfWeek[d])).join(",")}/>
        </ListItemButton>)}
    </List></Layout>;
}