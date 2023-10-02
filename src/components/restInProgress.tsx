import * as React from "react";
import {useTranslation} from "react-i18next";
import {useContext, useMemo} from "react";
import {WorkoutContext} from "../context/workoutContext";
import {Avatar, Box, CircularProgress, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Typography from "@mui/material/Typography";

export const RestInProgress = (props: {onClick: () => void}) => {
    const {onClick} = props;
    const { t } = useTranslation();
    const { restStarted, restTime, time } = useContext(WorkoutContext);
    const currentRestTime = useMemo(() => restStarted ? restTime - (Date.now() - restStarted?.getTime()) / 1000 : 0, [time, restStarted, restTime]);
    const restLabel = Math.floor(currentRestTime).toString() + " s " + t("remaining");
    return <ListItemButton component="a" onClick={onClick}>
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
    </ListItemButton>
}
