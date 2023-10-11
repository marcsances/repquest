import React, {useCallback, useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Snackbar} from "@mui/material";
import {DBContext} from "../../context/dbContext";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {Exercise} from "../../models/exercise";
import AddIcon from "@mui/icons-material/Add";
import {useParams} from "react-router-dom";
import {ExerciseSet, SetType, WorkoutExercise} from "../../models/workout";
import {SettingsContext} from "../../context/settingsContext";
import {getLabelForSet} from "../../utils/setUtils";
import SetEditor from "./set_editor";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export const WorkoutExerciseEditor = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const { workoutExerciseId } = useParams();
    const [ exercise, setExercise ] = useState<Exercise | undefined>(undefined);
    const [ sets, setSets ] = useState<ExerciseSet[] | undefined>(undefined);
    const { useLbs } = useContext(SettingsContext);
    const [ editingSet, setEditingSet ] = useState<ExerciseSet | undefined>(undefined);
    const [snackbar, setSnackbar] = useState("");
    const [ setNumber, setSetNumber ] = useState(1);
    const [refetch, setRefetch ] = useState(new Date());
    const [ workoutExercise, setWorkoutExercise] = useState<WorkoutExercise | undefined>(undefined);

    const getSetType = (set: ExerciseSet) => {
        if (set.type === SetType.WARMUP) {
            return t("warmup")
        } else if (set.type === SetType.DROPSET) {
            return t("dropSet")
        } else if (set.type === SetType.FAILURE) {
            return t("failure")
        } else if (set.type === SetType.STANDARD) {
            return t("workSet")
        }
        return t("set")
    }

    const fetch = useCallback(async () => {
        setSets(undefined);
        if (!db || !workoutExerciseId) return;
        const workoutExercise = await db.workoutExercise.get(parseInt(workoutExerciseId));
        if (!workoutExercise) return;
        const maybeExercise = await db.exercise.get(workoutExercise.exerciseId);
        if (!maybeExercise) return;
        const sets: ExerciseSet[] = [];
        for (const setId of workoutExercise.setIds) {
            const set = await db.exerciseSet.get({ id: setId });
            if (set) sets.push(set);
        }
        setExercise(maybeExercise);
        setSets(sets);
        setWorkoutExercise(workoutExercise);
    }, [db, workoutExerciseId, refetch, setExercise, setSets]);

    useEffect(() => { setSets(undefined); fetch().then() }, [ workoutExerciseId, fetch ]);

    const deleteSet = (set: ExerciseSet) => {
        if (!workoutExercise || !db) return;
        const newWorkoutExercise = {...workoutExercise, setIds: workoutExercise.setIds.filter((it) => it !== set.id)};
        db.workoutExercise.put(newWorkoutExercise).then(() => setRefetch(new Date()));
    };

    return <Layout title={exercise?.name ? exercise.name : t("workoutEditor.title")} hideNav>
        {sets !== undefined && <List sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
            {sets.map((set, idx) =>  <ListItemButton key={idx + set.id.toString()} component="a" onClick={() => {
                setEditingSet(set);
                setSetNumber(idx + 1);
            }}>
                <ListItemAvatar>
                    {!exercise?.picture && <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>}
                    {exercise?.picture && <Avatar src={exercise.picture} />}
                </ListItemAvatar>
                <ListItemText primary={getSetType(set)} secondary={getLabelForSet(set, useLbs, t)}/>
                <IconButton onClick={(e) => {
                    e.stopPropagation();
                   deleteSet(set);
                }}><DeleteIcon /></IconButton>
            </ListItemButton>)}
            <ListItemButton component="a" onClick={() => {
                if (!db || !exercise || !workoutExercise) return;
                const set: ExerciseSet = sets.length > 0 ? {
                    ...sets[sets.length - 1],
                    id: Math.floor(new Date().getTime() * 100 + (Math.random() % 100)),
                } : {
                    id: Math.floor(new Date().getTime() * 100 + (Math.random() % 100)),
                    exerciseId: exercise.id,
                    type: 0,
                    initial: true,
                    setNumber: 0,
                    weight: 10,
                    reps: 12,
                    rest: 90
                };
                db.exerciseSet.put(set).then(() => {
                    const newWorkoutExercise = {...workoutExercise, setIds: workoutExercise.setIds.concat([set.id])};
                    db.workoutExercise.put(newWorkoutExercise).then(() => setRefetch(new Date()));
                })
            }}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <AddIcon sx={{color: (theme) => theme.palette.primary.contrastText}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("actions.addSet")} />
            </ListItemButton>
        </List>}
        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
        {editingSet && <SetEditor open set={editingSet} setNumber={setNumber} onChange={(set: ExerciseSet) => {
            db?.exerciseSet.put(set).then(() => {
                setSnackbar(t("saved"));
                setRefetch(new Date());
            }).catch(() => {
                setSnackbar(t("somethingWentWrong"))
            });
        }} onDelete={() => deleteSet(editingSet)} onClose={() => setEditingSet(undefined)} />}
    </Layout>;
}
