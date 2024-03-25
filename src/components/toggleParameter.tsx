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
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import Box from "@mui/material/Box";
import React, {CSSProperties} from "react";
import KeyValue from "../models/keyvalue";

export interface ToggleParameterProps<K> {
    name?: string;
    options: KeyValue<K, string>[];
    value: K | K[];
    onChange: ((key: K) => void) | ((key: K[]) => void);
    sx?: CSSProperties;
    multi?: boolean;
}

const ToggleParameter = function <T> (props: ToggleParameterProps<T>) {
    const {name, value, options, onChange, sx, multi} = props;

    const onChangeEv = (
        event: React.MouseEvent<HTMLElement>,
        newVal: any,
    ) => onChange(newVal as any);

    return <Box sx={{display: "flex", flexDirection: "row", margin: "8px", maxWidth: "100%", overflow: "auto", textOverflow: "ellipsis", whiteSpace: "nowrap", ...sx}}>
        {name && <Typography sx={{marginRight: "8px", alignSelf: "center", width: "200px"}}>{name}</Typography>}
        <ToggleButtonGroup
            color="primary"
            value={value}
            exclusive={!multi}
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
