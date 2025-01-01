/*
    This file is part of WeightLog.

    WeightLog is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WeightLog is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WeightLog.  If not, see <https://www.gnu.org/licenses/>.
 */
import {useTranslation} from "react-i18next";
import Layout from "../components/layout";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    useMediaQuery
} from "@mui/material";
import {UserContext} from "../context/userContext";
import React, {useContext, useEffect, useState} from "react";
import DomToImage from "dom-to-image";
import defer from "../utils/defer";
import {DBContext} from "../context/dbContext";
import Loader from "../components/Loader";
import {SettingsContext} from "../context/settingsContext";
import {getOneRm} from "../utils/oneRm";
import {ExerciseTag} from "../models/exercise";
import {t} from "i18next";
import IconButton from "@mui/material/IconButton";
import {Download} from "@mui/icons-material";

function countInstances<T extends number | string>(elements: T[]) {
    const instanceDict: Record<T, number> = {} as Record<T, number>;
    elements.forEach(element => {
        if (element in instanceDict) {
            instanceDict[element] = instanceDict[element] + 1;
        } else {
            instanceDict[element] = 1;
        }
    })
    return instanceDict;
}

function largestEntry<T>(elements: T[], idKey: keyof T, valueKey: keyof T) {
    const instanceDict: Record<number, number> = {} as Record<number, number>;
    elements.forEach(element => {
        const key = element[idKey] as number;
        if (key as number in instanceDict && element[valueKey] as number > instanceDict[key]) {
            instanceDict[element[idKey] as number] = (element[valueKey] as number);
        } else {
            instanceDict[element[idKey] as number] = element[valueKey] as number;
        }
    })
    return instanceDict;
}

