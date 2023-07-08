import React from "react";
import NavLayout from "../../components/navlayout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

export const WorkoutList = () => {
    const {t} = useTranslation();
    return <NavLayout title={t("workouts")}><List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Upper Body 1" secondary="Mondays"/>
        </ListItem>
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Lower Body 1" secondary="Tuesdays"/>
        </ListItem>
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Upper Body 2" secondary="Thursdays"/>
        </ListItem>

        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Lower Body 2" secondary="Fridays"/>
        </ListItem>
    </List></NavLayout>;
}