import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Snackbar,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    useTheme
} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {Plan, Workout} from "../../models/workout";
import {DBContext} from "../../context/dbContext";
import {WorkoutContext} from "../../context/workoutContext";
import {useNavigate} from "react-router-dom";
import StopIcon from '@mui/icons-material/Stop';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MenuIcon from '@mui/icons-material/Menu';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CloseIcon from '@mui/icons-material/Close';
import Selector from "../../components/selector";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {RestInProgress} from "../../components/restInProgress";

const daysOfWeek = ["mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays", "sundays"];

export const WorkoutList = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [currentPlan, setCurrentPlan] = useState<number>(parseInt(localStorage.getItem("currentPlan") || "1", 10));
    const [plans, setPlans] = useState<Plan[]>([]);
    const {startWorkout, stopWorkout, time, timeStarted, currentWorkout, restTime} = useContext(WorkoutContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const [notImplemented, setNotImplemented] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [openPlanSelector, setOpenPlanSelector] = useState(false);
    const [targetWorkout, setTargetWorkout] = useState<Workout | undefined>(undefined);
    useEffect(() => {
        db?.plan.toArray().then((plans) => {
            setPlans(plans);
        });
    }, [setPlans, db]);
    useEffect(() => {
        db?.plan.get(currentPlan).then((plan) => {
            if (!plan) return;
            db?.workout.bulkGet(plan.workoutIds).then((workouts) => {
                setWorkouts(workouts.filter((it) => it !== undefined).map((it) => it as Workout));
            })
        })

    }, [setWorkouts, currentPlan, db]);

    const onSelectWorkout = useCallback((workout: Workout) => {
        setTargetWorkout(workout);
    }, [startWorkout, navigate]);

    const onStopWorkout = useCallback(() => {
        if (stopWorkout) {
            stopWorkout().then();
        }
    }, [stopWorkout]);

    const speedDialActionSx = {
        marginTop: "16px",
        "& .MuiSpeedDialAction-fab": {
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.background.default
        },
        "& .MuiSpeedDialAction-staticTooltipLabel": {
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.background.default
        }
    };

    const workoutLabel = useMemo(() => {
        time?.getTime();
        if (!timeStarted || !currentWorkout) return;
        const startTime = timeStarted.getTime();
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - startTime;
        const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
        const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);
        return `${currentWorkout.name} - ${hours.toString()}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, [currentWorkout, time, timeStarted]);

    return <Layout title={t("workouts")}><List sx={{width: '100%', height: '100%', bgcolor: 'background.paper'}}>
        {timeStarted && currentWorkout && <>            {!!restTime &&
            <RestInProgress onClick={() => navigate("/workout")}/>}
            <ListItemButton component="a" onClick={() => navigate("/workout")}>
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
            </ListItemButton>
        </>}
        {!currentWorkout && workouts.map((workout) => <ListItemButton key={workout.id} component="a"
                                                                      onClick={() => onSelectWorkout(workout)}>
                <ListItemAvatar>
                    <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={workout.name} secondary={workout.daysOfWeek.map((d) => t(daysOfWeek[d])).join(",")}/>
            </ListItemButton>
        )}
        {!currentWorkout && <SpeedDial sx={{position: 'absolute', bottom: 72, right: 16}} ariaLabel="Actions"
                                       icon={<SpeedDialIcon icon={<MenuIcon/>} openIcon={<CloseIcon/>}/>}
                                       open={showMenu} onOpen={() => setShowMenu(true)}
                                       onClose={() => setShowMenu(false)}>
            <SpeedDialAction tooltipOpen
                             icon={<EditCalendarIcon/>}
                             tooltipTitle={t("managePlans")}
                             sx={speedDialActionSx}
                             onClick={() => {
                                 setNotImplemented(true);
                                 setShowMenu(false);
                             }}
            />
            <SpeedDialAction tooltipOpen
                             icon={<EventNoteIcon/>}
                             tooltipTitle={t("selectPlan")}
                             sx={speedDialActionSx}
                             onClick={() => {
                                 setOpenPlanSelector(true);
                                 setShowMenu(false);
                             }}
            />
            <SpeedDialAction tooltipOpen
                             icon={<AddIcon/>}
                             tooltipTitle={t("addWorkout")}
                             sx={speedDialActionSx}
                             onClick={() => {
                                 setNotImplemented(true);
                                 setShowMenu(false);
                             }}
            />
        </SpeedDial>}
        <Selector
            selectedValue={currentPlan.toString()}
            open={openPlanSelector}
            onClose={(val: string) => {
                localStorage.setItem("currentPlan", val);
                setCurrentPlan(parseInt(val));
                setOpenPlanSelector(false);
            }}
            title={t("selectPlan")}
            entries={plans.map((p) => ({ key: p.id.toString(), value: p.name}))}
        />
        <Selector open={!!targetWorkout} selectedValue="cancel" onClose={(key: string) => {
            if (key === "start" && targetWorkout && startWorkout) {
                startWorkout(targetWorkout).then(() => {
                    navigate("/workout");
                })
            } else if (key !== "cancel") {
                setNotImplemented(true);
            }
            setTargetWorkout(undefined)
        }} title={targetWorkout?.name || ""} entries={[
            {key: "start", value: t("startWorkout"), icon: <DirectionsRunIcon/>},
            {key: "edit", value: t("editWorkout"), icon: <EditIcon/>},
            {key: "delete", value: t("deleteWorkout"), icon: <DeleteIcon/>},
            {key: "cancel", value: t("cancel"), icon: <CloseIcon/>}]}></Selector>
        <Snackbar
            open={notImplemented}
            autoHideDuration={2000}
            onClose={() => setNotImplemented(false)}
            message={t("notImplemented")}
        />
    </List></Layout>;
}
