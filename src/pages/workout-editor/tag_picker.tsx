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
import * as React from "react";
import {useEffect, useState} from "react";
import {ExerciseTag} from "../../models/exercise";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    ListSubheader
} from "@mui/material";
import {t} from "i18next";
import {ClearAll} from "@mui/icons-material";

export interface TagPickerProps {
    title: string;
    open: boolean;
    value: ExerciseTag[];
    onChange: (tag: ExerciseTag[]) => void;
    onClose: () => void;
}

const TagPicker = (props: TagPickerProps) => {
    const { title, open, onChange, onClose, value } = props;
    const [ selectedValues, setSelectedValues ] = useState(value);
    useEffect(() => {
        setSelectedValues(value);
    }, [value, setSelectedValues]);

    const allTags = Object.values(ExerciseTag).filter((it) => typeof it !== "string").map((it) => it as unknown as ExerciseTag);

    const mapTags = (tags: ExerciseTag[]) => tags.map((val) => <Grid item xs={6} key={val}>
        <FormControlLabel label={t("tags." + ExerciseTag[val].toLowerCase())} control={<Checkbox checked={selectedValues.includes(val)} onClick={() => {
            if (selectedValues.includes(val)) {
                setSelectedValues((prevValues) => prevValues.filter((it) => it !== val));
            } else {
                setSelectedValues((prevValues) => [...prevValues, val]);
            }
        }}/>} />
    </Grid>);

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ display: "flex", flexLayout: "row"}}>
            <span style={{flexGrow: 1}}>{title}</span>
            <IconButton color="inherit" onClick={() => setSelectedValues([])}><ClearAll/></IconButton>
        </DialogTitle>
        <DialogContent sx={{overflow: "auto"}}>
            <Grid container spacing={3}>
                <><Grid item xs={12}><ListSubheader sx={{width: "100%"}}>{t("exerciseType")}</ListSubheader></Grid>
                {mapTags(allTags.filter((it) => it <= ExerciseTag.FLEXIBILITY))}
                <Grid item xs={12}><ListSubheader sx={{width: "100%"}}>{t("equipmentType")}</ListSubheader></Grid>
                {mapTags(allTags.filter((it) => it >= ExerciseTag.BODY_WEIGHT && it <= ExerciseTag.CABLE_MACHINE))}
                <Grid item xs={12}><ListSubheader sx={{width: "100%"}}>{t("muscleGroup")}</ListSubheader></Grid>
                {mapTags(allTags.filter((it) => it >= ExerciseTag.CHEST))}</>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} autoFocus>
                {t("cancel")}
            </Button>
            <Button onClick={() => {
                onChange(selectedValues);
                onClose();
            }}>{t("ok")}</Button>
        </DialogActions>
    </Dialog>
}

export default TagPicker;
