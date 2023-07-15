import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import React, {useState} from "react";

export interface ParameterProps {
    name: string;
    unit?: string;
    value: number;
    onChange?: (value: number) => void;
    incrementBy?: number;
    min?: number;
    max?: number;
    allowDecimals?: boolean;
}

const Parameter = (props: ParameterProps) => {
    const {name, value, unit, onChange, incrementBy, min, max, allowDecimals} = props;
    const [val, setVal] = useState(value);

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseFloat(e.target.value);
        if ((min && num < min) || (max && num > max)) {
            return;
        }
        const newVal = allowDecimals ? num : Math.floor(num);
        setVal(newVal);
        if (onChange) onChange(newVal);
    }

    const onAdd = () => {
        const newVal = val + (incrementBy || 1);
        if ((min !== undefined && newVal < min) || (max !== undefined && newVal > max)) {
            return;
        }
        setVal(newVal);
        if (onChange) onChange(newVal);
    }

    const onRemove = () => {
        const newVal = val - (incrementBy || 1);
        if ((min !== undefined && newVal < min) || (max !== undefined && newVal > max)) {
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
            onChange={onChangeInput}
            inputProps={{style: {textAlign: "right"}}}
        />
        <Typography sx={{marginLeft: "8px", alignSelf: "center", width: "48px"}}>{unit}</Typography>
        <IconButton onClick={onRemove} color="primary" size="small" aria-label="add" sx={{marginLeft: "4px"}}>
            <RemoveIcon/>
        </IconButton>
        <IconButton onClick={onAdd} color="primary" size="small" aria-label="add" sx={{marginLeft: "8px"}}>
            <AddIcon/>
        </IconButton>
    </Box>
}

export default Parameter;