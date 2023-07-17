import React, {useContext, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';
import InfoIcon from '@mui/icons-material/Info';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import pjson from "../../../package.json";
import i18n from "i18next";
import LanguageSelector from "./languageSelect";
import {SettingsContext} from "../../context/settingsContext";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

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

    const { showRpe, showRir, saveRir, saveRpe } = useContext(SettingsContext);

    const [openLanguage, setOpenLanguage] = useState(false);

    return <Layout title={t("settings")}>
        <List sx={{width: '100%', height: '100%', bgcolor: 'background.paper'}}>
            <ListItemButton component="a" onClick={() => setOpenLanguage(true)}>
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
            <ListItemButton component="a" onClick={() => { if (saveRpe) saveRpe(!showRpe) }}>
                <ListItemAvatar>
                    <Avatar>
                        {showRpe ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("showRPE")} secondary={t("rpeIs")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => { if (saveRir) saveRir(!showRir) }}>
                <ListItemAvatar>
                    <Avatar>
                        {showRir ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("showRIR")} secondary={t("rirIs")} />
            </ListItemButton>
            <ListItemButton component="a">
                <ListItemAvatar>
                    <Avatar>
                        <InfoIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("version")} secondary={pjson.version} />
            </ListItemButton>
        </List>
        <LanguageSelector
            selectedValue={i18n.language}
            open={openLanguage}
            onClose={(val: string) => {
                localStorage.setItem("lang", val);
                i18n.changeLanguage(val).then();
                setOpenLanguage(false);
            }}
        />
    </Layout>;
}