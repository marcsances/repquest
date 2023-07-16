import React, {useCallback, useContext} from "react";
import Layout from "../../components/layout";
import {Box, Fab, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {WorkoutContext} from "../../context/workoutContext";
import StopIcon from '@mui/icons-material/Stop';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export const Rest = () => {
    const { t } = useTranslation();
    const { currentRestTime, setCurrentRestTime, stopRest } = useContext(WorkoutContext);
    const moreTime = useCallback(() => {
        if (!currentRestTime || !setCurrentRestTime) {return;}
        setCurrentRestTime(currentRestTime + 10);
    }, [currentRestTime, setCurrentRestTime]);
    const lessTime = useCallback(() => {
        if (!currentRestTime || !setCurrentRestTime) {return;}
        setCurrentRestTime(currentRestTime - 10);
    }, [currentRestTime, setCurrentRestTime]);

    return <Layout title={t("rest")} hideNav hideBack>
        <Box sx={{height: "100%", display: "flex", flexDirection: "column"}}>
            <Typography variant="h1" sx={{alignSelf: "center"}}>
                {currentRestTime}
            </Typography>
            <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}} sx={{alignSelf: "center", marginBottom: "24px"}}>
                <Fab color="primary" aria-label="stop" onClick={stopRest}>
                    <StopIcon/>
                </Fab>
                <Fab color="primary" aria-label="add" onClick={moreTime}>
                    <AddIcon/>
                </Fab>
                <Fab color="primary" aria-label="add" onClick={lessTime}>
                    <RemoveIcon/>
                </Fab>
            </Stack>
        </Box>
    </Layout>
}
