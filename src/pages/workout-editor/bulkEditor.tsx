import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {
    Autocomplete,
    Button,
    CircularProgress,
    createFilterOptions,
    Dialog,
    DialogContent,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {SettingsContext} from "../../context/settingsContext";
import defer from "../../utils/defer";
import {Exercise} from "../../models/exercise";
import {compareExercises} from "../../utils/comparators";
import {DBContext} from "../../context/dbContext";
import Typography from "@mui/material/Typography";
import getId from "../../utils/id";
import {ExerciseSet, SetType, WorkoutExercise} from "../../models/workout";

interface Row {
    id: number;
    exerciseName?: string;
    sets?: number;
    weight?: number;
    reps?: number;
    rest?: number;
}

const BulkEditor = () => {
    const { workoutId } = useParams();
    const {t} = useTranslation();
    const {db} = useContext(DBContext);

    const [rows, setRows] = useState<Row[]>([{id: new Date().getTime()}]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [snackbar, setSnackbar] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const {useLbs} = useContext(SettingsContext);
    const checkEmptyRow = () => {
        setRows((rows) => {
            const rs: Row[] = [];
            let empty = 0;
            rows.forEach((row) => {
                if (row.exerciseName || row.sets || row.weight || row.reps || row.rest) {
                    while (empty > 0) { rs.push({id: new Date().getTime()}); empty--; }
                    rs.push(row);
                } else {
                    empty++;
                }
            });
            rs.push({id: new Date().getTime()});
            return rs;
        })
    }
    useEffect(() => {
        db?.exercise.toArray().then((exercises) => {
            setExercises(exercises.sort(compareExercises));
        }).catch(() => {
            setExercises([]);
        });
    }, [db]);

    const commit = () => {
        if (!db) return;
        db.transaction("rw", [db.exerciseSet, db.workoutExercise, db.workout, db.exercise], async (trans) => {
            const workout = await db.workout.get(parseInt(workoutId || "1"));
            if (!workout) throw new Error("Couldn't find workout!");
            const weIds = workout?.workoutExerciseIds || [];
            for (let i = 0; i < rows.length - 1; i++) {
                let exercise: Exercise | undefined = (await db.table("exercise").where("name").equals(rows[i].exerciseName || "").toArray() || [{} as Exercise])[0];
                if (!exercise) {
                    exercise = {id: getId(), name: rows[i].exerciseName || "", tags: []};
                    await db.table("exercise").put(exercise);
                }
                const setIds = [];
                for (let setNumber = 1; setNumber <= rows[i].sets!; setNumber++) {
                    const set: ExerciseSet = {id: getId(), exerciseId: exercise!.id, weight: rows[i].weight, reps: rows[i].reps, rest: rows[i].rest, setNumber, type: SetType.STANDARD, date: new Date(), initial: true};
                    await db.table("exerciseSet").put(set);
                    setIds.push(set.id);
                }
                const workoutExercise: WorkoutExercise = { id: getId(), exerciseId: exercise!.id, setIds, initial: true }
                await db.table("workoutExercise").put(workoutExercise);
                weIds.push(workoutExercise.id);
            }
            await db.workout.put({...workout, workoutExerciseIds: weIds});

        }).then(() => {
            navigate(-1);
        }).catch((e) => { console.log(e); setSnackbar(t("somethingWentWrong"))}).finally(() => setSaving(false));

    }

    const save = () => {
        if (!db) return;
        for (let i = 0; i < rows.length - 1; i++) {
            if (!rows[i].exerciseName || !rows[i].sets || !rows[i].reps) {
                // validation errors
                setSnackbar(t("bulkEditor.checkErrors"));
                return;
            }
        }
        setSaving(true);
        commit();
    }

    const filter = createFilterOptions<string>();


    return <><Layout hideBack={saving} title={t("bulkEditor.title")} hideNav toolItems={<Button onClick={save} disabled={saving || rows.length === 1}>{t("bulkEditor.saveAll")}</Button>}>
        <TableContainer sx={{ minWidth: "100vw", maxHeight: "100%", overflowY: "auto" }} component={Paper}>
            <Table stickyHeader size="small">
            <TableHead>
                <TableRow>
                    <TableCell sx={{ minWidth: "60px" }}>
                        {t("bulkEditor.sets")}
                    </TableCell>
                    <TableCell sx={{ minWidth: "60px" }}>
                        {t("bulkEditor.reps")}
                    </TableCell>
                    <TableCell sx={{ minWidth: "60px" }}>
                        {t("bulkEditor.weight") + " (" + (useLbs ? "lbs)" : "kg)")}
                    </TableCell>
                    <TableCell sx={{ minWidth: "60px" }}>
                        {t("bulkEditor.rest") + " (s)"}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, idx) => <React.Fragment key={row.id}><TableRow>
                    <TableCell colSpan={5} sx={{border: 0, margin:0}}>
                        <Autocomplete disabled={saving} onChange={(ev,  val) => {
                            setRows((rs) => rs.map((v, i) => i === idx ? ({ ...v, exerciseName: val || undefined }) : v));
                            defer(checkEmptyRow)
                        }} filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;
                            // Suggest the creation of a new value
                            const isExisting = options.some((option) => inputValue.trim() === option);
                            if (inputValue.trim() !== '' && !isExisting) {
                                filtered.push(inputValue.trim());
                            }
                            return filtered;
                        }} selectOnFocus clearOnBlur handleHomeEndKeys freeSolo renderInput={(params) => <TextField {...params}  error={idx < rows.length - 1 && !row.exerciseName} variant="standard" placeholder={t("bulkEditor.exercise")} size="small" value={row.exerciseName}  />}  options={new Array(...new Set(exercises.map((it) => it.name)))}/>
                    </TableCell>
                    </TableRow><TableRow>
                    <TableCell>
                        <TextField disabled={saving} size="small" error={idx < rows.length - 1 && !row.sets} value={row.sets} onChange={(ev) => {
                            const val = parseInt(ev.target.value);
                            setRows((rs) => rs.map((v, i) => i === idx ? ({ ...v, sets: isNaN(val) || val <= 0 ? undefined : val }) : v));
                            defer(checkEmptyRow)
                        }} />
                    </TableCell>
                    <TableCell>
                        <TextField disabled={saving} size="small" error={idx < rows.length - 1 && !row.reps} value={row.reps} onChange={(ev) => {
                            const val = parseInt(ev.target.value);
                            setRows((rs) => rs.map((v, i) => i === idx ? ({ ...v, reps: isNaN(val) || val <= 0 ? undefined : val }) : v));
                            defer(checkEmptyRow)
                        }} />
                    </TableCell>
                    <TableCell>
                        <TextField disabled={saving} size="small" value={row.weight} onChange={(ev) => {
                            const val = parseFloat(ev.target.value);
                            setRows((rs) => rs.map((v, i) => i === idx ? ({ ...v, weight: isNaN(val) || val <= 0 ? undefined : val }) : v));
                            defer(checkEmptyRow)
                        }} />
                    </TableCell>
                    <TableCell>
                        <TextField disabled={saving} size="small" value={row.rest} onChange={(ev) => {
                            const val = parseInt(ev.target.value);
                            setRows((rs) => rs.map((v, i) => i === idx ? ({ ...v, rest: isNaN(val) || val <= 0 ? undefined : val }) : v));
                            defer(checkEmptyRow)
                        }} />
                    </TableCell>
                </TableRow></React.Fragment>)}
            </TableBody></Table>
        </TableContainer>

        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
    </Layout>{saving && <Dialog open><DialogContent sx={{ display: "flex", flexDirection: "row", gap: "24px"}}><CircularProgress size="24px" /><Typography>{t("saving")}</Typography></DialogContent></Dialog>}</>
}

export default BulkEditor;
