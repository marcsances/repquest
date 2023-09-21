import React, {useCallback, useContext, useEffect, useMemo} from "react";
import Layout from "../../components/layout";
import {Box, CircularProgress, Fab, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {WorkoutContext} from "../../context/workoutContext";
import StopIcon from '@mui/icons-material/Stop';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {SettingsContext} from "../../context/settingsContext";

export const Rest = () => {
    const { t } = useTranslation();
    const { restStarted, restTime, setRestTime, stopRest, time, focusedExercise, currentSet } = useContext(WorkoutContext);
    const { useLbs } = useContext(SettingsContext);
    const moreTime = useCallback(() => {
        if (!restTime || !setRestTime) {return;}
        setRestTime(restTime + 10);
    }, [restTime, setRestTime]);
    const lessTime = useCallback(() => {
        if (!restTime || !setRestTime) {return;}
        setRestTime(restTime - 10);
    }, [restTime, setRestTime]);

    const currentRestTime = useMemo(() => restStarted ? restTime - (Date.now() - restStarted?.getTime()) / 1000 : 0, [time, restStarted, restTime]);

    useEffect(() => {
        if (currentRestTime <= 0 && stopRest) {
            stopRest();
        }
    }, [currentRestTime, time, stopRest]);

    return <Layout title={t("rest")} hideNav hideBack>
        <Box sx={{height: "100%", display: "flex", flexDirection: "column"}}>
            <Box sx={{flexGrow: 1}}/>
            <CircularProgress variant="determinate" value={currentRestTime * 100 / restTime} sx={{alignSelf: "center", margin: "12px"}} size="8rem" />
            <Typography variant="h1" sx={{alignSelf: "center"}}>
                {Math.floor(currentRestTime)} s
            </Typography>
            <Typography variant="h5" sx={{alignSelf: "center", textAlign: "center", color: "rgb(192, 192, 192)"}}>
                {focusedExercise?.name}
            </Typography>
            {currentSet && currentSet.weight && <Typography variant="h5" sx={{alignSelf: "center", textAlign: "center", color: "rgb(192, 192, 192)"}}>
                {t("weight")}: {currentSet?.weight} {useLbs ? "lbs" : "kg"}
            </Typography>}
            <Box sx={{flexGrow: 1}}/>
            <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}} sx={{alignSelf: "center", marginBottom: "24px"}}>
                <Fab color="primary" aria-label="add" onClick={lessTime}>
                    <RemoveIcon/>
                </Fab>
                <Fab color="error" aria-label="stop" onClick={stopRest}>
                    <StopIcon/>
                </Fab>
                <Fab color="primary" aria-label="add" onClick={moreTime}>
                    <AddIcon/>
                </Fab>
            </Stack>
        </Box>
    </Layout>
}
