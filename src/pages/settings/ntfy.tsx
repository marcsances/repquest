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
import React, {useContext, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    Snackbar, Step,
    StepContent,
    StepLabel, Stepper,
    TextField
} from "@mui/material";
import {SettingsContext} from "../../context/settingsContext";
import getId from "../../utils/id";
import IconButton from "@mui/material/IconButton";
import {ContentCopy} from "@mui/icons-material";

const isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));


export const NotificationsPage = () => {
    const {t} = useTranslation();
    const [snackbar, setSnackbar] = useState<string | null>(null);
    const [step,setStep] = useState(0);
    const {ntfyTopic, saveNtfyTopic} = useContext(SettingsContext);
    
    return <Layout title={t("notifications.title")} hideNav scroll>
        <Box sx={{padding: "20px", display: "flex", flexDirection: "column", gap: "8px", width: "calc(100% - 40px)", height: "calc(100vh - 96px)", overflow: "auto"}}>
            <Typography variant="subtitle2">{t("notifications.infoPush1")}</Typography>
            <FormControlLabel sx={{margin: "8px"}} control={<Checkbox checked={!!ntfyTopic} onClick={() => {
                if (saveNtfyTopic) {
                    saveNtfyTopic(ntfyTopic ? "" : "repquest-" + getId());
                }
            }} />} label={t("notifications.enablePush")} />
            {ntfyTopic && <Stepper activeStep={step} orientation="vertical">
            <Step id="1">
                <StepLabel>{t("notifications.infoPush2")}</StepLabel>
                <StepContent>
                    <Button onClick={() => setStep((step => step+1))} variant="contained" component="a" target="_blank" href={isIOS ? "https://apps.apple.com/us/app/ntfy/id1625396347" : "https://play.google.com/store/apps/details?id=io.heckel.ntfy"}>{t("install")}</Button>
                </StepContent>
            </Step>
            <Step id="2">
                <StepLabel>{t("notifications.infoPush3")}</StepLabel>
                <StepContent>
                    <Button variant="contained" onClick={() => setStep((step => step+1))}>{t("next")}</Button>
                </StepContent>
            </Step>
            <Step id="3">
                <StepLabel>{t("notifications.infoPush4")}</StepLabel>
                <TextField disabled={step < 2} label={t("notifications.topic")} size="small" value={ntfyTopic} sx={{width: "100%", maxWidth: "600px", marginTop: "8px"}} onFocus={(e) => e.target.select()} InputProps={{
                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => {
                        navigator.clipboard.writeText(ntfyTopic);
                        setSnackbar(t("actions.copied"));
                    }}><ContentCopy /></IconButton></InputAdornment>
                }} onChange={(e) => {e.preventDefault()}}/>
                <br/>
                <TextField disabled={step < 2} label={t("notifications.serverURL")} size="small" value="https://push.repquest.app" sx={{width: "100%", maxWidth: "600px", marginTop: "24px"}} onFocus={(e) => e.target.select()} InputProps={{
                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => {
                        navigator.clipboard.writeText("https://push.repquest.app");
                        setSnackbar(t("actions.copied"));
                    }}><ContentCopy /></IconButton></InputAdornment>
                }} onChange={(e) => {e.preventDefault()}}/>
            </Step>
            </Stepper>}
        </Box>
        <Snackbar
            open={snackbar !== null}
            autoHideDuration={2000}
            onClose={() => setSnackbar(null)}
            message={snackbar}
        />
    </Layout>;
}
