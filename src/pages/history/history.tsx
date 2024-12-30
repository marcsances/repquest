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
import {useTranslation} from "react-i18next";
import {DBContext} from "../../context/dbContext";
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Slide,
    useMediaQuery
} from "@mui/material";
import {ArrowBack, ArrowForward, Today} from "@mui/icons-material";
import {DateCalendar, PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {ExerciseSet} from "../../models/workout";
import {compareSetHistoryEntries} from "../../utils/comparators";
import getId from "../../utils/id";
import IconButton from "@mui/material/IconButton";
import Loader from "../../components/Loader";
import Typography from "@mui/material/Typography";
import {getLabelForSet} from "../../utils/setUtils";
import {SettingsContext} from "../../context/settingsContext";
import {HistoryEntry} from "../../models/history";


function ServerDay(props: PickersDayProps<Dayjs> & { daysWithWorkouts?: number[] }) {
    const { daysWithWorkouts = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
        !props.outsideCurrentMonth && daysWithWorkouts.includes(props.day.startOf("day").toDate().getTime());

    return (
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} sx={{backgroundColor: (theme) => isSelected ? theme.palette.success.main : undefined, color: isSelected ? "black" : undefined}} />
    );
}

export const HistoryPage = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const {useLbs} = useContext(SettingsContext);
    const [showCalendar, setShowCalendar] = useState(false);
    const [ date, setDate ] = useState(dayjs(new Date()));
    const [ history, setHistory ] = useState<HistoryEntry[]>([]);
    const [ daysWithWorkouts, setDaysWithWorkouts ] = useState<number[]>([]);
    const [loading, setLoading ] = useState(false);
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');

    useEffect(() => {
        (async () => {
            if (!db) return;
            const allSets = await db.exerciseSet.filter((it) => !it.initial && !!it.date).toArray();
            const daysWith: number[] = [];
            allSets.forEach((it) => {
                const djs = dayjs(it.date).startOf("day");
                const dt  = djs.toDate().getTime();
                if (!daysWith.includes(dt)) {
                    daysWith.push(dt);
                }
            });
            setDaysWithWorkouts(daysWith);
            if (daysWith.length > 0) {
                const newDate = daysWith.sort().reverse()[0];
                setDate(dayjs(new Date(newDate)));
            }
        })();
    }, [db]);

    useEffect(() => {
        setLoading(true);
        (async () => {
            if (!db) return;
            const hist: Record<number, HistoryEntry> = {};
            const allSets = await db.exerciseSet.filter((it) => !it.initial && !!it.date).toArray();

            const sets = allSets.filter((it) => {
                const djs = dayjs(it.date).startOf("day");
                return djs.isSame(date.startOf("day"));
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
    }, [db, date]);

    const prevDay = () => {
        const time = date.toDate().getTime();
        const closest = daysWithWorkouts.filter((it) => it < time).reduce((d1, d2) => d1 === time || (time - d2 < time - d1) ? d2 : d1, time);
        setDate(dayjs(new Date(closest)));
    }

    const nextDay = () => {
        const time = date.toDate().getTime();
        const closest = daysWithWorkouts.filter((it) => it > time).reduce((d1, d2) => d1 === time || (d2 - time < d1 - time) ? d2 : d1, time);
        setDate(dayjs(new Date(closest)));
    }

    const getLabelForEntry = useCallback((sets: ExerciseSet[]) => sets.map((set) => getLabelForSet(set, useLbs, t, false)).join(", "), []);

    return <Layout hideNav title={t("history")} toolItems={<IconButton color="inherit" onClick={() => setDate(dayjs(new Date()))}><Today/></IconButton>}><Box sx={{width: '100%', height: 'calc(100% - 16px)', display: "flex", alignItems: "center", flexDirection: "column", overflowY: "auto", overflowX: "hidden", paddingTop: "8px"}}>
        <Slide direction="down" in={showCalendar} mountOnEnter unmountOnExit style={{flexGrow: 1}}>
            <DateCalendar views={["day"]} value={date} onChange={(d) => { setDate(d); setShowCalendar(false) }}
                          slots={{
                              day: ServerDay,
                          }}
                          slotProps={{
                              day: {
                                  daysWithWorkouts,
                              } as any,
                          }}/>
        </Slide>
        <ButtonGroup sx={{width: "calc(100% - 16px)", height: "32px", display: "flex", flexShrink: 1}} variant="contained" aria-label="Basic button group">
            <Button sx={{flexShrink: 1, height: "32px"}} onClick={() => prevDay()}><ArrowBack/></Button>
            <Button sx={{flexGrow: 1, height: "32px"}} variant={showCalendar ? "outlined" : "contained"} onClick={() => setShowCalendar((prev) => !prev)}>{date.format("L")}</Button>
            <Button sx={{flexShrink: 1, height: "32px"}} onClick={() => nextDay()}><ArrowForward/></Button>
        </ButtonGroup>
        <List sx={{ width: "100%", maxHeight: showCalendar ? "calc(100vh - 450px)"  : undefined, overflowY: "scroll"}}>
            {loading && <Loader/>}
            {!loading && <>{history.length > 0 && (!showCalendar || !isMini) ? history.map((entry) =>  <ListItemButton key={entry.id} component="a">
                <ListItemAvatar>
                    {!entry.exercise?.picture && <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>}
                    {entry.exercise?.picture && <Avatar src={entry.exercise.picture} />}
                </ListItemAvatar>
                <ListItemText primary={entry.exercise?.name} secondary={getLabelForEntry(entry.sets)}/>
            </ListItemButton>) : <Typography sx={{textAlign: "center", margin: "10px" }}>{ history.length === 0 ? t("noHistoryEntries") : ""}</Typography>}</>}
        </List>
    </Box>
    </Layout>;
}
