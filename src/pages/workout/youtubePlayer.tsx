/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
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
