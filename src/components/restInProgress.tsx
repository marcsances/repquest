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
import * as React from "react";
import {useContext, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {WorkoutContext} from "../context/workoutContext";
import {Avatar, Box, CircularProgress, IconButton, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Typography from "@mui/material/Typography";
import {TimerContext} from "../context/timerContext";
import playBeep from "../utils/beep";
import {SettingsContext} from "../context/settingsContext";
import {VolumeMute, VolumeUp} from "@mui/icons-material";

export const RestInProgress = (props: {onClick: () => void}) => {
    const {onClick} = props;
    const { t } = useTranslation();
    const {restStarted, restTime, stopRest} = useContext(WorkoutContext);
    const {time, audioContext} = useContext(TimerContext);
    const {sound, saveSound} = useContext(SettingsContext);
    const currentRestTime = restStarted ? restTime - (Date.now() - restStarted?.getTime()) / 1000 : 0;
    const curSecs = Math.floor(currentRestTime);
    const restLabel = Math.floor(currentRestTime).toString() + " s " + t("remaining");
    useEffect(() => {
        if (currentRestTime === 0 && "vibrate" in navigator && navigator.userAgent.includes("Android")) {
            try {
                navigator.vibrate(3000);
            } catch {}
        }
    }, [currentRestTime]);

    useEffect(() => {
        if (curSecs <= 5 && curSecs >= 0 && sound && audioContext) {
            playBeep(audioContext, 500, 250);
        }
    }, [curSecs, sound, audioContext]);

    useEffect(() => {
        if (currentRestTime <= 0 && stopRest) {
            stopRest();
            if (sound && audioContext) playBeep(audioContext, 1000, 1000);
        }
    }, [currentRestTime, sound, audioContext, time, stopRest]);

    return currentRestTime >= 0 ? <ListItemButton component="a" onClick={onClick}>
        <ListItemAvatar>
            <Avatar>
                <Box position="relative" display="inline-flex">
                    <CircularProgress variant="determinate" value={currentRestTime * 100 / restTime} size="32px" />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="caption" component="div" color="white">
                            <HourglassBottomIcon sx={{marginTop: "7px"}}/>
                        </Typography>
                    </Box>
                </Box>
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary={t("restInProgress")} secondary={restLabel}/>
        <IconButton color="inherit" onClick={(e) => { e.stopPropagation(); if (saveSound) saveSound(!sound) }}>{sound ? <VolumeUp /> : <VolumeMute />}</IconButton>
    </ListItemButton> : <></>;
}
