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
