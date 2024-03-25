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
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Workout} from "../../models/workout";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import ToggleParameter from "../../components/toggleParameter";
import {DayOfWeek} from "../../models/base";
import {useTranslation} from "react-i18next";
import ColorPicker from "../../components/colorPicker";
import Typography from "@mui/material/Typography";
import {
    amber,
    blue,
    blueGrey,
    brown,
    cyan,
    deepOrange,
    deepPurple,
    green,
    grey,
    indigo,
    lightGreen,
    lime,
    orange,
    pink,
    purple,
    red,
    teal,
    yellow
} from "@mui/material/colors";

export interface WorkoutDetailsEditorProps {
    workout: Workout;
    onChange: (workout: Workout) => void;
    onClose: () => void;
    open: boolean;
    title: string;
}

const WorkoutDetailsEditor = (props: WorkoutDetailsEditorProps ) => {
    const { open, workout, onChange, onClose, title } = props;
    const [ currentWorkout, setCurrentWorkout ] = useState(workout);
    const { t } = useTranslation();
    const [ required, setRequired ] = useState(false);
    const daysOfWeek = [{ key: DayOfWeek.monday , value: t("mon")},
        { key: DayOfWeek.tuesday , value: t("tue")},
        { key: DayOfWeek.wednesday , value: t("wed")},
        { key: DayOfWeek.thursday , value: t("thu")},
        { key: DayOfWeek.friday , value: t("fri")},
        { key: DayOfWeek.saturday , value: t("sat")},
        { key: DayOfWeek.sunday , value: t("sun")}];

    useEffect(() => {
        setCurrentWorkout(workout);
    }, [workout, setCurrentWorkout]);
    const boxRef = useRef<HTMLInputElement>();
    const palette = [red[500], pink[500], purple[500], deepPurple[500], indigo[500], blue[500], cyan[500], teal[500], green[500], lightGreen[500], lime[500], yellow[500], amber[500], orange[500], deepOrange[500], brown[500], grey[500], blueGrey[500], "#ffffff", "#000000"];
    useEffect(() => {
        setTimeout(() => {
            if (boxRef && boxRef.current) {
                boxRef.current.click();
            }
        }, 0)
    }, [boxRef]);
    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <TextField InputProps={{ref: boxRef}} error={required} helperText={required ? t("errors.requiredField") : ""} required sx={{width: "100%", marginTop: "16px", marginBottom: "8px"}} label={t("workoutEditor.name")} value={currentWorkout.name} onChange={(ev) => {
                setRequired(false);
                setCurrentWorkout({...currentWorkout, name: ev.target.value});
            }}/>
            <Typography variant="button" >{t("daysOfWeek")}</Typography>
            <ToggleParameter<DayOfWeek> multi options={daysOfWeek} value={currentWorkout.daysOfWeek} onChange={(daysOfWeek: DayOfWeek[]) => {
                setCurrentWorkout({...currentWorkout, daysOfWeek: daysOfWeek.sort()});
            }}/>
            <Typography variant="button">{t("Color")}</Typography>
            <ColorPicker maxCols={5} value={currentWorkout.color} onChange={(color: string) => {setCurrentWorkout((prevWorkout) => ({...prevWorkout, color: color === prevWorkout.color ? undefined : color}))}} colors={palette} />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} autoFocus>
                {t("cancel")}
            </Button>
            <Button onClick={() => {
                if (currentWorkout.name.length !== 0) {
                    onChange(currentWorkout);
                    onClose();
                } else {
                    setRequired(true);
                }
            }}>{t("ok")}</Button>
        </DialogActions>
    </Dialog>
}

export default WorkoutDetailsEditor;
