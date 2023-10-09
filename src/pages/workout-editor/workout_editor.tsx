import React, {useCallback, useContext, useEffect, useState} from "react";
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
import {DBContext} from "../../context/dbContext";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {Exercise} from "../../models/exercise";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import {SpeedDialActionSx} from "../../utils/globalStyles";
import {useNavigate, useParams} from "react-router-dom";
import {ExerciseSet, Workout, WorkoutExercise} from "../../models/workout";
import {SettingsContext} from "../../context/settingsContext";
import {getLabelForSet} from "../../utils/setUtils";

interface Entry {
    workoutExercise: WorkoutExercise;
    exercise: Exercise;
    sets: ExerciseSet[];
}

export const WorkoutEditor = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const theme = useTheme();
    const [ showMenu, setShowMenu ] = useState(false);
    const [ notImplemented, setNotImplemented ] = useState(false);
    const speedDialActionSx = SpeedDialActionSx(theme);
    const navigate = useNavigate();
    const { workoutId } = useParams();
    const [ entries, setEntries ] = useState<Entry[]>([]);
    const [ workout, setWorkout ] = useState<Workout | undefined>(undefined);
    const { useLbs } = useContext(SettingsContext);

    const fetch = useCallback(async () => {
        debugger;
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
    }, [db, workoutId, setEntries]);

    useEffect(() => { fetch().then().catch((e) => {
    }) }, [ workoutId, fetch ]);

    return <Layout title={workout?.name ? workout.name : t("workoutEditor.title")}>
        <List sx={{width: '100%', height: 'calc(100% - 72px)', bgcolor: 'background.paper', overflow: "scroll"}}>
            {entries.map((entry) =>  <ListItemButton key={entry.workoutExercise.id} component="a" onClick={() => navigate("/workoutExercise/" + entry.workoutExercise.id.toString())}>
                <ListItemAvatar>
                    {!entry.exercise.picture && <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>}
                    {entry.exercise.picture && <Avatar src={entry.exercise.picture} />}
                </ListItemAvatar>
                <ListItemText primary={entry.exercise.name} secondary={entry.sets.map((set) => getLabelForSet(set, useLbs, t)).join(", ")}/>
            </ListItemButton>)}
        </List>
        <SpeedDial sx={{position: 'fixed', bottom: 72, right: 16, zIndex: 1}} ariaLabel="Actions"
                   icon={<SpeedDialIcon icon={<MenuIcon/>} openIcon={<CloseIcon/>}/>}
                   open={showMenu} onOpen={() => setShowMenu(true)}
                   onClose={() => setShowMenu(false)}>
            <SpeedDialAction tooltipOpen
                             icon={<AddIcon/>}
                             tooltipTitle={t("addExercise")}
                             sx={speedDialActionSx}
                             onClick={() => {
                                 setNotImplemented(true);
                                 setShowMenu(false);
                             }}
            />
        </SpeedDial>
        <Snackbar
            open={notImplemented}
            autoHideDuration={2000}
            onClose={() => setNotImplemented(false)}
            message={t("notImplemented")}
        />
    </Layout>;
}
