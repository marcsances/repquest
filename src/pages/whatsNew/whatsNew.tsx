import React, {useContext} from "react";
import Layout from "../../components/layout";
import {WorkoutContext} from "../../context/workoutContext";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";

export const WhatsNew = () => {
    const {focusedExercise} = useContext(WorkoutContext);
    const {t} = useTranslation();
    return <Layout title={t("whatsNew")} hideNav>
        <Box sx={{padding: "20px"}}>
            <Typography variant="h4">WeightLog Version 0.1.21</Typography>
            <Typography variant="subtitle1">Released on 03/10/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <br/>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>New backup feature in design, currently supporting data export to a file.</li>
                <li>You can change the type of set from the workout window.</li>
                <li>Restored vibration support only for Android phones.</li>
                <li>Screen orientation is locked where supported.</li>
                <li>Added new workout menu with quick access to Youtube, exercise picture, and RPE/RIR settings.</li>
                <li>Wake lock feature can be accessed from the new workout menu in supported devices.</li>
                <li>Added change log.</li>
                <li>Increased internal timers to make smoother time animations.</li>
            </ul>
            <br/>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Rest timer no longer goes negative in the workout widget</li>
                <li>Fixed height of rest timer to a fixed size</li>
            </ul>
        </Box>
    </Layout>;
}
