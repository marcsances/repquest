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
import {Avatar, Box, Card, List, ListItem, ListItemAvatar, ListItemText, useMediaQuery} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Typography from "@mui/material/Typography";
import {ExerciseSet} from "../../models/workout";
import {getLabelForSet} from "../../utils/setUtils";
import {SettingsContext} from "../../context/settingsContext";
import {useTranslation} from "react-i18next";
import {PB} from "../../models/pb";
import {Download, Timer} from "@mui/icons-material";
import DomToImage from "dom-to-image";
import i18n from "i18next";
import {UserContext} from "../../context/userContext";

const PostWorkout = () => {
    const navigate = useNavigate();
    const { postWorkout } = useContext(WorkoutContext);
    const [loading, setLoading] = useState(false);
    const {db} = useContext(DBContext);
    const {useLbs} = useContext(SettingsContext);
    const {t} = useTranslation();
    const [ history, setHistory ] = useState<HistoryEntry[]>([]);
    const { user } = useContext(UserContext);
    const {theme: appTheme} = useContext(SettingsContext);

    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');

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


    return <Layout hideNav hideBack scroll nogrow title={t("workoutFinished")} leftToolItems={<IconButton sx={{mr: 2}} size="large" edge="start" color="inherit"
                    onClick={() => navigate("/")}><CloseIcon/></IconButton>} toolItems={<IconButton title={t("wrapped.download")} onClick={() => {
        const card = document.getElementById("wrappedCard");
        if (!card) return;
        DomToImage.toPng(card).then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = 'postWorkout.png';
            link.href = dataUrl;
            link.click();
        })
    }}><Download /></IconButton>} sx={{padding: "5px", width: "calc(100vw - 10px)", display: "flex", alignItems: "center", placeItems: "center", justifyContent: "center",  height: "calc(100vh - 12px)"}}>
        <Box sx={{padding: "10px"}}>{loading || !postWorkout ? <Loader/> : <Card id="wrappedCard" sx={{ placeSelf: "center", maxWidth: 345, padding: "16px", border: (theme) => "2px solid " + theme.palette.grey.A400, boxShadow: (theme) => "0px 0px 5px 0px " + theme.palette.grey.A400,
            backgroundImage: {dark: "url('/logofadenoback.png')", light: "url('/logofadelight.png')"}[appTheme] , backgroundSize: "contain", backgroundPosition: "right bottom", backgroundRepeat: "no-repeat"
        }}>
            <Box sx={{display: "flex", flexDirection: "column", backgroundColor: (postWorkout.color ? postWorkout.color + "40" : undefined), margin: "-16px", padding: "16px", marginBottom: 0}}>
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Typography sx={{fontSize: "12px", flex: "1 1 100%", width: "100%", textAlign: "left", textOverflow: "ellipsis"}}>{new Date().toLocaleDateString(i18n.language)}</Typography>
                <Typography sx={{fontSize: "12px", flex: "1 1 0", width: "100%", textAlign: "right", whiteSpace: "nowrap"}}><Timer sx={{fontSize: "12px", position: "relative", top: "2px"}}/>&nbsp;{getDuration()}</Typography>
            </Box>
            <Typography sx={{fontWeight: 600, width: "100%", textAlign: "left", textOverflow: "ellipsis"}}>{postWorkout.workoutName}</Typography>
            </Box>

            {Object.keys(bests).length > 0 &&
            <List dense sx={{flexShrink: 1, overflowY: "auto"}}>
                <ListItemText sx={{borderBottom: "1px solid white"}}  primary={t("account.records")}/>
                {Object.keys(bests).map((key) =>
                    <ListItemText primary={bests[key][0].exercise}
                                  secondary={getLabel(bests[key])}/>)}
            </List>}

            <List dense sx={{ width: "100%", flexShrink: 1, overflowY: "auto"}}>
                {Object.keys(bests).length > 0 && <ListItemText sx={{borderBottom: "1px solid white"}} primary={t("exercises")}/>}
                {history.length > 0 ? history.map((entry) =>  <ListItem key={entry.id} component="a">
                <ListItemAvatar>
                    {!entry.exercise?.picture && <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>}
                    {entry.exercise?.picture && <Avatar sx={{background: (theme) => theme.palette.background.paper }} src={entry.exercise.picture} />}
                </ListItemAvatar>
                <ListItemText primary={entry.exercise?.name} secondary={getLabelForEntry(entry.sets)}/>
                </ListItem>) : <Typography sx={{textAlign: "center", margin: "10px" }}>{ history.length === 0 ? t("noHistoryEntries") : ""}</Typography>}
            </List>
            <Box sx={{display: "flex", flexDirection: "row", gap: "16px", backgroundColor: (postWorkout.color ? postWorkout.color + "40" : undefined), margin: "-16px", padding: "16px", marginTop: 0}}>
                {user?.picture && <Avatar
                    sx={{width: "32px", height: "32px", alignSelf: "center"}}
                    src={user.picture}
                />}
                <Box sx={{display: "flex", flexDirection: "column", alignSelf: "center"}}>
                    {user?.name !== "Default User" && <Typography sx={{fontWeight: 600, width: "100%", textAlign: "left", textOverflow: "ellipsis"}}>{user?.name}</Typography>}
                    <Typography sx={{fontSize: "10px",width: "100%", textAlign: "left"}}>Powered by RepQuest - www.repquest.app</Typography>
                </Box>
            </Box>
        </Card>}</Box>
    </Layout>
}

export default PostWorkout;
