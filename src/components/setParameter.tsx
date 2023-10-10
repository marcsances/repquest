import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";
import React, {useState} from "react";

export interface SetParameterProps {
    name: string;
    value: number;
    onChange?: (value: number) => void;
    incrementBy?: number;
    min?: number;
    max?: number;
    allowDecimals?: boolean;
    disabled?: boolean;
}

const SetParameter = (props: SetParameterProps) => {
    const {name, value, onChange, incrementBy, min, max, allowDecimals, disabled} = props;
    const [val, setVal] = useState(value);

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseFloat(e.target.value);
        if ((min && num < min) || (max && num > max) || !e.target.value) {
            return;
        }
        const newVal = allowDecimals ? num : Math.floor(num);
        setVal(newVal);
        if (onChange) onChange(newVal);
    }

    const onPrev = () => {
        const newVal = val - (incrementBy || 1);
        if ((min && newVal < min) || (max && newVal > max)) {
            return;
        }
        setVal(newVal);
        if (onChange) onChange(newVal);
    }

    const onNext = () => {
        const newVal = val + (incrementBy || 1);
        if ((min && newVal < min) || (max && newVal > max)) {
            return;
        }
        setVal(newVal);
        if (onChange) onChange(newVal);
    }

    return <Box sx={{display: "flex", flexDirection: "row", margin: "8px"}}>
        <Typography sx={{marginRight: "8px", alignSelf: "center", width: "200px"}}>{name}</Typography>
        <TextField
            id="outlined-number"
            type="number"
            value={val}
            variant="standard"
            sx={{flexGrow: 1}}
            disabled
            onChange={onChangeInput}
            inputProps={{style: {textAlign: "right"}}}
        />
        <Box sx={{marginLeft: "8px", alignSelf: "center", width: "48px"}}/>
        {!disabled && <><IconButton onClick={onPrev} color="primary" size="small" aria-label="add" sx={{marginLeft: "8px"}} disabled={min || disabled ? (min && val <= min) || disabled : false}>
            <ArrowLeftIcon/>
        </IconButton>
        <IconButton onClick={onNext} color="primary" size="small" aria-label="add" sx={{marginLeft: "4px"}} disabled={max || disabled ? (max && val >= max) || disabled : false}>
            <ArrowRightIcon/>
        </IconButton></>}
    </Box>
}

export default SetParameter;