const Wrapped = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [hideButton, setHideButton] = useState(false);
    const [loading, setLoading] = useState(true);
    const {db} = useContext(DBContext);
    const {useLbs, oneRm} = useContext(SettingsContext);
    const wrappedYear = (new Date().getFullYear() + (new Date().getMonth() === 0 ? -1 : 0));

    const [entries, setEntries] = useState<{title: string, value: string}[]>([]);

    useEffect(() => {(async () => {
        if (!db) return;
        const sets = (await db.exerciseSet.toArray()).filter((set) => !set.initial && set.date && set.date?.getTime() >= new Date(wrappedYear, 0, 1).getTime() && set.date?.getTime() < new Date(wrappedYear + 1, 0, 1).getTime());
        if (sets.length === 0) {
            setLoading(false);
            setEntries([{title: t("wrapped.noData"), value: ""}]);
            return;
        }
        const setDates = new Set(sets.map((set) => set.date!.getDate().toString() + "-" + (set.date!.getMonth() + 1).toString() + "-" + set.date!.getFullYear().toString()));
        const totalWorkouts = setDates.size;
        const totalWeight = sets.filter((set) => set.weight).map((set) => set.weight! * (set.reps || 1)).reduce((w1, w2) => w1 + w2, 0);
        const exerciseDict = Object.fromEntries(Object.entries(countInstances(sets.map((set) => set.exerciseId))).sort((a, b) => b[1] - a[1]));
        const favoriteExercise = (await db.exercise.get(parseInt(Object.entries(exerciseDict)[0][0])))
        const weightDict = Object.fromEntries(Object.entries(largestEntry(sets.filter((set) => set.weight).map((set) => ({exerciseId: set.exerciseId, oneRm: getOneRm(set.weight!, set.reps || 1, oneRm)})), "exerciseId", "oneRm")).sort((a, b) => b[1] - a[1]));
        const heaviestExercise = Object.entries(weightDict).length > 0 ? (await db.exercise.get(parseInt(Object.entries(weightDict)[0][0]))) : undefined;
        const bodyPartTags = Object.values(ExerciseTag).filter((it) => typeof it !== "string").map((it) => it as unknown as ExerciseTag).filter((it) => it >= ExerciseTag.CHEST);
        const bodyPartDict: Record<number, number> = {};
        for (const tag of bodyPartTags){
            bodyPartDict[tag] = 0;
            const exerciseList = (await db.exercise.where("tags").equals(tag).toArray()).map((it) => it.id);
            for (const exercise of Object.keys(exerciseDict).filter((key) => exerciseList.includes(parseInt(key)))) {
                bodyPartDict[tag] += exerciseDict[exercise];
            }
        }
        const sortedBodyPartDict = Object.fromEntries(Object.entries(bodyPartDict).sort((a, b) => b[1] - a[1]));

        setEntries([
            {title: t("wrapped.totalWorkouts"), value: totalWorkouts.toString() + " " + t("wrapped.workouts")},
            {title: t("wrapped.totalWeight"), value: totalWeight.toString() + (useLbs  ? " lbs" : " kg")},
            {title: t("wrapped.totalSets"), value: sets.length.toString() + " " + t("wrapped.sets")},
            {title: t("wrapped.favoriteExercise"), value: favoriteExercise?.name + " (" + Object.entries(exerciseDict)[0][1] + " " + t("wrapped.sets") + ")"},
            ...(Object.entries(weightDict).length > 0 ? [{title: t("wrapped.heaviestExercise"), value: heaviestExercise?.name + " (1RM: " + Object.entries(weightDict)[0][1] + " " + (useLbs ? "lbs" : "kg") + ")"}] : []),
            ...(Object.entries(sortedBodyPartDict).length > 0 ? [{title: t("wrapped.favoriteMuscleGroup"), value: t("tags." + ExerciseTag[parseInt(Object.entries(sortedBodyPartDict)[0][0])].toLowerCase()) + " (" + Object.entries(sortedBodyPartDict)[0][1] + " " + t("wrapped.sets") + ")"}] : []),
            {title: "", value: ""},
            {title: "", value: t("wrapped.thanks").replace("%Y", wrappedYear.toString())},
        ]);
        setLoading(false);
    })().then()}, [db]);
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');

    return <Layout toolItems={<IconButton title={t("wrapped.download")} onClick={() => {
        const card = document.getElementById("wrappedCard");
        if (!card) return;
        DomToImage.toPng(card).then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = 'wrapped.png';
            link.href = dataUrl;
            link.click();
        })
    }}><Download /></IconButton>} scroll nogrow title={t("wrapped.menuEntry")} sx={{padding: "20px", width: "calc(100vw - 40px)", display: "flex", alignItems: "center", placeItems: "center", justifyContent: "center",  height: "calc(100vh - 96px)"}}>
        {loading && <Loader prompt={t("wrapped.generating")} />}
        {!loading && <Box sx={{paddingBottom: "20px"}}><Card id="wrappedCard" sx={{ maxWidth: 345, padding: "16px", border: "2px solid #2020aa", background: "#151595", boxShadow: "0px 0px 15px 0px rgba(21,60,149,0.9)",
                backgroundImage: "url('/logofade.png')", backgroundSize: "contain", backgroundPosition: "right bottom", backgroundRepeat: "no-repeat"
        }}>
            {user?.picture && <Avatar
                sx={{width: isMini ? "64px" : "96px", height: isMini ? "64px" : "96px", placeSelf: "center"}}
                src={user.picture}
            />}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: "white", width: "100%", textAlign: "center"}}>
                    {(user?.name === "Default User" ? t("wrapped.wrappedTitleNoUserName") : t("wrapped.wrappedTitle")).replace("%U", user?.name || "").replace("%Y", (new Date().getFullYear() + (new Date().getMonth() === 0 ? -1 : 0)).toString()) }
                </Typography>
            </CardContent>
            <Grid container spacing={1}>
                {entries.map((entry) => <Grid key={entry.title + entry.value} item xs={12} md={6}><Box sx={{display: "flex", flexDirection: "column"}}>
                    <Typography sx={{flexGrow: 1, color: "white", fontSize: "12px"}}>{entry.title}</Typography>
                    <Typography sx={{color: "white", fontWeight: 600}}>{entry.value}</Typography>
                </Box></Grid>)}
            </Grid>
        </Card></Box>}
    </Layout>
}

export default Wrapped;
