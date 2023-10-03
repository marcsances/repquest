import React, {useContext, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import pjson from "../../../package.json";
import i18n from "i18next";
import FunctionsIcon from '@mui/icons-material/Functions';
import {SettingsContext} from "../../context/settingsContext";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Selector from "../../components/selector";
import {OneRm} from "../../utils/oneRm";
import {Cake} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import BackupIcon from "@mui/icons-material/Backup";

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

    const { showRpe, showRir, useLbs, oneRm, saveLbs, saveRir, saveRpe, saveOneRm } = useContext(SettingsContext);
    const navigate = useNavigate();
    const [openLanguage, setOpenLanguage] = useState(false);
    const [openOneRm, setOpenOneRm] = useState(false);

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
            <ListItemButton component="a" onClick={() => { if (saveLbs) saveLbs(!useLbs) }}>
                <ListItemAvatar>
                    <Avatar>
                        {useLbs ? "lbs" : "kg"}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("weightUnit")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => setOpenOneRm(true)}>
                <ListItemAvatar>
                    <Avatar>
                        <FunctionsIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("oneRmFormula")} secondary={oneRm === OneRm.EPLEY ? "Epley" : "Brzycki"} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/settings/backup")}>
                <ListItemAvatar>
                    <Avatar>
                        <BackupIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("backup.title")} secondary={t("backup.description")} />
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
            selectedValue={i18n.language}
            open={openLanguage}
            onClose={(val: string) => {
                localStorage.setItem("lang", val);
                i18n.changeLanguage(val).then();
                setOpenLanguage(false);
            }}
            title={t("language")}
            entries={[{key: "ca", value: "Català"}, {key: "en", value: "English"}, {key: "es", value: "Español"}]}
        />
        <Selector
            selectedValue={oneRm.toString(10)}
            open={openOneRm}
            onClose={(val: string) => {
                if (saveOneRm) saveOneRm(parseInt(val));
                setOpenOneRm(false);
            }}
            title={t("oneRmFormula")}
            entries={[{key: OneRm.EPLEY.toString(10), value: "Epley"}, {key: OneRm.BRZYCKI.toString(10), value: "Brzycki"}]}
        />
    </Layout>;
}
