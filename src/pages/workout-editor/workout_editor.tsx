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
import React, {useCallback, useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Snackbar
} from "@mui/material";
import {DBContext} from "../../context/dbContext";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {Exercise} from "../../models/exercise";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate, useParams} from "react-router-dom";
import {ExerciseSet, Workout, WorkoutExercise} from "../../models/workout";
import {SettingsContext} from "../../context/settingsContext";
import {getLabelForSet} from "../../utils/setUtils";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {CheckBox, CheckBoxOutlineBlank, Edit, KeyboardArrowDown, KeyboardArrowUp, Share} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExercisePicker from "./exercise_picker";
import ConfirmDialog from "../../components/confirmDialog";
import WorkoutDetailsEditor from "./workoutDetails_editor";
import Loader from "../../components/Loader";
import getId from "../../utils/id";
import {backupWorkout, entityToJson, shareBlob} from "../../db/backup";

interface Entry {
    workoutExercise: WorkoutExercise;
    exercise: Exercise;
    sets: ExerciseSet[];
}

export const WorkoutEditor = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [snackbar, setSnackbar] = useState("");
    const navigate = useNavigate();
    const { workoutId } = useParams();
    const [ entries, setEntries ] = useState<Entry[] | undefined>(undefined);
    const [ workout, setWorkout ] = useState<Workout | undefined>(undefined);
    const { useLbs } = useContext(SettingsContext);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [entryIdx, setEntryIdx] = useState(0);
    const [ pickerOpen, setPickerOpen ] = useState(false);
    const [ detailsEditorOpen, setDetailsEditorOpen ] = useState(false);
    const [ deleteTarget, setDeleteTarget ] = useState<WorkoutExercise | null>(null);
    const [ refetch, setRefetch ] = useState(new Date());

    const fetch = useCallback(async () => {
        setEntries(undefined);
        if (!db || !workoutId) return;
        const workout = await db.workout.get(parseInt(workoutId));
        if (!workout) return;
        const workoutExercises = [];
        for (const workoutExerciseId of workout.workoutExerciseIds) {
            const workoutExercise = await db.workoutExercise.get(workoutExerciseId);
            if (workoutExercise) workoutExercises.push(workoutExercise);
        }
        const entries = [];
        for (const workoutExercise of workoutExercises) {
            const maybeExercise = await db.exercise.get(workoutExercise.exerciseId);
            if (!maybeExercise) continue;
            const sets: ExerciseSet[] = [];
            for (const setId of workoutExercise.setIds) {
                const set = await db.exerciseSet.get({ id: setId });
                if (set) sets.push(set);
            }
            entries.push({workoutExercise, exercise: maybeExercise, sets});
        }
        setWorkout(workout);
        setEntries(entries);
    }, [db, workoutId, refetch, setEntries]);

    const insertExercise = (exercise: Exercise) => {
        if (!db || !workout || entries === undefined) return;
        setEntries(undefined);
        const workoutExercise: WorkoutExercise = {
            id: getId(),
            exerciseId: exercise.id,
            setIds: [],
            initial: true
        };
        db.workoutExercise.put(workoutExercise).then(() => {
            const newWorkout = {
                ...workout,
                workoutExerciseIds: [...workout.workoutExerciseIds, workoutExercise.id]
            };
            return db.workout.put(newWorkout).then(() => {
                navigate("/workoutExercise/" + workoutExercise.id);
            });
        }).catch((e) => {
            console.error(e);
            setSnackbar("somethingWentWrong");
        })
    }

    useEffect(() => { setEntries(undefined); fetch().then(); }, [ workoutId, fetch ]);

    const exportWorkout = () => {
        if (!workout || !db) return;
        entityToJson(db, backupWorkout, workout!).then((blob) => shareBlob(blob, workout.name));
    }

    return <Layout onBack={() => navigate("/")} title={workout?.name ? workout.name : t("workoutEditor.title")} hideNav toolItems={workout ? <><IconButton color="inherit" onClick={exportWorkout}><Share /></IconButton><IconButton color="inherit" onClick={() => setDetailsEditorOpen(true)}><Edit /></IconButton></> : undefined}>
        {entries !== undefined && <List sx={{width: '100%', height: 'calc(100% - 24px)', overflow: "auto"}}>
            {entries.map((entry, idx) =>  <ListItemButton key={entry.workoutExercise.id} component="a" onClick={() => navigate("/workoutExercise/" + entry.workoutExercise.id.toString())}>
                <ListItemAvatar>
                    {!entry.exercise.picture && <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>}
                    {entry.exercise.picture && <Avatar src={entry.exercise.picture} />}
                </ListItemAvatar>
                <ListItemText primary={entry.exercise.name} secondary={entry.sets.map((set) => getLabelForSet(set, useLbs, t)).join(", ")}/>
                <IconButton color="inherit" onClick={(e) => {
                    e.stopPropagation();
                    setMenuAnchor(e.currentTarget);
                    setEntryIdx(idx);
                }}><MoreVertIcon /></IconButton>
            </ListItemButton>)}
            <ListItemButton component="a" onClick={() => setPickerOpen(true)}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <AddIcon sx={{color: (theme) => theme.palette.primary.contrastText}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("addExercise")} />
            </ListItemButton>
        </List>}
        {entries === undefined && <Loader/>}
        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
        {entries !== undefined && <Menu
            anchorEl={menuAnchor}
            open={menuAnchor !== null}
            onClose={() => { setMenuAnchor(null)}}
        >
            {entryIdx > 0 && <MenuItem onClick={() => {
                setMenuAnchor(null);
                if (db && workout) {
                    setEntries(undefined);
                    const newWorkout = {
                        ...workout,
                        workoutExerciseIds: [...workout.workoutExerciseIds.slice(0, entryIdx - 1), workout.workoutExerciseIds[entryIdx], workout.workoutExerciseIds[entryIdx - 1], ...workout.workoutExerciseIds.slice(entryIdx + 1) ]
                    };
                    db.workout.put(newWorkout).then(() => {
                        setRefetch(new Date());
                    });
                }
            }}><ListItemIcon>
                <KeyboardArrowUp />
            </ListItemIcon>
            <ListItemText>{t("actions.moveUp")}</ListItemText></MenuItem>}
            {entryIdx < entries.length - 1 && <MenuItem onClick={() => {
                setMenuAnchor(null);
                if (db && workout) {
                    setEntries(undefined);
                    const newWorkout = {
                        ...workout,
                        workoutExerciseIds: [...workout.workoutExerciseIds.slice(0, entryIdx), workout.workoutExerciseIds[entryIdx + 1], workout.workoutExerciseIds[entryIdx], ...workout.workoutExerciseIds.slice(entryIdx + 2) ]
                    };
                    db.workout.put(newWorkout).then(() => {
                        setRefetch(new Date());
                    });
                }
            }}><ListItemIcon>
                <KeyboardArrowDown />
            </ListItemIcon>
                <ListItemText>{t("actions.moveDown")}</ListItemText></MenuItem>}
            <MenuItem onClick={() => {setDeleteTarget(entries[entryIdx].workoutExercise)}}><ListItemIcon>
                <DeleteIcon />
            </ListItemIcon>
                <ListItemText>{t("delete")}</ListItemText></MenuItem>
            {entryIdx < entries.length - 1 && <MenuItem onClick={() => {
                setMenuAnchor(null);
                db?.workoutExercise.put({
                    ...entries[entryIdx].workoutExercise,
                    superset: !entries[entryIdx].workoutExercise.superset
                }).then(() => setRefetch(new Date()));
            }}>
                <ListItemIcon>{entries[entryIdx].workoutExercise.superset ? <CheckBox /> : <CheckBoxOutlineBlank />}</ListItemIcon>
                <ListItemText>{t("startSuperset")}</ListItemText>
            </MenuItem>}
        </Menu>}
        <ConfirmDialog title={t("confirmDeleteWorkoutExercise.title")} message={t("confirmDeleteWorkoutExercise.message")} open={deleteTarget !== null} onDismiss={(r) => {
            setMenuAnchor(null);
            if (r && workout && entries !== undefined) {
                setEntries(undefined);
                const newWorkout = {
                    ...workout,
                    workoutExerciseIds: workout.workoutExerciseIds.filter((it) => it !== deleteTarget?.id) || []
                };
                db?.workout.put(newWorkout).then(() => {
                    setRefetch(new Date());
                }).catch((e) => {
                    console.error(e);
                    setSnackbar(t("somethingWentWrong"));
                })
            }
            setDeleteTarget(null);
        }}/>
        {pickerOpen && <ExercisePicker open onClose={() => setPickerOpen(false)} onSelectExercise={(e) => insertExercise(e)} />}
        {detailsEditorOpen && workout && <WorkoutDetailsEditor title={t("editWorkout")} workout={workout} onChange={(newWorkout) => {
            db?.workout.put(newWorkout).then(() => {
                setSnackbar(t("saved"));
                setRefetch(new Date());
            }).catch((e) => {
                console.error(e);
                setSnackbar(t("somethingWentWrong"));
            })
        }} onClose={() => setDetailsEditorOpen(false)} open />}
    </Layout>;
}
