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
import {ExerciseList} from "./exercise_list";
import {Dialog} from "@mui/material";
import {Exercise} from "../../models/exercise";

export interface ExercisePickerProps {
    open: boolean;
    onClose?: () => void;
    onBack?: () => void;
    onSelectExercise: (exercise: Exercise) => void;
}


const ExercisePicker = (props: ExercisePickerProps) => {
    const { onClose, onSelectExercise, open, onBack} = props;
    return <Dialog open={open} fullScreen onClose={onClose}>
        <ExerciseList onSelectExercise={(e) => {
            onSelectExercise(e);
            if (onClose) onClose();
        }} onCancel={onBack ? undefined : onClose} onBack={onBack}/>
    </Dialog>
}

export default ExercisePicker;
