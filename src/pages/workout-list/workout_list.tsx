import React from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TuneIcon from '@mui/icons-material/Tune';

export const WorkoutList = () => {
    const {t} = useTranslation();
    return <Layout title={t("workouts")}><List sx={{width: '100%', height: '100%', bgcolor: 'background.paper'}}>
        <ListItemButton component="a" href="/workout">
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Upper Body 1" secondary={t("mondays")}/>
        </ListItemButton>
        <ListItemButton component="a" href="/workout">
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Upper Body 2" secondary={t("tuesdays")}/>
        </ListItemButton>
        <ListItemButton component="a" href="/workout">
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Lower Body 1" secondary={t("thursdays")}/>
        </ListItemButton>
        <ListItemButton component="a" href="/workout">
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Lower Body 2" secondary={t("fridays")}/>
        </ListItemButton>

        <ListItemButton component="a" href="/workout">
            <ListItemAvatar>
                <Avatar>
                    <TuneIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("freeTraining")} secondary={t("pickExercises")}/>
        </ListItemButton>
    </List></Layout>;
}