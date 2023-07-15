import React, {useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {
    Box,
    CardActionArea,
    CardContent,
    CardMedia,
    Fab,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import YouTubeIcon from '@mui/icons-material/YouTube';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import Parameter from "../../components/parameter";
import SetParameter from "../../components/setParameter";
import {useTranslation} from "react-i18next";
import {WorkoutContext} from "../../context/workoutContext";
import {DBContext} from "../../context/dbContext";
import {ExerciseSet, Workout, WorkoutExercise} from "../../models/workout";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {useNavigate} from "react-router-dom";

export const WorkoutPage = () => {
    const {timeStarted, followingWorkout, workoutExercises, focusedExercise, focusExercise} = useContext(WorkoutContext);
    const {db} = useContext(DBContext);
    const [viewHistory, setViewHistory] = useState(false);
    const {t} = useTranslation();
    const [currentWorkout, setCurrentWorkout] = useState<Workout | undefined>(undefined);
    const [currentSet, setCurrentSet] = useState<ExerciseSet | undefined>(undefined);
    const [currentSetNumber, setCurrentSetNumber] = useState(1);
    const [currentWorkoutExercise, setCurrentWorkoutExercise] = useState<WorkoutExercise | undefined>(undefined);
    const [currentWorkoutExerciseNumber, setCurrentWorkoutExerciseNumber] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!followingWorkout) { setCurrentWorkout(undefined); return; }
        db?.workout.get(followingWorkout.id).then((workout) => {
            if (workout) {
                setCurrentWorkout(workout);
            }
        });
    }, [followingWorkout, setCurrentWorkout, db]);

    useEffect(() => {
        if (!currentWorkout) { setCurrentWorkoutExercise(undefined); return; }
        db?.workoutExercise.get(currentWorkout.workoutExerciseIds[currentWorkoutExerciseNumber]).then((workoutExercise) => {
            if (workoutExercise) {
                setCurrentWorkoutExercise(workoutExercise);
            }
        });
    }, [currentWorkout, currentWorkoutExerciseNumber, setCurrentWorkoutExercise, db]);

    useEffect(() => {
        if (!currentWorkoutExercise) { setCurrentSet(undefined); return; }
        db?.exerciseSet.get(currentWorkoutExercise.setIds[currentSetNumber - 1]).then((set) => {
            if (set) {
                setCurrentSet(set);
            }
        });
    }, [currentWorkoutExercise, currentSetNumber, setCurrentSet, db]);

    useEffect(() => {
        if (!currentWorkoutExercise) { return; }
        db?.exercise.get(currentWorkoutExercise.exerciseId).then((exercise) => {
            if (exercise && focusExercise) {
                focusExercise(exercise);
            }
        });
    }, [currentWorkoutExercise, focusExercise, db]);

    return <Layout title={followingWorkout?.name || t("freeTraining")} hideNav toolItems={focusedExercise?.yt_video ? <IconButton
        color="inherit"
        aria-label="menu"
        sx={{mr: 2}}
        onClick={() => navigate("/youtube")}
    >
        <YouTubeIcon/>
    </IconButton> : <></>}>
        <Box sx={{height: "100%", display: "flex", flexDirection: "column"}}>
            <Paper variant="outlined">
                <CardActionArea onClick={() => setViewHistory(!viewHistory)}>
                    {!viewHistory && <Box sx={{maxHeight: "235px"}}><CardMedia
                        sx={{height: 140}}
                        image={focusedExercise?.picture}
                        title={focusedExercise?.name}
                    />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {focusedExercise?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Notas del ejercicio
                            </Typography>
                        </CardContent></Box>}
                    {viewHistory &&
                        <TableContainer component={Paper} sx={{flexGrow: 1, maxHeight: "235px"}}>
                            <Table size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>&nbsp;</TableCell>
                                        <TableCell align="right">{t("set")}</TableCell>
                                        <TableCell align="right">{t("weight")}</TableCell>
                                        <TableCell align="right">{t("reps")}</TableCell>
                                        <TableCell align="right">{t("rpe")}</TableCell>
                                        <TableCell align="right">{t("rir")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {focusedExercise && workoutExercises.filter((it) => it.id === focusedExercise.id).flatMap((exercise) => exercise.sets.map((set, idx) =>
                                        <TableRow
                                            key={set.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                {"Hoy"}
                                            </TableCell>
                                            <TableCell align="right">{(idx + 1).toString(10)}</TableCell>
                                            <TableCell align="right">{set.weight}</TableCell>
                                            <TableCell align="right">{set.reps}</TableCell>
                                            <TableCell align="right">{set.rpe}</TableCell>
                                            <TableCell align="right">{set.rir}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>}
                </CardActionArea>
            </Paper>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                {currentWorkout?.workoutExerciseIds && currentWorkoutExerciseNumber > 0 && <IconButton aria-label="previous" onClick={() => setCurrentWorkoutExerciseNumber((prevNumber) => prevNumber - 1)}>
                    <ArrowLeftIcon />
                </IconButton>}
                {currentWorkout?.workoutExerciseIds && currentWorkoutExerciseNumber < currentWorkout?.workoutExerciseIds.length - 1 && <IconButton aria-label="next"onClick={() => setCurrentWorkoutExerciseNumber((prevNumber) => prevNumber + 1)}>
                    <ArrowRightIcon />
                </IconButton>}
            </Box>
            <SetParameter name={t("set")} value={currentSetNumber} min={1} max={currentWorkoutExercise?.setIds.length} incrementBy={1} onChange={(setNumber) => setCurrentSetNumber(setNumber)}/>
            {currentSet?.weight && <Parameter name={t("weight")} unit="kg" value={currentSet?.weight} min={0} incrementBy={2.5} allowDecimals/>}
            {currentSet?.reps && <Parameter name={t("reps")} value={currentSet?.reps} min={1} incrementBy={1}/>}
            {currentSet?.rpe && <Parameter name={t("rpe")} value={currentSet?.rpe} min={0} max={10} incrementBy={1}/>}
            {currentSet?.rir && <Parameter name={t("rir")} value={currentSet?.rir} min={0} incrementBy={1}/>}
            {currentSet?.rest && <Parameter name={t("rest")} unit="s" value={currentSet?.rest} min={0} incrementBy={10}/>}
            <Box sx={{flexGrow: 1}}/>
            <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}} sx={{alignSelf: "center", marginBottom: "24px"}}>
                <Fab color="primary" aria-label="add">
                    <DoneIcon/>
                </Fab>
            </Stack>
        </Box>
    </Layout>;
}