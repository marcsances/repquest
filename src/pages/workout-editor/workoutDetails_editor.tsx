import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Workout} from "../../models/workout";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import ToggleParameter from "../../components/toggleParameter";
import {DayOfWeek} from "../../models/base";
import {useTranslation} from "react-i18next";

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
            <ToggleParameter<DayOfWeek> sx={{margin: 0}} multi options={daysOfWeek} value={currentWorkout.daysOfWeek} onChange={(daysOfWeek: DayOfWeek[]) => {
                setCurrentWorkout({...currentWorkout, daysOfWeek: daysOfWeek.sort()});
            }}/>
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
