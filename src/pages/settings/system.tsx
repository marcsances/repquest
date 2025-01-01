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
import React, {useContext} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import {AutoFixHigh, Mail, MonitorHeart, PhonelinkErase, Policy} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {DBContext} from "../../context/dbContext";
import {DialogContext} from "../../context/dialogContext";
import defer from "../../utils/defer";

declare let window: any;
export const SystemSettingsPage = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
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
    const { showAlert} = useContext(DialogContext);

    return <Layout title={t("system")} hideNav>
        <List dense sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
            {window.deferredPrompt && <ListItemButton component="a" onClick={install}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <InstallMobileIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("install")} secondary={t("installDescription")}/>
            </ListItemButton>}
            <ListItemButton component="a" onClick={() => navigate("/onboarding")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <AutoFixHigh/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("onboarding.menu")} secondary={t("onboarding.menuDescription")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/settings/telemetry")}>
                <ListItemAvatar>
                    <Avatar>
                        <MonitorHeart/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("telemetry")} secondary={t("telemetryDescription")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => window.location.href = window.location.origin}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.warning.main}}>
                        <RestartAltIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("reloadTitle")} secondary={t("reloadDescription")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => {
                showAlert(t("resetAll"), t("resetAllWarning"), (result) => {
                    if (result) defer(() => showAlert(t("resetAll"), t("resetAllWarning2"), (result) => {
                        if (result) db?.delete().then(() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            location.href = window.location.origin;
                        });
                    }, "yesNo"));
                }, "yesNo");
            }}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.error.main}}>
                        <PhonelinkErase sx={{color: (theme) => theme.palette.error.contrastText}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("resetAll")} secondary={t("resetAllTip")}/>
            </ListItemButton>
            <ListItemButton component="a" href={atob("bWFpbHRvOmluZm9AcmVwcXVlc3QuYXBw")}>
                <ListItemAvatar>
                    <Avatar>
                        <Mail/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("contact")} secondary={t("developedBy")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/license")}>
                <ListItemAvatar>
                    <Avatar>
                        <Policy/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("license")} secondary="GNU GPL 3.0" />
            </ListItemButton>
        </List>
    </Layout>;
}
