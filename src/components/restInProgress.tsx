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
import {Avatar, Box, CircularProgress, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Typography from "@mui/material/Typography";
import {TimerContext} from "../context/timerContext";

export const RestInProgress = (props: {onClick: () => void}) => {
    const {onClick} = props;
    const { t } = useTranslation();
    const {restStarted, restTime} = useContext(WorkoutContext);
    const {time} = useContext(TimerContext);
    const currentRestTime = restStarted ? restTime - (Date.now() - restStarted?.getTime()) / 1000 : 0;
    const restLabel = Math.floor(currentRestTime).toString() + " s " + t("remaining");
    useEffect(() => {
        if (currentRestTime === 0 && "vibrate" in navigator && navigator.userAgent.includes("Android")) {
            try {
                navigator.vibrate(3000);
            } catch {}
        }
    }, [currentRestTime]);
    return currentRestTime >= 0 ? <Box sx={{position: "relative", height: "96px"}}><ListItemButton component="a" onClick={onClick} sx={{height: "96px"}}>
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
    </ListItemButton></Box> : <></>;
}
