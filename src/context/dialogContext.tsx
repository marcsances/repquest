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
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {t} from "i18next";

export type AlertType = "ok" | "okCancel" | "yesNo";

export const DialogContext = React.createContext({
    showAlert: (title: string, message: string, onResolve: (result: boolean) => void, type: AlertType = "ok") => {
        if (type === "ok") {
                alert(title + (message.length > 0 ? "\n" + message : ""));
                onResolve(true);
                return;
        }
        onResolve(confirm(title + (message.length > 0 ? "\n" + message : "")));
    },
    showPrompt: (title: string, message: string, onResolve: (result: string | null) => void, defaultValue: string = "") => {
        onResolve(prompt(title + (message.length > 0 ? "\n" + message : ""), defaultValue));
    }
} as {
    showAlert: (title: string, message: string, onResolve: (result: boolean) => void, type?: AlertType) => void,
    showPrompt: (title: string, message: string, onResolve: (result: string | null) => void, defaultValue?: string) => void
});


export const DialogContextProvider = (props: { children: ReactElement }) => {
    const {children} = props;
    const [message, setMessage] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [resolve, setResolve] = useState<((result: boolean) => void) | undefined>(undefined);
    const [resolveString, setResolveString] = useState<((result: string | null) => void) | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<AlertType | "prompt">("ok");
    const [val, setVal] = useState<string>("");
    const showAlert = (title: string, message: string, onResolve: (result: boolean) => void, type: AlertType = "ok") => {
        setTitle(title);
        setMessage(message);
        setType(type);
        setResolve(() => onResolve);
        setOpen(true);
    };
    const showPrompt = (title: string, message: string, onResolve: (result: string | null) => void, defaultValue = "") => {
        setTitle(title);
        setMessage(message);
        setVal(defaultValue);
        setType("prompt");
        setResolveString(() => onResolve);
        setOpen(true);
    };

    const boxRef = useRef<HTMLInputElement>();

    useEffect(() => {
        setTimeout(() => {
            if (boxRef && boxRef.current) {
                boxRef.current.click();
            }
        }, 0)
    }, [boxRef, type, open]);

    return <DialogContext.Provider value={{showAlert, showPrompt}}>
        {<Box sx={{zIndex: 10000, display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%"}}><Dialog
            open={open}
            onClose={() => { if (resolve) resolve(false); setOpen(false); }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            { (!!message?.length || type === "prompt") && <DialogContent>
                {message && message.length > 0 && <Typography>{message}</Typography>}
                {type === "prompt" && open && <TextField InputProps={{ref: boxRef}} sx={{width: "100%"}} onChange={(ev) => setVal(ev.target.value)} value={val} />}
            </DialogContent>}
            <DialogActions>
                {type !== "ok" && <Button onClick={() => { if (type !== "prompt" && resolve) resolve(false); if (type === "prompt" && resolveString) resolveString(null); setOpen(false) }} >
                    {type === "yesNo" ? t("no") : t("cancel")}
                </Button>}
                <Button onClick={() => {
                    if (type !== "prompt" && resolve) resolve(true); if (type === "prompt" && resolveString) resolveString(val); setOpen(false);
                }}>{type === "yesNo" ? t("yes") : t("ok")}</Button>
            </DialogActions>
        </Dialog></Box>}
        {children}
    </DialogContext.Provider>
}
