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
import {Dialog} from "@mui/material";
import OneRmCalculator from "../../components/onermcalc";

export interface OneRmPickerProps {
    weight?: number;
    reps?: number;
    onSelect?: (weight: number, reps: number) => void;
    onClose?: () => void;
    open: boolean;
}


const OneRmPicker = (props: OneRmPickerProps) => {
    const {onClose, weight, reps, onSelect, open} = props;
    return <Dialog open={open} fullScreen onClose={onClose}>
        <OneRmCalculator weight={weight} reps={reps} onSelect={(weight, reps) => {
            if (onSelect) onSelect(weight, reps);
            if (onClose) onClose();
        }} onCancel={onClose}/>
    </Dialog>
}

export default OneRmPicker;
