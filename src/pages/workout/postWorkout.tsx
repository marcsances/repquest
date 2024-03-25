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
import React, {useCallback, useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {useNavigate} from "react-router-dom";
import {WorkoutContext} from "../../context/workoutContext";
import {HistoryEntry} from "../../models/history";
import dayjs from "dayjs";
import getId from "../../utils/id";
import {compareSetHistoryEntries} from "../../utils/comparators";
import {DBContext} from "../../context/dbContext";
import Loader from "../../components/Loader";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Stack} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Typography from "@mui/material/Typography";
import {ExerciseSet} from "../../models/workout";
import {getLabelForSet} from "../../utils/setUtils";
import {SettingsContext} from "../../context/settingsContext";
import {useTranslation} from "react-i18next";
import {PB} from "../../models/pb";
import {Timer} from "@mui/icons-material";

const PostWorkout = () => {
    const navigate = useNavigate();
    const { postWorkout } = useContext(WorkoutContext);
    const [loading, setLoading] = useState(false);
    const {db} = useContext(DBContext);
    const {useLbs} = useContext(SettingsContext);
    const {t} = useTranslation();
    const [ history, setHistory ] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setLoading(true);
        (async () => {
            if (!db) return;
            const hist: Record<number, HistoryEntry> = {};
            const allSets = await db.exerciseSet.filter((it) => !it.initial && !!it.date).toArray();

            const sets = allSets.filter((it) => {
                const djs = dayjs(it.date).startOf("day");
                return djs.isSame(dayjs(new Date()).startOf("day"));
            });

            for (const set of sets) {
                if (set.exerciseId in hist) {
                    hist[set.exerciseId].sets.push(set);
                } else {
                    const exercise = await db.exercise.get(set.exerciseId);
                    if (!exercise) return;
                    hist[set.exerciseId] = { id: getId(), exercise, sets: [set]};
                }
            }
            setHistory(Object.values(hist).map((it) => ({...it, sets: it.sets.sort(compareSetHistoryEntries)})));
            setLoading(false);
        })();
    }, [db, postWorkout]);

    const getLabelForEntry = useCallback((sets: ExerciseSet[]) => sets.map((set) => getLabelForSet(set, useLbs, t, false)).join(", "), []);
    const bests: Record<string, PB[]> = {};
    postWorkout?.pbs.forEach(async (pb) => {
        bests[pb.exercise] = [...(pb.exercise in bests ? bests[pb.exercise] : []), pb];
    })
    const getLabel = (pbList: PB[]) => pbList.map((pb) => `${t(pb?.recordType || "")}: ${pb.value?.toString()}`).join(", ");

    const getDuration = () => {
        if (!postWorkout || !postWorkout.timeStarted || !postWorkout.timeFinished) return "";
        const startTime = new Date(postWorkout?.timeStarted).getTime();
        const currentTime = new Date(postWorkout?.timeFinished).getTime();
        const timeElapsed= currentTime - startTime;
        const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
        const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);
        return `${hours.toString()}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return <Layout hideNav hideBack title={t("workoutFinished")} leftToolItems={<IconButton sx={{mr: 2}} size="large" edge="start" color="inherit"
                    onClick={() => navigate("/")}><CloseIcon/></IconButton>}>
        {loading || !postWorkout ? <Loader/> : <Stack direction="column" sx={{height: "100%", overflowY: "scroll"}}>
            <Typography sx={{width: "100%", textAlign: "center", marginTop: "12px", marginBottom: "12px"}} variant="h5">{postWorkout.workoutName}&nbsp;-&nbsp;<Timer sx={{color: (theme) => theme.palette.success.main, position: "relative", top: "4px"}}/>&nbsp;{getDuration()}</Typography>
            {Object.keys(bests).length > 0 && <><ListSubheader>{t("account.records")}</ListSubheader>
            <List sx={{padding: "16px", flexShrink: 1, overflowY: "scroll"}}>
                {Object.keys(bests).map((key) =>
                    <ListItemText primary={bests[key][0].exercise}
                                  secondary={getLabel(bests[key])}/>)}
            </List>
            <ListSubheader>{t("exercises")}</ListSubheader></>}

            <List sx={{ width: "100%", flexShrink: 1, overflowY: "scroll"}}>
            {history.length > 0 ? history.map((entry) =>  <ListItemButton key={entry.id} component="a">
                <ListItemAvatar>
                    {!entry.exercise?.picture && <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>}
                    {entry.exercise?.picture && <Avatar src={entry.exercise.picture} />}
                </ListItemAvatar>
                <ListItemText primary={entry.exercise?.name} secondary={getLabelForEntry(entry.sets)}/>
            </ListItemButton>) : <Typography sx={{textAlign: "center", margin: "10px" }}>{ history.length === 0 ? t("noHistoryEntries") : ""}</Typography>}
        </List></Stack>}
    </Layout>
}

export default PostWorkout;
