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
import {useParams} from "react-router-dom";
import {ExerciseSet, SetType} from "../../models/workout";
import {SettingsContext} from "../../context/settingsContext";
import {getLabelForSet} from "../../utils/setUtils";
import SetEditor from "./set_editor";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";

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
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [entryIdx, setEntryIdx] = useState(0);

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
    }, [db, workoutExerciseId, setExercise, setSets]);

    useEffect(() => { setSets(undefined); fetch().then() }, [ workoutExerciseId, fetch ]);

    return <Layout title={exercise?.name ? exercise.name : t("workoutEditor.title")} hideNav toolItems={exercise ? <IconButton aria-label="menu" color="inherit" onClick={() => setSnackbar(t("notImplemented"))}><DeleteIcon /></IconButton> : undefined}>
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
                    setMenuAnchor(e.currentTarget);
                    setEntryIdx(idx);
                }}><MoreVertIcon /></IconButton>
            </ListItemButton>)}
            <ListItemButton component="a" onClick={() => {
                setSnackbar(t("notImplemented"))
            }}>
                <ListItemAvatar>
                    <Avatar><AddIcon /></Avatar>
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
        {sets !== undefined && <Menu
            anchorEl={menuAnchor}
            open={menuAnchor !== null}
            onClose={() => { setMenuAnchor(null)}}
        >
            {entryIdx > 0 && <MenuItem onClick={() => {}}><ListItemIcon>
                <KeyboardArrowUp />
            </ListItemIcon>
                <ListItemText>{t("actions.moveUp")}</ListItemText></MenuItem>}
            {entryIdx <= sets.length - 1 && <MenuItem onClick={() => {}}><ListItemIcon>
                <KeyboardArrowDown />
            </ListItemIcon>
                <ListItemText>{t("actions.moveDown")}</ListItemText></MenuItem>}
            <MenuItem onClick={() => {}}><ListItemIcon>
                <DeleteIcon />
            </ListItemIcon>
                <ListItemText>{t("delete")}</ListItemText></MenuItem>
        </Menu>}
        {editingSet && <SetEditor open set={editingSet} setNumber={setNumber} onChange={(set: ExerciseSet) => {
            db?.exerciseSet.put(set).then(() => {
                setSnackbar(t("saved"));
            }).catch(() => {
                setSnackbar(t("somethingWentWrong"))
            });
        }} onDelete={() => {}} onClose={() => setEditingSet(undefined)} />}
    </Layout>;
}
