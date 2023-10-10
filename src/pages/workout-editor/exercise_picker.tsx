import * as React from "react";
import {ExerciseList} from "./exercise_list";
import {Dialog} from "@mui/material";
import {Exercise} from "../../models/exercise";

export interface ExercisePickerProps {
    open: boolean;
    onClose: () => void;
    onSelectExercise: (exercise: Exercise) => void;
}


const ExercisePicker = (props: ExercisePickerProps) => {
    const { onClose, onSelectExercise, open} = props;
    return <Dialog open={open} fullScreen onClose={onClose}>
        <ExerciseList onSelectExercise={(e) => {
            onSelectExercise(e);
            onClose();
        }} onCancel={onClose}/>
    </Dialog>
}

export default ExercisePicker;
