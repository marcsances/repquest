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
import {useTranslation} from "react-i18next";
import * as React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onDismiss: (ok: boolean) => void;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const { open, title, message, onDismiss } = props;
    const { t } = useTranslation();
    return <Dialog open={open} onClose={() => onDismiss(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            {message}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => onDismiss(false)} autoFocus>
                {t("cancel")}
            </Button>
            <Button onClick={() => onDismiss(true)}>{t("ok")}</Button>
        </DialogActions>
    </Dialog>
}

export default ConfirmDialog;
