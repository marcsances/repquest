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
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Snackbar
} from "@mui/material";
import {DEFAULT_EMOJIS, SettingsContext} from "../../context/settingsContext";
import {DarkMode, EmojiEmotions, LightMode, SentimentSatisfied, VolumeOff, VolumeUp} from "@mui/icons-material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import IconButton from "@mui/material/IconButton";
import EmojiPicker, {EmojiStyle, Theme} from "emoji-picker-react";

export const AppearanceSettingsPage = () => {
    const {t} = useTranslation();
    const { theme, saveTheme, featureLevel, saveFeatureLevel, sound, saveSound, emojis, saveEmojis } = useContext(SettingsContext);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [pickerEmojis, setPickerEmojis] = useState(emojis);
    const [targetIdx, setTargetIdx] = useState<number | undefined>(undefined);
    const [snackbar, setSnackbar] = useState<string>("");

    return <Layout title={t("appearanceSettings")} hideNav>
        <List dense sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
            <ListItemButton component="a" onClick={() => { if (saveTheme) saveTheme(theme === "light" ? "dark" : "light") }}>
                <ListItemAvatar>
                    <Avatar>
                        { theme === "light" ? <LightMode /> : <DarkMode />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("theme")} secondary={theme === "light" ? t("lightTheme") : t("darkTheme")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => { if (saveFeatureLevel) saveFeatureLevel(featureLevel === "advanced" ? "easy" : "advanced")}}>
                <ListItemAvatar>
                    <Avatar>
                        { featureLevel === "advanced" ? <FitnessCenterIcon /> : <SentimentSatisfied />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={featureLevel === "advanced" ? t("advancedMode") : t("simpleMode")} secondary={featureLevel === "advanced" ? t("advancedModeDescription") : t("simpleModeDescription")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => { if (saveSound) saveSound(!sound) }}>
                <ListItemAvatar>
                    <Avatar>
                        {sound ? <VolumeUp /> : <VolumeOff />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("sound")} />
            </ListItemButton>
            {featureLevel === "advanced" && <ListItemButton component="a" onClick={() => setEmojiPickerOpen(true)}>
                <ListItemAvatar>
                    <Avatar>
                        <EmojiEmotions />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("reactionEmojis")} secondary={t("reactionEmojisDescription")} />
            </ListItemButton>}
        </List>
        <Dialog open={emojiPickerOpen}>
            <DialogTitle>
                {t("reactionEmojis")}
            </DialogTitle>
            <DialogContent sx={{display: "flex", flexDirection: "column", placeItems: "center"}}>
                <Box sx={{display: "flex", flexDirection: "row"}}>{pickerEmojis.map((emoji, idx) => <IconButton color="inherit" sx={{fontSize: idx === targetIdx ? "32px" : "24px"}} onClick={() => setTargetIdx(targetIdx ? undefined : idx)}>{String.fromCodePoint(parseInt("0x" + emoji))}</IconButton>)}</Box>
                {targetIdx !== undefined && <Box sx={{marginTop: "24px"}}><EmojiPicker searchPlaceholder={t("search")} lazyLoadEmojis onEmojiClick={(emoji) => {
                    setPickerEmojis([...pickerEmojis.slice(0, targetIdx), emoji.unified, ...pickerEmojis.slice(targetIdx + 1)]);
                    setTargetIdx(undefined);
                }} theme={Theme.DARK} emojiStyle={EmojiStyle.NATIVE} /></Box>}
            </DialogContent>

            <DialogActions sx={{ display: "flex", flexDirection: "row" }}>
                <Button onClick={() => setPickerEmojis(DEFAULT_EMOJIS)}>
                    {t("defaults")}
                </Button>
                <span style={{flexGrow: 1}}>&nbsp;</span>
                <Button onClick={() => setEmojiPickerOpen(false)} autoFocus>
                    {t("cancel")}
                </Button>
                <Button onClick={() => {
                    if (saveEmojis) saveEmojis(pickerEmojis);
                    setEmojiPickerOpen(false);
                    setSnackbar(t("saved"));
                }}>{t("ok")}</Button>
            </DialogActions>
        </Dialog>

        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
    </Layout>;
}
