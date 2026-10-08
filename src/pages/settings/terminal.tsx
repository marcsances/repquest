/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Box, IconButton, InputAdornment, Snackbar, TextField} from "@mui/material";
import { SettingsContext } from "../../context/settingsContext";
import getId from "../../utils/id";
import { ClearAll, Download, Refresh, Send } from "@mui/icons-material";
import { DBContext } from "../../context/dbContext";
import { WorkoutContext } from "../../context/workoutContext";
import { UserContext } from "../../context/userContext";
import { TimerContext } from "../../context/timerContext";

declare let window: any;

export const Terminal = () => {
    const {t} = useTranslation();
    const {devTools, saveDevTools} = useContext(SettingsContext);
    const [reload, setReload] = useState(getId());
    const logs = useMemo(() => (window.messages as any[]).map((message, idx) => ({message, id: getId() + message.substring(0, 10)})), [reload]);
    const [val, setVal] = useState("");
    const listRef = useRef<HTMLDivElement>();
    window.context = {};
    window.context.db = useContext(DBContext).db;
    window.context.workout = useContext(WorkoutContext);
    window.context.user = useContext(UserContext);
    window.context.timer = useContext(TimerContext);
    window.context.settings = useContext(SettingsContext);


    const onEnter = () => {
        try {
            window.messages.push("> " + val);
            window.messages.push("< " + eval(val));
        } catch (err) {
            console.error(err);
        } finally {
            setVal("");
            setTimeout(() => setReload(getId()), 500); // give some time for async promises
            if (listRef.current) {
                listRef.current.scrollTo(0, listRef.current.scrollHeight);
            }
        }
    }

    return <Layout title={t("devTools.jsConsole")} hideNav scroll toolItems={<><IconButton onClick={() => setReload(getId())}><Refresh /></IconButton><IconButton onClick={() => {window.messages = []; setReload(getId())}}><ClearAll /></IconButton><IconButton title={t("wrapped.download")} onClick={() => {
            const blob = new Blob([logs.map((log) => log.message.toString()).join("\n")], {type: "application/octet-stream"});
            const blobUrl = URL.createObjectURL(blob);;
            const link = document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute("download", "repquest-logs-" + new Date().toJSON() + ".log");
            link.href = blobUrl;
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
    }}><Download /></IconButton></>}>
        <Box sx={{padding: "20px", width: "calc(100% - 40px)", height: "calc(100vh - 164px)", overflow: "auto", paddingBottom: "48px"}} ref={listRef}>
        
            {logs.map((log) => <Typography key={log.id} sx={{fontFamily: "monospace", fontSize: "10px"}}>{log.message}</Typography>)}
            
        </Box>
        <TextField variant="filled"  size="small" sx={{padding: 0, width: "100%"}} placeholder=">" value={val} onChange={(ev) => { setVal(ev.target.value) }} InputProps={{onKeyDown: (ev) => { if (ev.key === "Enter") onEnter()}, endAdornment: <InputAdornment position="end">
                    <IconButton size="small" color="inherit" onClick={(ev) => { ev.stopPropagation(); onEnter(); }}>
                        <Send sx={{width: "16px"}} />
                    </IconButton>
                </InputAdornment>}} />
    </Layout>;
}
