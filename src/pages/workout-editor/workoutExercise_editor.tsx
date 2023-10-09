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
import {ExerciseSet, SetType, WorkoutExercise} from "../../models/workout";
import {SettingsContext} from "../../context/settingsContext";
import {getLabelForSet} from "../../utils/setUtils";

export const WorkoutExerciseEditor = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const theme = useTheme();
    const [ showMenu, setShowMenu ] = useState(false);
    const [ notImplemented, setNotImplemented ] = useState(false);
    const speedDialActionSx = SpeedDialActionSx(theme);
    const navigate = useNavigate();
    const { workoutExerciseId } = useParams();
    const [ workoutExercise, setWorkoutExercise ] = useState<WorkoutExercise | undefined>(undefined);
    const [ exercise, setExercise ] = useState<Exercise | undefined>(undefined);
    const [ sets, setSets ] = useState<ExerciseSet[]>([]);
    const { useLbs } = useContext(SettingsContext);

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
        debugger;
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
        setWorkoutExercise(workoutExercise);
        setExercise(maybeExercise);
        setSets(sets);
    }, [db, workoutExerciseId, setWorkoutExercise, setExercise, setSets]);

    useEffect(() => { fetch().then().catch((e) => {
    }) }, [ workoutExerciseId, fetch ]);

    return <Layout title={exercise?.name ? exercise.name : t("workoutEditor.title")}>
        <List sx={{width: '100%', height: 'calc(100% - 72px)', bgcolor: 'background.paper', overflow: "scroll"}}>
            {sets.map((set, idx) =>  <ListItemButton key={idx + set.id.toString()} component="a" onClick={() => navigate("/set/" + set.id.toString())}>
                <ListItemAvatar>
                    {!exercise?.picture && <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>}
                    {exercise?.picture && <Avatar src={exercise.picture} />}
                </ListItemAvatar>
                <ListItemText primary={getSetType(set)} secondary={getLabelForSet(set, useLbs, t)}/>
            </ListItemButton>)}
        </List>
        <SpeedDial sx={{position: 'fixed', bottom: 72, right: 16, zIndex: 1}} ariaLabel="Actions"
                   icon={<SpeedDialIcon icon={<MenuIcon/>} openIcon={<CloseIcon/>}/>}
                   open={showMenu} onOpen={() => setShowMenu(true)}
                   onClose={() => setShowMenu(false)}>
            <SpeedDialAction tooltipOpen
                             icon={<AddIcon/>}
                             tooltipTitle={t("addSet")}
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
