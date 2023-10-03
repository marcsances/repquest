import React, {useContext} from "react";
import Layout from "../../components/layout";
import {WorkoutContext} from "../../context/workoutContext";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";

export const PictureViewer = () => {
    const {focusedExercise} = useContext(WorkoutContext);
    const {t} = useTranslation();
    return <Layout title={focusedExercise ? focusedExercise.name : t("actions.viewPicture")} hideNav>
        {focusedExercise && focusedExercise.picture && <img src={focusedExercise.picture} style={{  objectFit: "contain", width: "100%", height: "auto", maxWidth: "100%", maxHeight: "calc(100% - 16px)"}}/>}
        {(!focusedExercise || !focusedExercise.picture) && <Typography>{t("noPicture")}</Typography>}
    </Layout>;
}
