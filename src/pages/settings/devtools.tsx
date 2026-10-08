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
import React, { useContext } from "react";
import Layout from "../../components/layout";
import { useTranslation } from "react-i18next";
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import { AutoFixHigh, Cached, Mail, MonitorHeart, PhonelinkErase, Policy, Terminal } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { DBContext } from "../../context/dbContext";
import { DialogContext } from "../../context/dialogContext";
import defer from "../../utils/defer";

declare let window: any;
export const DevToolsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { db } = useContext(DBContext);
    return <Layout title={t("devTools.devTools")} hideNav>
        <List dense sx={{ width: '100%', height: 'calc(100% - 78px)', overflow: "auto" }}>
            <ListItemButton component="a" onClick={() => navigate("/consoleLogs")}>
                <ListItemAvatar>
                    <Avatar>
                        <Policy />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("devTools.consoleLogs")} secondary={t("devTools.consoleLogsDescription")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => {
                window.messages.push("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                window.messages.push("WATCH OUT! This area is just for debugging purposes");
                window.messages.push("Pasting code here may put your data at risk.");
                window.messages.push("Do not continue unless you know what you are doing.");
                window.messages.push("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                window.messages.push("We placed some contexts in the window object for you to access.");
                window.messages.push("window.context.db for DBContext, window.context.workout for WorkoutContext");
                window.messages.push("window.context.user for UserContext, window.context.timer for TimerContext");
                window.messages.push("window.context.settings for SettingsContext");
                navigate("/terminal")
            }
            }>
                <ListItemAvatar>
                    <Avatar>
                        <Terminal />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("devTools.jsConsole")} secondary={t("devTools.jsConsoleDescription")} />
            </ListItemButton>
        </List>
    </Layout>;
}
