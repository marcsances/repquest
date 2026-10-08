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
import React, { useCallback, useContext, useMemo, useState } from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Box, IconButton, Snackbar} from "@mui/material";
import { SettingsContext } from "../../context/settingsContext";
import getId from "../../utils/id";
import { ClearAll, Download, Refresh } from "@mui/icons-material";

declare let window: any;

export const ConsoleLogs = () => {
    const {t} = useTranslation();
    const {devTools, saveDevTools} = useContext(SettingsContext);
    const [reload, setReload] = useState(getId());
    const logs = useMemo(() => (window.messages as any[]).map((message, idx) => ({message, id: getId() + message.substring(0, 10)})), [reload]);
    
    return <Layout title={t("devTools.consoleLogs")} hideNav scroll toolItems={<><IconButton onClick={() => setReload(getId())}><Refresh /></IconButton><IconButton onClick={() => {window.messages = []; setReload(getId())}}><ClearAll /></IconButton><IconButton title={t("wrapped.download")} onClick={() => {
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
        <Box sx={{padding: "20px", width: "calc(100% - 40px)", height: "calc(100vh - 96px)", overflow: "auto"}}>
        
            {logs.map((log) => <Typography key={log.id} variant="subtitle2">{log.message}</Typography>)}
            
        </Box>
    </Layout>;
}
