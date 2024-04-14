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
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    IconButton,
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
import CloseIcon from '@mui/icons-material/Close';
import Selector from "../../components/selector";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {RestInProgress} from "../../components/restInProgress";
import {SpeedDialActionSx} from "../../utils/globalStyles";
import ConfirmDialog from "../../components/confirmDialog";
import Loader from "../../components/Loader";
import WorkoutDetailsEditor from "../workout-editor/workoutDetails_editor";
import getId from "../../utils/id";
import {Cake, Share} from "@mui/icons-material";
import {TimerContext} from "../../context/timerContext";
import AddExercisePicker from "../workout/addExercisePicker";
import defer from "../../utils/defer";
import {backupPlan, backupWorkout, entityToJson, shareBlob} from "../../db/backup";
import contrastColor from "../../utils/contrastColor";

const daysOfWeek = ["mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays", "sundays"];

export const WorkoutList = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [workouts, setWorkouts] = useState<Workout[] | undefined>(undefined);
    const [currentPlan, setCurrentPlan] = useState<number>(parseInt(localStorage.getItem("currentPlan") || "1", 10));
    const [plans, setPlans] = useState<Plan[]>([]);
    const [plan, setPlan] = useState<Plan | undefined>(undefined);
    const {time} = useContext(TimerContext);
    const {startWorkout, stopWorkout, timeStarted, currentWorkout, restTime, setShowWorkoutFinishedPage} = useContext(WorkoutContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const [snackbar, setSnackbar] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [openPlanSelector, setOpenPlanSelector] = useState(false);
    const [targetWorkout, setTargetWorkout] = useState<Workout | undefined>(undefined);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [newWorkoutTarget, setNewWorkoutTarget] = useState<Workout | null>(null);
    const [refetch, setRefetch] = useState(new Date());
    const [ confirmDeletePlan, setConfirmDeletePlan ] = useState<Plan | undefined>(undefined);
    const [mustSelectPlan, setMustSelectPlan] = useState(false);
    const [addExerciseOpen, setAddExerciseOpen] = useState(false);
    useEffect(() => {
        db?.plan.toArray().then((plans) => {
            setPlans(plans.filter((it) => !it.deleted));
        });
    }, [setPlans, db, refetch]);
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

    }, [setWorkouts, currentPlan, db, refetch]);

    const onSelectWorkout = useCallback((workout: Workout) => {
        setTargetWorkout(workout);
    }, [setTargetWorkout]);

    const onStopWorkout = useCallback(() => {
        if (stopWorkout) {
            stopWorkout().then();
        }
    }, [stopWorkout]);

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


    const speedDialActionSx = SpeedDialActionSx(theme);
    const newWorkout = () => {
        setNewWorkoutTarget({
            id: getId(),
            name: "",
            daysOfWeek: [],
            workoutExerciseIds: []
        });
        setShowMenu(false);
    };

    const exportPlan = () => {
        if (!plan || !db) return;
        entityToJson(db, backupPlan, plan!).then((blob) => shareBlob(blob, plan.name));
    }

    return <Layout showAccountMenu title={plan?.name ? t("workoutPlan") + " - " + plan.name : t("workouts")} toolItems={<><IconButton color="inherit" onClick={exportPlan}><Share /></IconButton><IconButton onClick={() => {
        const name = prompt(t("enterPlanNewName"), plan?.name || "");
        if (db && !!name && !!plan && name !== plan.name && name.length > 0) {
            db.plan.put({...plan, name}).then(() => setRefetch(new Date()));
        }
    }}><EditIcon/></IconButton></>}><List sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
        {timeStarted && currentWorkout && <>            {!!restTime &&
            <RestInProgress onClick={() => navigate("/workout")}/>}
            <ListItemButton component="a" onClick={() => navigate("/workout")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.success.main}}>
                        <DirectionsRunIcon sx={{color: (theme) => theme.palette.success.contrastText}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("workoutInProgress")} secondary={workoutLabel}/>
            </ListItemButton><ListItemButton component="a" onClick={() => onStopWorkout()}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.error.main}}>
                        <StopIcon sx={{color: (theme) => theme.palette.error.contrastText}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("stopWorkout")} secondary={workoutLabel}/>
            </ListItemButton>
        </>}
        {!currentWorkout && workouts === undefined && <Loader/>}
        {!currentWorkout && <ListItemButton component="a"
                                            onClick={() => setAddExerciseOpen(true)}>
            <ListItemAvatar>
                <Avatar sx={{bgcolor: (theme) => theme.palette.success.main}}>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("freeTraining")}/>
        </ListItemButton>}
        {!currentWorkout && workouts !== undefined && workouts.map((workout) => <ListItemButton key={workout.id} component="a"
                                                                      onClick={() => onSelectWorkout(workout)}>
                <ListItemAvatar>
                    <Avatar sx={{backgroundColor: workout.color, color: workout.color ? contrastColor(workout.color) : undefined}}>
                        {workout.daysOfWeek.length === 1 ? t(["mon", "tue", "wed", "thu", "fri", "sat", "sun"][workout.daysOfWeek[0]]) : <FitnessCenterIcon/>}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={workout.name} secondary={workout.daysOfWeek.map((d) => t(daysOfWeek[d])).join(", ")}/>
            </ListItemButton>
        )}
        {!currentWorkout && workouts!== undefined && workouts.length === 0 && <ListItemButton component="a"
                                                                                              onClick={newWorkout}>
            <ListItemAvatar>
                <Avatar sx={{bgcolor: (theme) => theme.palette.success.main}}>
                    <Cake sx={{color: (theme) => theme.palette.success.contrastText}}/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("welcomeToWeightLog")} secondary={t("startAddingAWorkout")}/>
        </ListItemButton>}
        {!currentWorkout && <ListItemButton component="a"
                                            onClick={newWorkout}>
            <ListItemAvatar>
                <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                    <AddIcon sx={{color: (theme) => theme.palette.primary.contrastText}}/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("addWorkout")}/>
        </ListItemButton>}

        {!currentWorkout && workouts !== undefined && <SpeedDial sx={{position: 'fixed', bottom: 72, right: 16, zIndex: 1}} ariaLabel="Actions"
                                       icon={<SpeedDialIcon icon={<MenuIcon/>} openIcon={<CloseIcon/>}/>}
                                       open={showMenu} onOpen={() => setShowMenu(true)}
                                       onClose={() => setShowMenu(false)}>
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
                             onClick={newWorkout}
            />
        </SpeedDial>}
        <Selector
            defaultValue={currentPlan.toString()}
            open={openPlanSelector}
            onClose={(val: string) => {
                if (val === "++new" && db) {
                    const name = prompt(t("enterNewPlanName"))
                    if (name && name.length > 0) {
                        const newPlan = {
                            id: getId(),
                            name,
                            workoutIds: []
                        };
                        db.plan.put(newPlan).then(() => {
                            localStorage.setItem("currentPlan", newPlan.id.toString());
                            setCurrentPlan(newPlan.id);
                            setRefetch(new Date());
                        });
                    }
                } else if (val === currentPlan.toString() && mustSelectPlan) {
                    return;
                } else {
                    localStorage.setItem("currentPlan", val);
                    setCurrentPlan(parseInt(val));
                }

                setOpenPlanSelector(false);
            }}
            title={t("selectPlan")}
            entries={[{key: "++new", value: t("newPlan"), icon: <Avatar><AddIcon/></Avatar>}, ...plans.map((p) => ({ key: p.id.toString(), value: p.name, extras: {action: () => {setConfirmDeletePlan(p)}, actionIcon: <DeleteIcon />} }))]}
        />
        {!!targetWorkout && <Selector dense open defaultValue="cancel" onClose={(key: string) => {
            if (key === "start" && targetWorkout && startWorkout) {
                startWorkout(targetWorkout).then(() => {
                    navigate("/workout");
                })
            } else if (key === "edit" && targetWorkout) {
                navigate("/workout/" + targetWorkout.id.toString());
            } else if (key === "share" && targetWorkout && !!db) {
                entityToJson(db, backupWorkout, targetWorkout!).then((blob) => shareBlob(blob, targetWorkout.name));
            } else if (key === "delete") {
                setConfirmDelete(true);
                return;
            }
            setTargetWorkout(undefined)
        }} title={targetWorkout?.name || ""} entries={[
            {key: "start", value: t("startWorkout"), icon: <DirectionsRunIcon/>},
            {key: "edit", value: t("editWorkout"), icon: <EditIcon/>},
            {key: "share", value: t("shareWorkout"), icon: <Share/>},
            {key: "delete", value: t("deleteWorkout"), icon: <DeleteIcon/>},
            {key: "cancel", value: t("cancel"), icon: <CloseIcon/>}]}></Selector>}
        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
        <ConfirmDialog title={t("confirmDeletePlan.title")} message={t("confirmDeletePlan.message")} open={confirmDeletePlan !== undefined} onDismiss={(r) => {
            if (r && confirmDeletePlan) {
                db?.plan.put({...confirmDeletePlan, deleted: true}).then(() => {
                    setRefetch(new Date());
                });
            }
            setConfirmDeletePlan(undefined);
            setTargetWorkout(undefined);
        }}/>
        <ConfirmDialog title={t("confirmDeleteWorkout.title")} message={t("confirmDeleteWorkout.message")} open={confirmDelete} onDismiss={(r) => {
            if (r && targetWorkout) {
                db?.workout.put({...targetWorkout, deleted: true}).then(() => {
                    setRefetch(new Date());
                });
            }
            setConfirmDelete(false);
            setTargetWorkout(undefined);
        }}/>
        {!!newWorkoutTarget && !currentWorkout && plan && <WorkoutDetailsEditor title={t("addWorkout")} workout={newWorkoutTarget} onChange={(newWorkout) => {
            db?.workout.put(newWorkout).then(() => {
                db?.plan.put({...plan, workoutIds: plan.workoutIds.concat([newWorkout.id])}).then(() => {
                    navigate("/workout/" + newWorkout.id)
                }).catch((e) => {
                    console.error(e);
                    setSnackbar(t("somethingWentWrong"));
                });
            }).catch((e) => {
                console.error(e);
                setSnackbar(t("somethingWentWrong"));
            })
        }} onClose={() => setNewWorkoutTarget(null)} open />}
        {addExerciseOpen && <AddExercisePicker onClose={(completed) => {
            setAddExerciseOpen(false)
            if (completed) {
                navigate("/workout");
                defer(() => {
                    if (setShowWorkoutFinishedPage) setShowWorkoutFinishedPage(false);
                });
            }
        }}/>}
    </List></Layout>;
}
