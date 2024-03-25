/*
    This file is part of WeightLog.

    WeightLog is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WeightLog is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WeightLog.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, {useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, IconButton, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {Plan, Workout} from "../../models/workout";
import {DBContext} from "../../context/dbContext";
import EventNoteIcon from '@mui/icons-material/EventNote';
import CloseIcon from '@mui/icons-material/Close';
import Selector from "../../components/selector";
import Loader from "../../components/Loader";

const daysOfWeek = ["mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays", "sundays"];

export interface WorkoutPickerProps {
    onSelectWorkout: (workout: Workout) => void;
    onCancel: () => void;
    onFreePicked?: () => void;
}

export const WorkoutPicker = (props: WorkoutPickerProps) => {
    const {onSelectWorkout, onCancel, onFreePicked} = props;
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [workouts, setWorkouts] = useState<Workout[] | undefined>(undefined);
    const [currentPlan, setCurrentPlan] = useState<number>(parseInt(localStorage.getItem("currentPlan") || "1", 10));
    const [plans, setPlans] = useState<Plan[]>([]);
    const [plan, setPlan] = useState<Plan | undefined>(undefined);
    const [openPlanSelector, setOpenPlanSelector] = useState(false);
    const [mustSelectPlan, setMustSelectPlan] = useState(false);

    useEffect(() => {
        db?.plan.toArray().then((plans) => {
            setPlans(plans.filter((it) => !it.deleted));
        });
    }, [setPlans, db]);
    useEffect(() => {
        db?.plan.get(currentPlan).then((plan) => {
            if (!plan) {
                setMustSelectPlan(true);
                setOpenPlanSelector(true);
                return;
            }
            setMustSelectPlan(false);
            setPlan(plan);
            db?.workout.bulkGet(plan.workoutIds).then((workouts) => {
                setWorkouts(workouts.filter((it) => it !== undefined && !it.deleted).map((it) => it as Workout));
            })
        })

    }, [setWorkouts, currentPlan, db]);

    return <Layout title={t("selectWorkout")}
                                           leftToolItems={onCancel ?
        <IconButton sx={{mr: 2}} size="large" edge="start" color="inherit"
                    onClick={onCancel}><CloseIcon/></IconButton> : <></>} hideBack
                                           hideNav>
        <List sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
            {!!onFreePicked && <ListItemButton component="a" onClick={onFreePicked}>
                <ListItemAvatar color="success">
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <FitnessCenterIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("selectExercise")} />
            </ListItemButton>}

            <ListItemButton component="a" onClick={() => setOpenPlanSelector(true)}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <EventNoteIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("selectPlan")} />
            </ListItemButton>
        {workouts === undefined && <Loader/>}
        {workouts !== undefined && workouts.map((workout) => <ListItemButton key={workout.id} component="a"
                                                                                                onClick={() => onSelectWorkout(workout)}>
                <ListItemAvatar>
                    <Avatar>
                        {workout.daysOfWeek.length === 1 ? t(["mon", "tue", "wed", "thu", "fri", "sat", "sun"][workout.daysOfWeek[0]]) : <FitnessCenterIcon/>}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={workout.name} secondary={workout.daysOfWeek.map((d) => t(daysOfWeek[d])).join(", ")}/>
            </ListItemButton>
        )}
        <Selector
            defaultValue={currentPlan.toString()}
            open={openPlanSelector}
            onClose={(val: string) => {
                if (val === currentPlan.toString()) {
                    setOpenPlanSelector(false);
                    return;
                } else {
                    setCurrentPlan(parseInt(val));
                }
                setOpenPlanSelector(false);
            }}
            title={t("selectPlan")}
            entries={plans.map((p) => ({ key: p.id.toString(), value: p.name }))}
        />
    </List></Layout>;
}
