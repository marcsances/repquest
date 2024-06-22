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
import Typography from "@mui/material/Typography";
import {Checkbox, InputAdornment, TextField, useMediaQuery} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import React, {ReactElement, useEffect, useState} from "react";

export interface ParameterProps {
    name: string;
    unit?: string;
    value?: number;
    onChange?: (value: number) => void;
    onToggle?: (toggle: boolean) => void;
    increments?: number[];
    min?: number;
    max?: number;
    allowDecimals?: boolean;
    disabled?: boolean;
    error?: string;
    paramButtons?: ReactElement;
}

const Parameter = (props: ParameterProps) => {
    const {name, paramButtons, value, unit, error, onChange, onToggle, increments, min, max, allowDecimals, disabled} = props;
    const [displayVal, setDisplayVal] = useState<string>(value?.toString() || "");
    const [val, setVal] = useState(value);
    const [paramDisabled, setParamDisabled] = useState(value === undefined);
    const [incrementBy, setIncrementBy] = useState((increments || [1])[0]);
    useEffect(() => {
        setParamDisabled(value === undefined)
    }, [value, setParamDisabled]);
    useEffect(() => {
        setVal(value)
    }, [value, setVal]);
    useEffect(() => {
        setDisplayVal(val?.toString() || "");
    }, [val, setDisplayVal]);

    const onChangeInput = () => {
        if (!displayVal || displayVal === "") {
            setDisplayVal(val?.toString() || "");
        }
        const num = parseFloat(displayVal);
        if ((min && num < min) || (max && num > max)) {
            return;
        }
        const newVal = allowDecimals ? num : Math.floor(num);
        setVal(newVal);
        setDisplayVal(newVal.toString());
        if (onChange) onChange(newVal);
    }
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');

    const onAdd = () => {
        const newVal = parseFloat(((val || 0) + (incrementBy || 1)).toFixed(3));
        if ((min !== undefined && newVal < min) || (max !== undefined && newVal > max)) {
            return;
        }
        setVal(newVal);
        setDisplayVal(newVal.toString());
        if (onChange) onChange(newVal);
    }

    const onRemove = () => {
        const newVal = parseFloat(((val || 0) - (incrementBy || 1)).toFixed(3));
        if ((min !== undefined && newVal < min) || (max !== undefined && newVal > max)) {
            return;
        }
        setVal(newVal);
        setDisplayVal(newVal.toString());
        if (onChange) onChange(newVal);
    }

    const shiftIncrements = () => {
        if (!increments) return;
        setIncrementBy((prev) => increments[(increments.indexOf(prev) + 1) % increments.length])
    }

    const isDisabled = val === undefined || disabled;

    return <Box sx={{display: "flex", flexDirection: "row", margin: "8px"}}>
        {onToggle && <Checkbox checked={!paramDisabled} onChange={(ev) => onToggle(ev.target.checked)} />}
        <Typography sx={{marginRight: "8px", alignSelf: "center", width: "200px"}}>{name}</Typography>
        <TextField
            id="outlined-number"
            type="number"
            value={displayVal}
            variant="standard"
            sx={{flexGrow: 1}}
            onChange={(ev) => setDisplayVal(ev.target.value)}
            onBlur={onChangeInput}
            disabled={isDisabled}
            inputProps={{style: {textAlign: "right"}}}
            error={!!error}
            helperText={error}
            InputProps={{ startAdornment: paramButtons ? <InputAdornment position="start">{paramButtons}</InputAdornment> : undefined}}
        />
        <Typography sx={{marginLeft: "8px", alignSelf: "center", width: "48px"}}>{unit}</Typography>
        { !isMini && <IconButton disabled={!increments || isDisabled} onClick={shiftIncrements} color="primary" size="small" sx={{marginLeft: "8px", fontSize: "14px", width: "24px"}}>
            { increments ? incrementBy : "" }
        </IconButton>}
        <IconButton onClick={onRemove} color="primary" size="small" aria-label="add" sx={{marginLeft: "4px"}}
                    disabled={min || isDisabled ? (min && val && val <= min) || isDisabled : false}>
            <RemoveIcon/>
        </IconButton>
        <IconButton onClick={onAdd} color="primary" size="small" aria-label="add" sx={{marginLeft: "8px"}}
                    disabled={min || isDisabled ? (min && val && val <= min) || isDisabled : false}>
            <AddIcon/>
        </IconButton>
    </Box>
}

export default Parameter;
