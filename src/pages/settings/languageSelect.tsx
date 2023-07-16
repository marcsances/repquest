import {Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {useTranslation} from "react-i18next";

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

const LanguageSelector = (props: SimpleDialogProps) => {
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
            <DialogTitle>{t("language")}</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick('ca')}
                    >
                        <ListItemText primary="Català" />
                    </ListItemButton>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick('en')}
                    >
                        <ListItemText primary="English" />
                    </ListItemButton>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick('es')}
                    >
                        <ListItemText primary="Español" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default LanguageSelector;