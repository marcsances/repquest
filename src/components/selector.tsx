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
import {
    Avatar,
    Dialog,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText
} from "@mui/material";
import React, {ReactElement} from "react";
import KeyValue from "../models/keyvalue";

export interface SelectorExtras {
    action?: () => void;
    actionIcon?: ReactElement;
    buttonColor?: string;
}

export interface SimpleDialogProps {
    open: boolean;
    defaultValue: string;
    onClose: (value: string) => void;
    title: string;
    entries: KeyValue<string, string, SelectorExtras>[];
    dense?: boolean;
}

const Selector = (props: SimpleDialogProps) => {
    const {onClose, defaultValue, open, title, dense, entries} = props;

    const handleClose = () => {
        onClose(defaultValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <List dense={dense} sx={{ padding: "16px" }}>
                {entries.map((it) => (<ListItem sx={{display: "flex", flexDirection: "row"}} disableGutters key={it.key}
                                                onClick={() => handleListItemClick(it.key)}>
                    <ListItemButton sx={{ flexGrow: 1 }}
                        autoFocus
                    >
                        {it.icon && <ListItemAvatar><Avatar
                            sx={it.extras?.buttonColor ? {bgcolor: it.extras.buttonColor} : {}}>{it.icon}</Avatar></ListItemAvatar>}
                        <ListItemText primary={it.value} />
                    </ListItemButton>
                    {it.extras?.action && <IconButton sx={{ flexShrink: 1 }} onClick={(e) => { e.stopPropagation(); if (it.extras?.action) it.extras?.action()}}>{it.extras?.actionIcon}</IconButton>}
                </ListItem>))}
            </List>
        </Dialog>
    );
}

export default Selector;
