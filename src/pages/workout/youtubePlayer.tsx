import React, {useContext} from "react";
import Layout from "../../components/layout";
import YoutubeEmbed from "../../components/youtube";
import {WorkoutContext} from "../../context/workoutContext";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";

export const YoutubePlayer = () => {
    const {focusedExercise} = useContext(WorkoutContext);
    const {t} = useTranslation();
    return <Layout title={focusedExercise ? focusedExercise.name : t("youtubePlayer")} hideNav>
        {focusedExercise && focusedExercise.yt_video && <YoutubeEmbed embedId={focusedExercise.yt_video}/>}
        {(!focusedExercise || !focusedExercise.yt_video) && <Typography>{t("noYoutube")}</Typography>}
    </Layout>;
}