import {Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useTranslation} from "react-i18next";

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
    title: string;
    entries: { key: string, text: string }[];
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
            <List sx={{ pt: 0 }}>
                {entries.map((it) => (<ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick(it.key)}
                    >
                        <ListItemText primary={it.text} />
                    </ListItemButton>
                </ListItem>))}
            </List>
        </Dialog>
    );
}

export default Selector;