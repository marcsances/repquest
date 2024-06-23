import Typography from "@mui/material/Typography";
import React, {useContext, useEffect} from "react";
import {Box, Button, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {SettingsContext} from "../../../context/settingsContext";
import {useTranslation} from "react-i18next";
import {DarkMode, LightMode} from "@mui/icons-material";

const PreferencesStep = (props: { setCompletable: (value: boolean) => void}) => {
    const { setCompletable } = props;
    useEffect(() => {
        setCompletable(true);
    }, []);
    const {t} = useTranslation();
    const {theme, saveTheme, featureLevel, saveFeatureLevel, useLbs, saveLbs} = useContext(SettingsContext);
    return <Box sx={{ display: "flex", flexDirection: "column", gap: "20px"}}>
        <Box sx={{display: "flex", flexDirection: "row", gap: "8px"}}>
            <Button sx={{width: "60px", fontSize: "12px"}} variant="text" color="inherit" disableFocusRipple disableRipple>{t("theme")}</Button>
            <ToggleButtonGroup
                exclusive value={theme} size="small" sx={{display: "flex", width: "100%"}}
            >
                <ToggleButton sx={{flex: "1 1 0"}} value="light" onClick={() => {
                    if (saveTheme) saveTheme("light")
                }}>
                    <LightMode/>
                </ToggleButton>
                <ToggleButton sx={{flex: "1 1 0"}} value="dark" onClick={() => {
                    if (saveTheme) saveTheme("dark")
                }}>
                    <DarkMode/>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
        <Box sx={{display: "flex", flexDirection: "row", gap: "8px"}}>
            <Button sx={{width: "60px", fontSize: "12px"}} variant="text" color="inherit" disableFocusRipple disableRipple>{t("onboarding.preferences.units")}</Button>
            <ToggleButtonGroup
                exclusive value={useLbs} size="small" sx={{display: "flex", width: "100%"}}
            >
                <ToggleButton sx={{flex: "1 1 0"}} value={false} onClick={() => {
                    if (saveLbs) saveLbs(false)
                }}>
                    kgs / cm
                </ToggleButton>
                <ToggleButton sx={{flex: "1 1 0"}} value={true} onClick={() => {
                    if (saveLbs) saveLbs(true)
                }}>
                    lbs / in
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
        <Box sx={{display: "flex", flexDirection: "row", gap: "8px"}}>
            <Button sx={{width: "60px", fontSize: "12px"}} variant="text" color="inherit" disableFocusRipple disableRipple>{t("onboarding.preferences.mode")}</Button>
            <ToggleButtonGroup
                exclusive value={featureLevel} size="small" sx={{display: "flex", width: "100%"}}
            >
                <ToggleButton sx={{flex: "1 1 0"}} value="easy" onClick={() => {
                    if (saveFeatureLevel) saveFeatureLevel("easy")
                }}>
                    {t("onboarding.preferences.simpleMode")}
                </ToggleButton>
                <ToggleButton sx={{flex: "1 1 0"}} value="advanced" onClick={() => {
                    if (saveFeatureLevel) saveFeatureLevel("advanced")
                }}>
                    {t("onboarding.preferences.advancedMode")}
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
        <Typography sx={{fontSize: "12px", marginTop: "-8px", textAlign: "justify", fontWeight: 600}}>{t(featureLevel === "easy" ? "simpleModeDescription" : "advancedModeDescription")}</Typography>
    </Box>;
}

export default PreferencesStep;
