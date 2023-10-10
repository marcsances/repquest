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
