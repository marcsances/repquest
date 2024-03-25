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
import React, {useContext, useState} from "react";
import {Avatar, Box, CircularProgress, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import StopIcon from '@mui/icons-material/Stop';
import Selector from "../../components/selector";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {WorkoutContext} from "../../context/workoutContext";
import {AddCircleOutlined, Cancel, FirstPage} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import ArchiveIcon from '@mui/icons-material/Archive';
import {backupToJSON} from "../../db/backup";
import {DBContext} from "../../context/dbContext";
import Typography from "@mui/material/Typography";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {UserContext} from "../../context/userContext";
import {SettingsContext} from "../../context/settingsContext";

export const WorkoutFinished = (props: { stopWorkoutCancel?: () => void, addExercise?: () => void }) => {
    const {stopWorkoutCancel, addExercise} = props;
    const {t} = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [isBackingUp, setIsBackingUp] = useState(false);
    const {db} = useContext(DBContext);
    const {user} = useContext(UserContext);
    const settings = useContext(SettingsContext);

    const {
        stopWorkout,
        setCurrentWorkoutExerciseNumber,
        addSet,
        currentWorkoutExerciseNumber
    } = useContext(WorkoutContext);
    const onClose = (key: string) => {
        if (key === "addSet" && addSet && setCurrentWorkoutExerciseNumber) {
            setCurrentWorkoutExerciseNumber(currentWorkoutExerciseNumber - 1);
            addSet();
        }
        if (key === "stopWorkout" && stopWorkout) stopWorkout().then(() => navigate("/workout/postworkout"));
        if (key === "back" && !stopWorkoutCancel && setCurrentWorkoutExerciseNumber) setCurrentWorkoutExerciseNumber(currentWorkoutExerciseNumber - 1);
        if (key === "back" && stopWorkoutCancel) stopWorkoutCancel();
        if (key === "first" && !stopWorkoutCancel && setCurrentWorkoutExerciseNumber) setCurrentWorkoutExerciseNumber(0);
        if (key === "addExercise" && !stopWorkoutCancel && addExercise) addExercise();
        if (key === "stopAndBackup" && stopWorkout) {
            if (!db || !user) return;

            stopWorkout().then(() => {
                setIsBackingUp(true);
                backupToJSON(db, "everything", user, settings).then((blobUrl) => {
                    const link = document.createElement('a');
                    link.setAttribute('target', '_blank');
                    link.setAttribute("download", "weightlog-backup-" + new Date().toJSON() + ".json");
                    link.href = blobUrl;
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode?.removeChild(link);
                    setIsBackingUp(false);
                    navigate("/workout/postworkout");
                });
            })
        }
        if (key === "cancel" && stopWorkoutCancel) stopWorkoutCancel();
    };

    return <Selector open defaultValue="cancel" onClose={onClose}
                     title={t(stopWorkoutCancel ? "stopWorkout" : "workoutFinished")} entries={[

        ...(!stopWorkoutCancel ? [{
            key: "addSet",
            value: t("actions.addSet"),
            icon: <AddCircleOutlined/>,
            extras: {buttonColor: theme.palette.success.main}
        },
            {
                key: "addExercise",
                value: t("addExercise"),
                icon: <FitnessCenterIcon sx={{color: (theme) => theme.palette.success.contrastText}}/>,
                extras: {buttonColor: theme.palette.success.main}
            },
            {
                key: "back",
                value: t("backToLastExercise"),
                icon: <ArrowLeftIcon/>,
                extras: {buttonColor: theme.palette.primary.main}
            },
            {
                key: "first",
                value: t("backToFirstExercise"),
                icon: <FirstPage/>,
                extras: {buttonColor: theme.palette.primary.main}
            }] : []),
        {
            key: "stopWorkout",
            value: t("stopWorkout"),
            icon: <StopIcon sx={{color: (theme) => theme.palette.error.contrastText}}/>,
            extras: {buttonColor: theme.palette.error.main}
        },
        {
            key: "stopAndBackup",
            value: t("stopAndBackup"),
            icon: isBackingUp ? <Avatar>
                <Box position="relative" display="inline-flex">
                    <CircularProgress variant="indeterminate" size="32px"/>
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
                            <ArchiveIcon sx={{color: (theme) => theme.palette.warning.contrastText}}/>
                        </Typography>
                    </Box>
                </Box>
            </Avatar> : <ArchiveIcon sx={{color: (theme) => theme.palette.warning.contrastText}}/>,
            extras: {buttonColor: theme.palette.warning.main}
        },
        ...(stopWorkoutCancel ? [{
            key: "cancel",
            value: t("cancel"),
            icon: <Cancel/>
        }] : [])
    ]}/>
}
