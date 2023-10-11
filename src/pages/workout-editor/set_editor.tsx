import {ExerciseSet, SetSide, SetType} from "../../models/workout";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ToggleParameter from "../../components/toggleParameter";
import SetParameter from "../../components/setParameter";
import Parameter from "../../components/parameter";
import {SettingsContext} from "../../context/settingsContext";
import ConfirmDialog from "../../components/confirmDialog";

interface SetEditorProps {
    open: boolean;
    set: ExerciseSet;
    setNumber: number;
    onChange: (set: ExerciseSet) => void;
    onClose: () => void;
    onDelete: () => void;
}

const SetEditor = (props: SetEditorProps) => {
    const {open, set, setNumber, onChange, onClose, onDelete} = props;
    const {useLbs, showRpe, showRir} = useContext(SettingsContext);
    const {t} = useTranslation();
    const [exerciseSet, setExerciseSet] = useState(set);
    const [confirmDelete, setConfirmDelete] = useState(false);
    useEffect(() => {
        setExerciseSet(set);
    }, [set, setExerciseSet]);

    const sideOptions = [
        {key: SetSide.BOTH, value: t("bilateral")},
        {key: SetSide.LEFT, value: t("leftSide")},
        {key: SetSide.RIGHT, value: t("rightSide")},
    ];

    const setOptions = [
        { key: SetType.STANDARD, value: t("workSet") },
        { key: SetType.WARMUP, value: t("warmup") },
        { key: SetType.DROPSET, value: t("dropSet") },
        { key: SetType.FAILURE, value: t("failure") },
    ];

    return <Dialog fullScreen open={open} onClose={onClose}>
        <DialogTitle>{t("set")}</DialogTitle>
        <DialogContent sx={{ height : "100%", overflow: 0, display: "flex", flexDirection: "column"}}>
            {t("useCheckboxes")}
            {exerciseSet.weight !== undefined && <ToggleParameter<SetType> options={setOptions} value={exerciseSet.type} onChange={(type: number) => setExerciseSet((prevState) => ({ ...prevState, type }))}/>}
            {exerciseSet.reps !== undefined && <ToggleParameter<SetSide> options={sideOptions} value={exerciseSet.side || SetSide.BOTH}
                                                                         onChange={(side: SetSide) => setExerciseSet((prevState) => ({ ...prevState, side }))}/>}
            <SetParameter name={t("set")} value={setNumber} min={setNumber}
                          max={setNumber} disabled />

            <Box sx={{overflow: "auto", flexShrink: 1, marginTop: "8px", marginBottom: "8px"}}>
                

                <Parameter name={t("weight")} unit={useLbs ? "lbs" : "kg"} value={exerciseSet.weight} min={0}
                               incrementBy={2.5}
                               onToggle={(enabled) => setExerciseSet((prevState) => ({...prevState, weight: enabled ? set.weight || 0 : undefined}))}
                               allowDecimals onChange={(weight) => setExerciseSet((prevSet) => ({...prevSet, weight}))}/>
                <Parameter name={t("reps")} value={exerciseSet.reps} min={1} incrementBy={1}
                           onToggle={(enabled) => setExerciseSet((prevState) => ({...prevState, reps: enabled ? set.reps || 0 : undefined}))}
                           onChange={(reps) => setExerciseSet((prevSet) => ({...prevSet, reps}))}/>
                <Parameter name={t("time")} unit="min" value={exerciseSet.time} min={0} incrementBy={1} allowDecimals
                           onToggle={(enabled) => setExerciseSet((prevState) => ({...prevState, time: enabled ? set.time || 0 : undefined}))}
                           onChange={(time) => setExerciseSet((prevSet) => ({...prevSet, time}))}/>
                <Parameter name={t("distance")} unit="m" value={exerciseSet.distance} min={0} incrementBy={1} allowDecimals
                           onToggle={(enabled) => setExerciseSet((prevState) => ({...prevState, distance: enabled ? set.distance || 0 : undefined}))}
                           onChange={(distance) => setExerciseSet((prevSet) => ({...prevSet, distance}))}/>
                <Parameter name={t("laps")} value={exerciseSet.laps } min={0} incrementBy={1} allowDecimals
                           onToggle={(enabled) => setExerciseSet((prevState) => ({...prevState, laps: enabled ? set.laps || 0 : undefined}))}
                           onChange={(laps) => setExerciseSet((prevSet) => ({...prevSet, laps}))}/>
                {showRpe && <Parameter name={t("rpe")} value={exerciseSet.rpe} min={0} incrementBy={1} max={10}
                                       onToggle={(enabled) => setExerciseSet((prevState) => ({...prevState, rpe: enabled ? set.rpe || 0 : undefined}))}
                                       onChange={(rpe) => setExerciseSet((prevSet) => ({...prevSet, rpe}))}/>}
                {showRir && <Parameter name={t("rir")} value={exerciseSet.rir} min={0} incrementBy={1} max={10}
                                       onToggle={(enabled) => setExerciseSet((prevState) => ({...prevState, rir: enabled ? set.rir || 0 : undefined}))}
                                       onChange={(rir) => setExerciseSet((prevSet) => ({...prevSet, rir}))}/>}
                <Parameter name={t("rest")} unit="s" value={exerciseSet.rest} min={0} incrementBy={10}
                           onToggle={(enabled) => setExerciseSet((prevState) => ({...prevState, rest: enabled ? set.rest || 0 : undefined}))}
                           onChange={(rest) => setExerciseSet((prevSet) => ({...prevSet, rest}))} />

            </Box>
            <TextField sx={{width: "100%"}} label={t("cues")} value={exerciseSet.cues} onChange={(ev) => setExerciseSet((prevState) => ({...prevState, cues: ev.target.value}))} />
        </DialogContent>
        <ConfirmDialog title={t("confirmDeleteSet.title")} message={t("confirmDeleteSet.message")} open={confirmDelete} onDismiss={(r) => {
            setConfirmDelete(false);
            if (r) {
                onDelete();
                onClose();
            }
        }}/>
        <DialogActions sx={{ display: "flex", flexDirection: "row" }}>
            <Button onClick={() => setConfirmDelete(true)} autoFocus color="error">
                {t("delete")}
            </Button>
            <span style={{flexGrow: 1}}>&nbsp;</span>
            <Button onClick={onClose} autoFocus>
                {t("cancel")}
            </Button>
            <Button onClick={() => {
                onChange(exerciseSet);
                onClose();
            }}>{t("ok")}</Button>
        </DialogActions>
    </Dialog>
}

export default SetEditor;
