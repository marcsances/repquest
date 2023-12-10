import React, {useCallback, useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {DBContext} from "../../context/dbContext";
import {WorkoutContext} from "../../context/workoutContext";
import {ExerciseSet, WorkoutHistory} from "../../models/workout";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {useParams} from "react-router-dom";
import {compareSetHistoryEntries} from "../../utils/comparators";
import {Exercise} from "../../models/exercise";

export const HistoryEntry = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const { workoutId } = useParams();
    const {followingWorkout} = useContext(WorkoutContext);
    const [ history, setHistory ] = useState<{id: number, exercise?: Exercise, sets: ExerciseSet[]}[]>([]);
    const [historyEntry, setHistoryEntry] = useState<WorkoutHistory | undefined>(undefined);

    const fetchHistory = useCallback(async () => {
        if (!db) return;
        const entries = [];
        if (!workoutId) { return; }
        const historyEntry = await (db.workoutHistory.get(parseFloat(workoutId)));
        if (!historyEntry) { return; }
        setHistoryEntry(historyEntry);
        const workoutExercises = await db.workoutExercise.where("id").anyOf(historyEntry?.workoutExerciseIds).toArray();
        for (const workoutExercise of workoutExercises) {
            const exercise = await db.exercise.get(workoutExercise.exerciseId);
            const sets = (await db.exerciseSet.where("id").anyOf(workoutExercise.setIds).toArray()).filter((it) => !it.initial).sort(compareSetHistoryEntries);
            if (sets.length > 0) entries.push({id: new Date().getTime(), exercise, sets});
        }
        setHistory(entries);
    }, [db, workoutId, t])

    const getLabelForEntry = useCallback((sets: ExerciseSet[]) => sets.map((set) => {
        if (set.weight && set.reps) {
            return set.weight + " x " + set.reps;
        }
        if (set.reps) {
            return set.reps;
        }
        return t("set");
    }).join(", "), []);
    
    useEffect(() => {
        // effect triggers when following workout changes since when we stop a workout we want the history entry to show up
        fetchHistory();
    }, [followingWorkout, fetchHistory])
    return <Layout title={historyEntry?.workoutName || t("freeTraining")}><List sx={{width: '100%', height: '100%', bgcolor: 'background.paper'}}>
        {history.map((entry) =>  <ListItemButton key={entry.id} component="a">
            <ListItemAvatar>
                {!entry.exercise?.picture && <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>}
                {entry.exercise?.picture && <Avatar src={entry.exercise.picture} />}
            </ListItemAvatar>
            <ListItemText primary={entry.exercise?.name} secondary={getLabelForEntry(entry.sets)}/>
        </ListItemButton>)}
    </List>
    </Layout>;
}
