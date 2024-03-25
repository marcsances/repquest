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
import FunctionsIcon from '@mui/icons-material/Functions';
import {DEFAULT_EMOJIS, SettingsContext} from "../../context/settingsContext";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Selector from "../../components/selector";
import {OneRm} from "../../utils/oneRm";
import {useNavigate} from "react-router-dom";
import {EmojiEmotions} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import EmojiPicker, {EmojiStyle, Theme} from "emoji-picker-react";

declare let window: any;
export const WorkoutSettingsPage = () => {
    const {t} = useTranslation();

    const { showRpe, showRir, useLbs, oneRm, emojis, saveEmojis, saveLbs, saveRir, saveRpe, saveOneRm, autostop, saveAutostop } = useContext(SettingsContext);
    const navigate = useNavigate();
    const [openOneRm, setOpenOneRm] = useState(false);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [pickerEmojis, setPickerEmojis] = useState(emojis);
    const [targetIdx, setTargetIdx] = useState<number | undefined>(undefined);
    const [snackbar, setSnackbar] = useState<string>("");
    return <Layout title={t("workoutSettings")} hideNav>
        <List dense sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
            <ListItemButton component="a" onClick={() => { if (saveLbs) saveLbs(!useLbs) }}>
                <ListItemAvatar>
                    <Avatar>
                        {useLbs ? "lbs" : "kg"}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("weightUnit")} />
            </ListItemButton>
            <ListItemButton component="a" onClick={() => setEmojiPickerOpen(true)}>
                <ListItemAvatar>
                    <Avatar>
                        <EmojiEmotions />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("reactionEmojis")} secondary={t("reactionEmojisDescription")} />
            </ListItemButton>
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
            <ListItemButton component="a" onClick={() => setOpenOneRm(true)}>
                <ListItemAvatar>
                    <Avatar>
                        <FunctionsIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("oneRmFormula")} secondary={oneRm === OneRm.EPLEY ? "Epley" : "Brzycki"} />
            </ListItemButton>

            <ListItemButton component="a" onClick={() => { if (saveAutostop) saveAutostop(!autostop) }}>
                <ListItemAvatar>
                    <Avatar>
                        {autostop ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("autoStop")} secondary={t("autoStopDescription")} />
            </ListItemButton>
        </List>
        <Selector
            defaultValue={oneRm.toString(10)}
            open={openOneRm}
            onClose={(val: string) => {
                if (saveOneRm) saveOneRm(parseInt(val));
                setOpenOneRm(false);
            }}
            title={t("oneRmFormula")}
            entries={[{key: OneRm.EPLEY.toString(10), value: "Epley"}, {key: OneRm.BRZYCKI.toString(10), value: "Brzycki"}]}
        />
        <Dialog open={emojiPickerOpen}>
            <DialogTitle>
                {t("reactionEmojis")}
            </DialogTitle>
            <DialogContent sx={{display: "flex", flexDirection: "column", placeItems: "center"}}>
                <Box sx={{display: "flex", flexDirection: "row"}}>{pickerEmojis.map((emoji, idx) => <IconButton sx={{fontSize: idx === targetIdx ? "32px" : "24px"}} onClick={() => setTargetIdx(targetIdx ? undefined : idx)}>{String.fromCodePoint(parseInt("0x" + emoji))}</IconButton>)}</Box>
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
