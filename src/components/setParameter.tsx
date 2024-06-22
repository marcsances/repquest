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
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";
import React, {useContext, useState} from "react";
import {SettingsContext} from "../context/settingsContext";

export interface SetParameterProps {
    name: string;
    value: number;
    onChange?: (value: number) => void;
    totalSets?: number;
    disabled?: boolean;
    size?: "small" | "standard";
}

const SetParameter = (props: SetParameterProps) => {
    const {name, value, size, onChange, totalSets, disabled} = props;
    const [val, setVal] = useState(value);
    const {theme: appTheme} = useContext(SettingsContext);
    const onPrev = () => {
        const newVal = val - 1;
        if (newVal < 1) {
            return;
        }
        setVal(newVal);
        if (onChange) onChange(newVal);
    }

    const onNext = () => {
        const newVal = val + 1;
        if (totalSets && newVal > totalSets) {
            return;
        }
        setVal(newVal);
        if (onChange) onChange(newVal);
    }

    return <Box sx={{display: "flex", flexDirection: "row", margin: "8px"}}>
        <Typography sx={{marginRight: "8px", alignSelf: "center", width: "200px"}}>{name}</Typography>
        <Typography sx={{
            flexGrow: 1,
            minWidth: "50px",
            whiteSpace: "nowrap",
            display: "inline-block",
            fontSize: size === "small" ? "16px" : "24px",
            textAlign: "right",
            borderBottom: "1px solid " + (appTheme === "light" ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.6)")
        }}>{val}</Typography>
        <Typography sx={{
            width: "30px",
            whiteSpace: "nowrap",
            display: "inline-block",
            fontSize: size === "small" ? "16px" : "24px",
            textAlign: "right",
            paddingLeft: "12px",
            color: "grey"
        }}>/ {totalSets}</Typography>
        <Box sx={{marginLeft: "8px", alignSelf: "center", width: "24px"}}/>
        {!disabled && <><IconButton onClick={onPrev} color="primary" size="small" aria-label="add"
                                    sx={{marginLeft: "8px"}}
                                    disabled={disabled || val <= 1}>
            <ArrowLeftIcon/>
        </IconButton>
            <IconButton onClick={onNext} color="primary" size="small" aria-label="add" sx={{marginLeft: "4px"}}
                        disabled={totalSets || disabled ? (totalSets && val >= totalSets) || disabled : false}>
                <ArrowRightIcon/>
            </IconButton></>}
    </Box>
}

export default SetParameter;
