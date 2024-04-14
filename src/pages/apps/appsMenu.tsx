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
import React from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {Calculate, CameraRoll, History, QueryStats, Straighten, TimerRounded} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

export const AppsMenu = () => {

    const {t} = useTranslation();
    const navigate = useNavigate();

    return <Layout showAccountMenu hideBack title={t("appsMenu.title")}>
        <List sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
            <ListItemButton component="a" onClick={() => navigate("/history")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <History/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("history")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/account/stats")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <QueryStats />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("statsApp.title")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/account/measures")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <Straighten />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("account.bodyMeasures")}/>
            </ListItemButton>
            <ListItemButton sx={{display: "none"}} disabled component="a" onClick={() => navigate("/account/photobook")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <CameraRoll />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("account.photobook")} secondary={t("comingSoon")}/>
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/onerm")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                            <Calculate/>
                        </Avatar>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("oneRmCalculator")}/>
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/apps/timer")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                            <TimerRounded/>
                        </Avatar>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("appsMenu.timer")}/>
            </ListItemButton>
        </List>
    </Layout>;
}
