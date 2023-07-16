import React, {useContext, useState} from "react";
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

export const WorkoutPage = () => {
    const {
        timeStarted,
        followingWorkout,
        workoutExercises,
        focusedExercise,
        currentWorkout,
        currentSet,
        currentSetNumber,
        currentWorkoutExercise,
        currentWorkoutExerciseNumber,
        setCurrentWorkout,
        setCurrentSet,
        setCurrentSetNumber,
        setCurrentWorkoutExercise,
        setFocusedExercise,
        currentRestTime,
        setCurrentWorkoutExerciseNumber,
        saveSet,
        startRest,
        stopRest
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

    return currentRestTime ? <Rest /> : <Layout title={followingWorkout?.name || t("freeTraining")} hideNav
                   toolItems={focusedExercise?.yt_video ? <IconButton
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
                                    { /* TODO: implement history */ }
                                    <TableRow
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row" colSpan={6}>
                                            {"No implementado"}
                                        </TableCell>
                                    </TableRow>
                                    {focusedExercise && workoutExercises && workoutExercises.filter((it) => it.id === focusedExercise.id).flatMap((exercise) => [].map((set: ExerciseSet, idx) =>
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
            <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1}}>
                {currentWorkout?.workoutExerciseIds && setCurrentWorkoutExerciseNumber && currentWorkoutExerciseNumber > 0 &&
                    <IconButton aria-label="previous"
                                onClick={() => setCurrentWorkoutExerciseNumber(currentWorkoutExerciseNumber - 1)}>
                        <ArrowLeftIcon/>
                    </IconButton>}
                {currentWorkout?.workoutExerciseIds && setCurrentWorkoutExerciseNumber && currentWorkoutExerciseNumber < currentWorkout?.workoutExerciseIds.length - 1 &&
                    <IconButton aria-label="next"
                                onClick={() => setCurrentWorkoutExerciseNumber(currentWorkoutExerciseNumber + 1)}>
                        <ArrowRightIcon/>
                    </IconButton>}
            </Box>
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
            <Box sx={{flexGrow: 1}}/>
            <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}} sx={{alignSelf: "center", marginBottom: "24px"}}>
                <Fab color="primary" aria-label="add" onClick={save}>
                    <DoneIcon/>
                </Fab>
            </Stack>
        </Box>
    </Layout>;
}