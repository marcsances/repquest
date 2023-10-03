import {Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {useTranslation} from "react-i18next";
import React from "react";
import KeyValue from "../models/keyvalue";

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
    title: string;
    entries: KeyValue[];
}

const Selector = (props: SimpleDialogProps) => {
    const { onClose, selectedValue, open, title, entries } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };
    const { t } = useTranslation();

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <List sx={{ padding: "16px" }}>
                {entries.map((it) => (<ListItem disableGutters key={it.key} onClick={() => handleListItemClick(it.key)}>
                    {it.icon && <ListItemAvatar><Avatar>{it.icon}</Avatar></ListItemAvatar>}
                    <ListItemButton
                        autoFocus
                    >
                        <ListItemText primary={it.value} />
                    </ListItemButton>
                </ListItem>))}
            </List>
        </Dialog>
    );
}

export default Selector;
