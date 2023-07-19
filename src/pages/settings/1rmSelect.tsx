import {Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useTranslation} from "react-i18next";

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

const OneRmSelector = (props: SimpleDialogProps) => {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };
    const { t } = useTranslation();

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{t("oneRm")}</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick('epley')}
                    >
                        <ListItemText primary="Epley" />
                    </ListItemButton>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick('brzycki')}
                    >
                        <ListItemText primary="Brzycki" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default OneRmSelector;