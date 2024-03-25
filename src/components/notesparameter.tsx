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
import {InputAdornment, TextField, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import {Clear} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import EmojiDropdown from "./emojidropdown";
import {useTranslation} from "react-i18next";

export interface NotesParameterProps {
    name: string;
    value?: string;
    emoji?: string;
    onChange?: (notes?: string, emojiUrl?: string) => void;
    disabled?: boolean;
}

const NotesParameter = (props: NotesParameterProps) => {
    const {name, emoji, value, onChange, disabled} = props;
    const [val, setVal] = useState(value);
    const [emote, setEmote] = useState<string | undefined>(emoji);
    const [paramDisabled, setParamDisabled] = useState(value === undefined);
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');
    const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);
    const {t} = useTranslation();

    useEffect(() => {
        setVal(value)
    }, [value]);

    useEffect(() => {
        setEmote(emoji);
    }, [emoji]);

    return <Box sx={{display: "flex", flexDirection: "row", margin: "8px"}}>
        <TextField
            id="outlined-number"
            value={val || ""}
            variant="outlined"
            sx={{flexGrow: 1}}
            size="small"
            multiline
            onChange={(ev) => { setVal(ev.target.value); if (onChange) onChange(ev.target.value, emote) }}
            disabled={disabled}
            placeholder={t("notes")}
            inputProps={{style: {textAlign: "left"}}}
            InputProps={{ startAdornment: <InputAdornment position="start">
                    <IconButton onClick={(ev) => { ev.stopPropagation(); setAnchor(anchor ? undefined : ev.currentTarget) }}>
                    {emote ? emote : "📝"}
                    </IconButton>
                </InputAdornment>, endAdornment: !!emote || !!val ? <InputAdornment position="end">
                    <IconButton onClick={(ev) => { ev.stopPropagation(); setVal(undefined); setEmote(undefined); if (onChange) onChange(undefined, undefined); }}>
                        <Clear/>
                    </IconButton>
                </InputAdornment> : undefined}}
        />
        <EmojiDropdown onClose={() => setAnchor(undefined)} open={!!anchor} anchorEl={anchor} onChange={(v) => {setEmote(v); if (onChange) onChange(val, v)}}/>
    </Box>
}

export default NotesParameter;
