import Typography from "@mui/material/Typography";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import KeyValue from "../models/keyvalue";

export interface ToggleParameterProps<K> {
    name?: string;
    options: KeyValue<K, string>[];
    value: K;
    onChange: (key: K) => void;
}

const ToggleParameter = function <T> (props: ToggleParameterProps<T>) {
    const {name, value, options, onChange} = props;
    const [val, setVal] = useState(value);
    useEffect(() => {
        setVal(value)
    }, [value]);

    const onChangeEv = (
        event: React.MouseEvent<HTMLElement>,
        newVal: any,
    ) => onChange(newVal as unknown as T);

    return <Box sx={{display: "flex", flexDirection: "row", margin: "8px"}}>
        {name && <Typography sx={{marginRight: "8px", alignSelf: "center", width: "200px"}}>{name}</Typography>}
        <ToggleButtonGroup
            color="primary"
            value={value}
            exclusive
            onChange={onChangeEv}
            aria-label="Platform"
            sx={{flexGrow: 1, display: "flex", flexDirection: "row"}}
        >
            {options.map((op) => <ToggleButton sx={{flexGrow: 1}} key={JSON.stringify(op.key)} value={op.key as unknown as NonNullable<unknown>}>
                {op.icon}<span style={op.icon ? {marginLeft: "4px", fontSize: "12px"} : {fontSize: "12px"}}>{op.value}</span>
            </ToggleButton>)}
        </ToggleButtonGroup>
    </Box>
}

export default ToggleParameter;
