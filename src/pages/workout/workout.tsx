import React, {useContext, useEffect, useMemo, useState} from "react";
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
    TableRow,
    useTheme
} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import YouTubeIcon from '@mui/icons-material/YouTube';
import DoneIcon from '@mui/icons-material/Done';
import Parameter from "../../components/parameter";
import SetParameter from "../../components/setParameter";
import {useTranslation} from "react-i18next";
import {WorkoutContext} from "../../context/workoutContext";
import {DBContext} from "../../context/dbContext";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {useNavigate} from "react-router-dom";
import {ExerciseSet} from "../../models/workout";
import {Rest} from "./rest";
import StopIcon from "@mui/icons-material/Stop";

export const WorkoutPage = () => {
    const {
        timeStarted,
        followingWorkout,
        focusedExercise,
        currentWorkout,
        currentSet,
        currentSetNumber,
        currentWorkoutExercise,
        currentWorkoutExerciseNumber,
        setCurrentSet,
        setCurrentSetNumber,
        currentWorkoutHistory,
        currentRestTime,
        setCurrentWorkoutExerciseNumber,
        saveSet,
        stopWorkout,
    } = useContext(WorkoutContext);
    const {db} = useContext(DBContext);
    const [viewHistory, setViewHistory] = useState(false);
    const {t} = useTranslation();
    const navigate = useNavigate();


    const save = async () => {
        if (!currentSet || !saveSet) return;
        return saveSet({
            ...currentSet,
            id: Date.now()
        });
    }

    const stop = async () => {
        if (!stopWorkout) return;
        stopWorkout().then(() => navigate("/"));
    }

    const [ history, setHistory ] = useState<ExerciseSet[]>([]);

    useEffect(() => {
        const getData = async () => {
            if (currentWorkoutHistory && db && currentWorkoutExercise) {
                const exercises = await db.workoutExercise.where("id").anyOf(currentWorkoutHistory.workoutExerciseIds).filter((it) => it.exerciseId === focusedExercise?.id).toArray();
                if (exercises) {
                    const sets = [];
                    for (const exercise of exercises) {
                        sets.push(...await db.exerciseSet.where("id").anyOf(exercise.setIds).toArray());
                    }
                    sets.push(...await db.exerciseSet.where("id").anyOf(currentWorkoutExercise.setIds.slice(0, currentSetNumber - 1)).toArray());
                    return sets;
                }
            }
        }
        getData().then((result) => {
            setHistory(result || []);
        });
    }, [db, currentWorkoutHistory, focusedExercise, currentSetNumber, currentWorkoutExercise]);

    const [time, setTime] = useState<Date>();

    const theme = useTheme();

    const workoutLabel = useMemo(() => {
        time?.getTime(); /* just for exhaustive deps to not warn */
        if (!timeStarted || !focusedExercise) return;
        const startTime = timeStarted.getTime();
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - startTime;
        const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
        const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);
        return `${focusedExercise.name} - ${hours.toString()}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, [focusedExercise, time, timeStarted]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [setTime]);

    return currentRestTime ? <Rest /> : <Layout title={followingWorkout?.name || t("freeTraining")} hideNav
                   toolItems={focusedExercise?.yt_video ? <IconButton
                       color="inherit"
                       aria-label="menu"
                       sx={{mr: 2}}
                       onClick={() => navigate("/youtube")}
                   >
                       <YouTubeIcon/>
                   </IconButton> : <></>}>
        <Box sx={{height: "calc(100% - 24px)", display: "flex", flexDirection: "column"}}>
            <Paper variant="outlined">
                <CardActionArea onClick={() => setViewHistory(!viewHistory)}>
                    {!viewHistory && <Box><CardMedia
                        sx={{height: "25vh"}}
                        image={focusedExercise?.picture}
                        title={focusedExercise?.name}
                    />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {focusedExercise?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {currentSet?.cues}
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
                                    {history && history.map((set: ExerciseSet, idx) =>
                                        <TableRow
                                            key={set.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                {t("today")}
                                            </TableCell>
                                            <TableCell align="right">{(idx + 1).toString(10)}</TableCell>
                                            <TableCell align="right">{set.weight}</TableCell>
                                            <TableCell align="right">{set.reps}</TableCell>
                                            <TableCell align="right">{set.rpe}</TableCell>
                                            <TableCell align="right">{set.rir}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>}
                </CardActionArea>
            </Paper>
            <Box sx={{overflow: "scroll", flexShrink: 1}}>
            <SetParameter name={t("set")} value={currentSetNumber} min={1} max={currentWorkoutExercise?.setIds.length}
                          incrementBy={1} onChange={(setNumber) => { if (setCurrentSetNumber) setCurrentSetNumber(setNumber)}}/>
            {currentSet?.weight &&
                <Parameter name={t("weight")} unit="kg" value={currentSet?.weight} min={0} incrementBy={2.5}
                           allowDecimals onChange={(weight) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, weight})}} />}
            {currentSet?.reps && <Parameter name={t("reps")} value={currentSet?.reps} min={1} incrementBy={1}
                                            onChange={(reps) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, reps})}}/>}
            {currentSet?.rpe && <Parameter name={t("rpe")} value={currentSet?.rpe} min={0} max={10} incrementBy={1}
                                           onChange={(rpe) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, rpe})}}/>}
            {currentSet?.rir && <Parameter name={t("rir")} value={currentSet?.rir} min={0} incrementBy={1}
                                           onChange={(rir) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, rir})}}/>}
            {currentSet?.rest &&
                <Parameter name={t("rest")} unit="s" value={currentSet?.rest} min={0} incrementBy={10}
                           onChange={(rest) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, rest})}}/>}
            </Box>
            <Box sx={{flexGrow: 1}}/>
            <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}} sx={{alignSelf: "center", marginTop: "10px"}}>
                {currentWorkout?.workoutExerciseIds && setCurrentWorkoutExerciseNumber && currentWorkoutExerciseNumber > 0 &&
                    <Fab aria-label="previous" color="primary"
                         onClick={() => setCurrentWorkoutExerciseNumber(currentWorkoutExerciseNumber - 1)}>
                        <ArrowLeftIcon/>
                    </Fab>}
                <Fab color="success" aria-label="add" onClick={save}>
                    <DoneIcon/>
                </Fab>
                <Fab aria-label="stop" color="error"
                     onClick={() => {if (window.confirm(t("stopWorkout") + "?")) stop().then()}}>
                    <StopIcon/>
                </Fab>
                {currentWorkout?.workoutExerciseIds && setCurrentWorkoutExerciseNumber && currentWorkoutExerciseNumber < currentWorkout?.workoutExerciseIds.length - 1 &&
                    <Fab aria-label="next" color="primary"
                                onClick={() => setCurrentWorkoutExerciseNumber(currentWorkoutExerciseNumber + 1)}>
                        <ArrowRightIcon/>
                    </Fab>}

            </Stack>
        </Box>
    </Layout>;
}