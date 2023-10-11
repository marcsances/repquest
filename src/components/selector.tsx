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
}

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
    title: string;
    entries: KeyValue<string, string, SelectorExtras>[];
}

const Selector = (props: SimpleDialogProps) => {
    const { onClose, selectedValue, open, title, entries } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <List sx={{ padding: "16px" }}>
                {entries.map((it) => (<ListItem sx={{ display: "flex", flexDirection: "row" }}disableGutters key={it.key} onClick={() => handleListItemClick(it.key)}>
                    <ListItemButton sx={{ flexGrow: 1 }}
                        autoFocus
                    >
                        {it.icon && <ListItemAvatar><Avatar>{it.icon}</Avatar></ListItemAvatar>}
                        <ListItemText primary={it.value} />
                    </ListItemButton>
                    {it.extras?.action && <IconButton sx={{ flexShrink: 1 }} onClick={(e) => { e.stopPropagation(); if (it.extras?.action) it.extras?.action()}}>{it.extras?.actionIcon}</IconButton>}
                </ListItem>))}
            </List>
        </Dialog>
    );
}

export default Selector;
