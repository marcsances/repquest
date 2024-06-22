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
import {Avatar, ListItem, Stack} from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";

export interface ColorPickerProps {
    value?: string;
    onChange: (value: string) => void;
    colors: string[];
    maxCols?: number;
}

const ColorPicker = (props: ColorPickerProps) => {
    const { value, onChange, colors, maxCols } = props;
    const slices = [];
    if (maxCols) {
        for (var i = 0; i < colors.length / maxCols; i++) {
            slices.push(colors.slice(i * maxCols, i * maxCols + maxCols));
        }
    } else {
        slices.push(colors);
    }

    const handleListItemClick = (value: string) => {
        onChange(value);
    };

    return <>{slices.map((colors) => <Stack direction="row" key={colors[0]}>
                {colors.map((color) => (<ListItem sx={{display: "flex", flexDirection: "row"}} dense disableGutters key={color}
                                                onClick={() => handleListItemClick(color)}>
                    <IconButton color="inherit" sx={{ flexGrow: 1 }}
                                    autoFocus
                    >
                        <Avatar
                            sx={{bgcolor: color, width: value === color ? 64 : 48, height: value === color ? 64 : 48, margin: 0}}>&nbsp;</Avatar>
                    </IconButton>
                </ListItem>))}
            </Stack>)}
    </>;
}

export default ColorPicker;
