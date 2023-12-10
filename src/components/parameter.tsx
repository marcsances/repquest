import Typography from "@mui/material/Typography";
import {Checkbox, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";

export interface ParameterProps {
    name: string;
    unit?: string;
    value?: number;
    onChange?: (value: number) => void;
    onToggle?: (toggle: boolean) => void;
    incrementBy?: number;
    min?: number;
    max?: number;
    allowDecimals?: boolean;
    disabled?: boolean;
}

const Parameter = (props: ParameterProps) => {
    const {name, value, unit, onChange, onToggle, incrementBy, min, max, allowDecimals, disabled} = props;
    const [displayVal, setDisplayVal] = useState<string>(value?.toString() || "");
    const [val, setVal] = useState(value);
    const [paramDisabled, setParamDisabled] = useState(value === undefined);
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

    const onAdd = () => {
        if (!val) return;
        const newVal = val + (incrementBy || 1);
        if ((min !== undefined && newVal < min) || (max !== undefined && newVal > max)) {
            return;
        }
        setVal(newVal);
        setDisplayVal(newVal.toString());
        if (onChange) onChange(newVal);
    }

    const onRemove = () => {
        if (!val) return;
        const newVal = val - (incrementBy || 1);
        if ((min !== undefined && newVal < min) || (max !== undefined && newVal > max)) {
            return;
        }
        setVal(newVal);
        setDisplayVal(newVal.toString());
        if (onChange) onChange(newVal);
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
        />
        <Typography sx={{marginLeft: "8px", alignSelf: "center", width: "48px"}}>{unit}</Typography>
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
