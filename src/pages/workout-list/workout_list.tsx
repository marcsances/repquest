/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    Fab,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Snackbar,
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
import CloseIcon from '@mui/icons-material/Close';
import Selector from "../../components/selector";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {RestInProgress} from "../../components/restInProgress";
import ConfirmDialog from "../../components/confirmDialog";
import Loader from "../../components/Loader";
import WorkoutDetailsEditor from "../workout-editor/workoutDetails_editor";
import getId from "../../utils/id";
import {ArrowDownward, ArrowUpward, Celebration, Share} from "@mui/icons-material";
import {TimerContext} from "../../context/timerContext";
import AddExercisePicker from "../workout/addExercisePicker";
import defer from "../../utils/defer";
import {backupPlan, backupWorkout, entityToJson, shareBlob} from "../../db/backup";
import contrastColor from "../../utils/contrastColor";
import {DialogContext} from "../../context/dialogContext";
import TutorialAlert from "../../components/tutorialAlert";
import {SettingsContext} from "../../context/settingsContext";

const daysOfWeek = ["mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays", "sundays"];

export const WorkoutList = () => {


    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [workouts, setWorkouts] = useState<Workout[] | undefined>(undefined);
    const [currentPlan, setCurrentPlan] = useState<number>(parseInt(localStorage.getItem("currentPlan") || "1", 10));
    const [plans, setPlans] = useState<Plan[]>([]);
    const [plan, setPlan] = useState<Plan | undefined>(undefined);
    const {time} = useContext(TimerContext);
    const {
        startWorkout,
        stopWorkout,
        timeStarted,
        currentWorkout,
        restTime,
        setShowWorkoutFinishedPage
    } = useContext(WorkoutContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const [snackbar, setSnackbar] = useState("");
    const [openPlanSelector, setOpenPlanSelector] = useState(false);
    const [targetWorkout, setTargetWorkout] = useState<Workout | undefined>(undefined);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [newWorkoutTarget, setNewWorkoutTarget] = useState<Workout | null>(null);
    const [refetch, setRefetch] = useState(new Date());
    const [confirmDeletePlan, setConfirmDeletePlan] = useState<Plan | undefined>(undefined);
    const [mustSelectPlan, setMustSelectPlan] = useState(false);
    const [addExerciseOpen, setAddExerciseOpen] = useState(false);
    const {showPrompt, showAlert} = useContext(DialogContext);
    const {theme: appTheme} = useContext(SettingsContext);
    const [showWrapped, setShowWrapped] = useState(false);
    const wrappedYear = (new Date().getFullYear() + (new Date().getMonth() === 0 ? -1 : 0));
    useEffect(() => {
        if (location.hostname === "weightlog.marcsances.net") navigate("/eol");
    }, []);

    useEffect(() => {
        if (!db) return;
        if ([11, 0].includes(new Date().getMonth())) {
            db?.exerciseSet.toArray().then((sets) => {
                setShowWrapped(sets.filter((set) => !set.initial && set.date && set.date?.getTime() >= new Date(wrappedYear, 0, 1).getTime() && set.date?.getTime() < new Date(wrappedYear + 1, 0, 1).getTime()).length > 0);
            });
        }
    }, [db]);

    useEffect(() => {
        db?.plan.toArray().then((plans) => {
            setPlans(plans.filter((it) => !it.deleted));
        });
    }, [setPlans, db, refetch]);
    useEffect(() => {
        db?.plan.get(currentPlan).then((plan) => {
            if (!plan) {
                db?.plan.toArray().then((plans) => {
                    const plansFiltered = plans.filter((it) => !it.deleted);
                    if (plansFiltered.length === 1) {
                        const newPlan = plansFiltered[0];
                        localStorage.setItem("currentPlan", newPlan.id.toString());
                        setCurrentPlan(newPlan.id);
                        setPlan(newPlan);
                        setMustSelectPlan(false);
                        db?.workout.bulkGet(newPlan.workoutIds).then((workouts) => {
                            setWorkouts(workouts.filter((it) => it !== undefined && !it.deleted).map((it) => it as Workout).sort((w1, w2) => {
                                if (w1.order === undefined && w2.order === undefined) return w1.id - w2.id;
                                if (w2.order === undefined) return -1;
                                if (w1.order === undefined) return 1;
                                return w1.order! - w2.order!;
                            }));
                        })
                    } else {
                        setMustSelectPlan(true);
                        setOpenPlanSelector(true);

                    }
                })
                return;
            }
            setMustSelectPlan(false);
            setPlan(plan);
            db?.workout.bulkGet(plan.workoutIds).then((workouts) => {
                setWorkouts(workouts.filter((it) => it !== undefined && !it.deleted).map((it) => it as Workout).sort((w1, w2) => {
                    if (w1.order === undefined && w2.order === undefined) return w1.id - w2.id;
                    if (w2.order === undefined) return -1;
                    if (w1.order === undefined) return 1;
                    return w1.order! - w2.order!;
                }));
            })
        })

    }, [setWorkouts, currentPlan, db, refetch]);

    const onSelectWorkout = useCallback((workout: Workout) => {
        setTargetWorkout(workout);
    }, [setTargetWorkout]);

    const onStopWorkout = useCallback(() => {
        if (stopWorkout) showAlert(t("stopWorkout") + "?", "", (r) => {
            if (r) stopWorkout().then();
        }, "yesNo");
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


    const newWorkout = () => {
        setNewWorkoutTarget({
            id: getId(),
            name: "",
            daysOfWeek: [],
            workoutExerciseIds: []
        });
    };

    const moveUp = (workout: Workout) => {
        if (!workouts || !db) return;
        const idx = workouts.findIndex((x) => workout.id === x.id);
        const newWorkouts = ([...[...workouts.slice(0, idx - 1), workouts[idx], workouts[idx - 1]], ...workouts.slice(idx + 1)]).map((w, idx) => ({...w, order: idx}));
        db.transaction("rw", "workout", async (tx) => {
            for (const workout of newWorkouts) {
                await db.workout.update(workout.id, { order: workout.order });
            }
        }).then(() => {
            setWorkouts(newWorkouts)
        }).catch(() => {
            setSnackbar(t("somethingWentWrong"))
        })
    }

    const moveDown = (workout: Workout) => {
        if (!workouts || !db) return;
        const idx = workouts.findIndex((x) => workout.id === x.id);
        const newWorkouts = ([...[...workouts.slice(0, idx), workouts[idx + 1], workouts[idx]], ...workouts.slice(idx + 2)]).map((w, idx) => ({...w, order: idx}));
        db.transaction("rw", "workout", async (tx) => {
            for (const workout of newWorkouts) {
                await db.workout.update(workout.id, { order: workout.order });
            }
        }).then(() => {
            setWorkouts(newWorkouts)
        }).catch(() => {
            setSnackbar(t("somethingWentWrong"))
        })
    }

    const exportPlan = () => {
        if (!plan || !db) return;
        entityToJson(db, backupPlan, plan!).then((blob) => shareBlob(blob, plan.name));
    }

    return <Layout showAccountMenu title={plan?.name ? plan.name : t("workouts")}
                   toolItems={<><IconButton color="inherit" onClick={exportPlan}><Share/></IconButton><IconButton
                       color="inherit" onClick={() => {
                       showPrompt(t("enterPlanNewName"), "", (name) => {
                           if (db && !!name && !!plan && name !== plan.name && name.length > 0) {
                               db.plan.put({...plan, name}).then(() => setRefetch(new Date()));
                           }
                       }, plan?.name || "");
                   }}><EditIcon/></IconButton></>}><List
        sx={{width: '100%', backgroundImage: {dark: "url('/logofadenoback.png')", light: "url('/logofadelight.png')"}[appTheme], backgroundSize: "contain", backgroundPosition: "right bottom", backgroundRepeat: "no-repeat", height: 'calc(100% - 78px)', overflow: "auto"}}>
        {showWrapped && !currentWorkout && <ListItemButton component="a" sx={{padding: "4px", marginLeft: "10px", marginRight: "10px", marginBottom: "5px", boxShadow: "0px 0px 5px 0px rgba(255,236,29,0.9)", background: "conic-gradient(rgba(255,237,29,1), rgba(255,205,30,1), rgba(255,237,29,1));", borderRadius: "20px"}} onClick={() => navigate("/wrapped")}>
            <ListItemAvatar>
                <Avatar sx={{marginLeft: "6px", bgcolor: "rgba(255,255,255,0)"}}>
                    <Celebration sx={{color: "black"}}/>
                </Avatar></ListItemAvatar>
                <ListItemText sx={{".MuiListItemText-primary": {color: "black", fontWeight: 600}, ".MuiListItemText-secondary": {color: "black", fontSize: "12px"}}} primary={t("wrapped.menuEntry")} secondary={t("wrapped.menuEntryDescription") + (new Date().getFullYear() + (new Date().getMonth() === 0 ? -1 : 0))} />

        </ListItemButton>}
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
        {!currentWorkout && workouts !== undefined && workouts.map((workout) => <ListItemButton key={workout.id}
                                                                                                component="a"
                                                                                                onClick={() => onSelectWorkout(workout)}>
                <ListItemAvatar>
                    <Avatar sx={{
                        backgroundColor: workout.color,
                        color: workout.color ? contrastColor(workout.color) : undefined
                    }}>
                        {workout.daysOfWeek.length === 1 ? t(["mon", "tue", "wed", "thu", "fri", "sat", "sun"][workout.daysOfWeek[0]]) :
                            <FitnessCenterIcon/>}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={workout.name}
                              secondary={workout.daysOfWeek.map((d) => t(daysOfWeek[d])).join(", ")}/>
            </ListItemButton>
        )}
        {!currentWorkout && workouts !== undefined && workouts.length === 0 && <TutorialAlert title={t("startAddingAWorkout")} message={t("thisIsTheWorkoutList")} action={t("addWorkout")} onAction={newWorkout} sx={{left: 0, position: "fixed", bottom: "64px"}} />}
        {!currentWorkout && <ListItemButton component="a"
                                            onClick={newWorkout}>
            <ListItemAvatar>
                <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                    <AddIcon sx={{color: (theme) => theme.palette.primary.contrastText}}/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("addWorkout")}/>
        </ListItemButton>}

        <Fab color="primary" sx={{ position: "fixed", bottom: 72, right: 16, zIndex: 1}} onClick={() => {
            setOpenPlanSelector(true);
        }}>
            <EventNoteIcon/>
        </Fab>

        <Selector
            defaultValue={currentPlan.toString()}
            open={openPlanSelector}
            onClose={(val: string) => {
                if (val === "++new" && db) {
                    showPrompt(t("enterNewPlanName"), "", (name) => {
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
                    })
                } else if (val === currentPlan.toString() && mustSelectPlan) {
                    return;
                } else {
                    localStorage.setItem("currentPlan", val);
                    setCurrentPlan(parseInt(val));
                }

                setOpenPlanSelector(false);
            }}
            title={t("selectPlan")}
            entries={[{
                key: "++new",
                value: t("newPlan"),
                icon: <Avatar><AddIcon/></Avatar>
            }, ...plans.map((p) => ({
                key: p.id.toString(), value: p.name, extras: {
                    action: () => {
                        setConfirmDeletePlan(p)
                    }, actionIcon: <DeleteIcon/>
                }
            }))]}
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
            } else if (key === "moveUp") {
                moveUp(targetWorkout);
            } else if (key === "moveDown") {
                moveDown(targetWorkout);
            }
            setTargetWorkout(undefined)
        }} title={targetWorkout?.name || ""} entries={[
            {key: "start", value: t("startWorkout"), icon: <DirectionsRunIcon/>},
            {key: "edit", value: t("editWorkout"), icon: <EditIcon/>},
            {key: "share", value: t("shareWorkout"), icon: <Share/>},
            ...(workouts && workouts.findIndex((workout) => workout.id === targetWorkout.id) !== 0 ? [{key: "moveUp", value: t("actions.moveUp"), icon: <ArrowUpward/>}] : []),
            ...(workouts && workouts.findIndex((workout) => workout.id === targetWorkout.id) !== workouts.length - 1 ? [{key: "moveDown", value: t("actions.moveDown"), icon: <ArrowDownward/>}] : []),
            {key: "delete", value: t("deleteWorkout"), icon: <DeleteIcon/>},
            {key: "cancel", value: t("cancel"), icon: <CloseIcon/>}]}></Selector>}
        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
        <ConfirmDialog title={t("confirmDeletePlan.title")} message={t("confirmDeletePlan.message")}
                       open={confirmDeletePlan !== undefined} onDismiss={(r) => {
            if (r && confirmDeletePlan) {
                db?.plan.put({...confirmDeletePlan, deleted: true}).then(() => {
                    setRefetch(new Date());
                });
            }
            setConfirmDeletePlan(undefined);
            setTargetWorkout(undefined);
        }}/>
        <ConfirmDialog title={t("confirmDeleteWorkout.title")} message={t("confirmDeleteWorkout.message")}
                       open={confirmDelete} onDismiss={(r) => {
            if (r && targetWorkout) {
                db?.workout.put({...targetWorkout, deleted: true}).then(() => {
                    setRefetch(new Date());
                });
            }
            setConfirmDelete(false);
            setTargetWorkout(undefined);
        }}/>
        {!!newWorkoutTarget && !currentWorkout && plan &&
            <WorkoutDetailsEditor title={t("addWorkout")} workout={newWorkoutTarget} onChange={(newWorkout) => {
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
            }} onClose={() => setNewWorkoutTarget(null)} open/>}
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
