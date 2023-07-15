import React from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

export const HistoryPage = () => {
    const {t} = useTranslation();
    return <Layout title={t("history")}><List sx={{width: '100%', height: '100%', bgcolor: 'background.paper'}}>
        <ListItemButton component="a" href="/workout">
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Upper Body 1" secondary={"lunes 10 de julio 07:00"}/>
        </ListItemButton></List></Layout>;
}