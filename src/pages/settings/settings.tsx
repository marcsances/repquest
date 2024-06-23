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
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';
import pjson from "../../../package.json";
import i18n from "i18next";
import Selector from "../../components/selector";
import {Build, Cake, Campaign, FormatPaint} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import BackupIcon from "@mui/icons-material/Backup";
import {DBContext} from "../../context/dbContext";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {SettingsContext} from "../../context/settingsContext";
import {UserContext} from "../../context/userContext";
import languages from "../../i18n/languages";

declare let window: any;
export const SettingsPage = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const {lang, saveLang} = useContext(SettingsContext);
    const install = async () => {
        if (window.deferredPrompt !== null) {
            window.deferredPrompt.prompt();
            const {outcome} = await (window.deferredPrompt.userChoice as Promise<{ outcome: string }>);
            if (outcome === 'accepted') {
                window.deferredPrompt = null;
            }
        }
    }

    const navigate = useNavigate();
    const [openLanguage, setOpenLanguage] = useState(false);
    const {userName, user} = useContext(UserContext);

    return <Layout showAccountMenu title={t("settings")}>
        <List dense sx={{width: '100%', height: 'calc(100% - 74px)', overflow: "auto"}}>
            <ListItemButton component="a" onClick={() => navigate("/account")}>
                <ListItemAvatar>
                    <Avatar src={user?.picture} />
                </ListItemAvatar>
                <ListItemText primary={userName || t("account.title")} secondary={userName ? t("account.title") : ""}/>
            </ListItemButton>
            <ListItemButton component="a" onClick={() => setOpenLanguage(true)}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <TranslateIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("language")}/>
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/settings/appearance")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <FormatPaint sx={{color: (theme) => theme.palette.primary.contrastText}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("appearanceSettings")} secondary={t("appearanceSettingsDescription")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/settings/workout")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.success.main}}>
                        <FitnessCenterIcon sx={{color: (theme) => theme.palette.success.contrastText}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("workoutSettings")} secondary={t("workoutSettingsDescription")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/settings/backup")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.secondary.main}}>
                        <BackupIcon sx={{color: (theme) => theme.palette.secondary.contrastText}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("backup.title")} secondary={t("backup.description")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/settings/system")}>
                <ListItemAvatar>
                    <Avatar>
                        <Build/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("system")} secondary={t("systemDescription")} />
            </ListItemButton>
            <ListItemButton component="a" href="https://docs.google.com/forms/d/e/1FAIpQLSdrG44hZZ8MoGzFx2DjIVKSnFylDDbCHtaQL3vhEGM4yuOb8g/viewform?usp=sf_link" target="_blank">
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.warning.main}}>
                        <Campaign sx={{color: (theme) => theme.palette.warning.contrastText}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("feedback")} secondary={t("feedbackDescription")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/whats-new")}>
                <ListItemAvatar>
                    <Avatar>
                        <Cake/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("whatsNew")} secondary={t("version") + " " + pjson.version} />
            </ListItemButton>
        </List>
        <Selector
            defaultValue={i18n.language}
            open={openLanguage}
            onClose={(val: string) => {
                if (saveLang) saveLang(val);
                i18n.changeLanguage(val).then();
                setOpenLanguage(false);
            }}
            title={t("language")}
            entries={languages}
        />
    </Layout>;
}
