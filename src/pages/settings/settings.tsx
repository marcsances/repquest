import React from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import TimerIcon from '@mui/icons-material/Timer';
import TranslateIcon from '@mui/icons-material/Translate';
import InfoIcon from '@mui/icons-material/Info';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';

declare let window: any;
export const SettingsPage = () => {
    const {t} = useTranslation();
    const install = async () => {
        if (window.deferredPrompt !== null) {
            window.deferredPrompt.prompt();
            const {outcome} = await (window.deferredPrompt.userChoice as Promise<{ outcome: string }>);
            if (outcome === 'accepted') {
                window.deferredPrompt = null;
            }
        }
    }

    return <Layout title={t("settings")}>
        <List sx={{width: '100%', height: '100%', bgcolor: 'background.paper'}}>
            <ListItemButton component="a">
                <ListItemAvatar>
                    <Avatar>
                        <SquareFootIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("units")}/>
            </ListItemButton>
            <ListItemButton component="a">
                <ListItemAvatar>
                    <Avatar>
                        <TimerIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("rest")}/>
            </ListItemButton>
            <ListItemButton component="a">
                <ListItemAvatar>
                    <Avatar>
                        <TranslateIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("language")}/>
            </ListItemButton>
            {window.deferredPrompt && <ListItemButton component="a" onClick={install}>
                <ListItemAvatar>
                    <Avatar>
                        <InstallMobileIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("install")}/>
            </ListItemButton>}
            <ListItemButton component="a">
                <ListItemAvatar>
                    <Avatar>
                        <InfoIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("version")} secondary="0.1.0 UX Preview"/>
            </ListItemButton>
        </List>
    </Layout>;
}