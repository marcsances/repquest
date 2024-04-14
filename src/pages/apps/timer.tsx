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
import React, {useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    Fab,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import StopIcon from '@mui/icons-material/Stop';
import {TimerContext} from "../../context/timerContext";
import {useNavigate} from "react-router-dom";
import {Flag, Pause, PlayArrow} from "@mui/icons-material";

export const Timer = () => {
    const {t} = useTranslation();
    const {time, chrono, setChrono} = useContext(TimerContext);
    const navigate = useNavigate();
    const [stopDialogOpen, setStopDialogOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState<number>(0);


    const getLabel = (timestamp: number) => {
        const hh = Math.floor(timestamp / 3600000);
        const hrms = timestamp % 3600000;
        const mm = Math.floor(hrms / 60000);
        const mrms = hrms % 60000;
        const ss = Math.floor(mrms / 1000);
        const ms = mrms % 1000;
        if (currentTime / 1000 >= 3600) {
            return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
        }
        return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
    }

    useEffect(() => {
        setCurrentTime((chrono?.started ? new Date().getTime() - chrono.started.getTime() : chrono?.paused) || 0);
    }, [chrono, time]);
    
    const bestLap = chrono?.laps && chrono?.laps.length > 0 ? chrono.laps.reduce((it1, it2) => it1 < it2 ? it1 : it2) : 0;

    let progress = 0;

   if (currentTime && chrono?.laps && chrono?.laps.length > 0) {
            progress = Math.min((currentTime / bestLap) * 100, 100);
    }

    return <Layout title={t("appsMenu.timer")} hideNav>
        <Box sx={{height: "100%", width: "100%", display: "flex", flexDirection: "column"}}>
            <TableContainer sx={{flexGrow: 1, width: "auto", margin: "8px"}}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{width: "16px", padding: "4px"}}>{t("lap")}</TableCell>
                            <TableCell align="center" sx={{padding: "4px"}}>{t("time")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {chrono?.laps?.map((lap: number, idx: number) =>
                            <TableRow
                                key={idx}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell sx={{padding: "4px"}} component="th" scope="row">
                                    {idx + 1}
                                </TableCell>
                                <TableCell
                                    sx={{padding: "4px"}} align="center">{getLabel(lap)}</TableCell>
                            </TableRow>
                        )}
                        <TableRow
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell sx={{padding: "4px"}} component="th" scope="row">
                                {(chrono?.laps?.length || 0) + 1}
                            </TableCell>
                            <TableCell
                                sx={{padding: "4px"}} align="center">{getLabel(currentTime)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{flexGrow: 1}}/>
            <Box sx={{ position: 'relative', alignSelf: "center", margin: "12px",  display: 'inline-flex' }}>
                <CircularProgress key={chrono?.laps?.length || 0} variant={chrono?.started && (chrono?.laps?.length || 0) == 0 ? "indeterminate" : "determinate"} value={progress}
                                  sx={{transition: "none", ".MuiCircularProgress-circle": { transition: "none", fill: "gray", fillOpacity: 0.1}}} size="10rem"/>
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h5" sx={{alignSelf: "center"}}>
                        {getLabel(currentTime)}
                    </Typography>
                </Box>
            </Box>
            <Typography variant="h5" sx={{alignSelf: "center", textAlign: "center", color: "rgb(192, 192, 192)"}}>
                {t("lap")}&nbsp;{(chrono?.laps?.length || 0) + 1}
            </Typography>
            <Box sx={{flexGrow: 1}}/>
            <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}} sx={{alignSelf: "center", marginBottom: "24px"}}>
            {(chrono?.started || chrono?.paused) &&
                <Fab color="primary" disabled={!!chrono?.paused} aria-label="lap" onClick={() => setChrono!({started: new Date(), paused: chrono?.paused, laps: (chrono?.laps || []).concat([new Date().getTime() - chrono!.started!.getTime()])})}>
                    <Flag/>
                </Fab>}
            {chrono?.started ?
                <Fab color="warning" aria-label="pause" onClick={() => setChrono!({ started: undefined, laps: chrono?.laps || [], paused: new Date().getTime() - chrono!.started!.getTime() })}>
                    <Pause/>
                </Fab> : <Fab color="success" aria-label="start" onClick={() => setChrono!({ started: chrono?.paused ? new Date(new Date().getTime() - chrono?.paused) : new Date(), laps: chrono?.laps! || [], paused: undefined })}>
                    <PlayArrow/>
                </Fab>}
            {(chrono?.started || chrono?.paused) &&
                <Fab color="error" aria-label="stop" onClick={() => setStopDialogOpen(true)}>
                    <StopIcon/>
                </Fab>}
            </Stack>
            <Dialog
                open={stopDialogOpen}
                onClose={() => setStopDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t("stopTimer")}?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setStopDialogOpen(false)} autoFocus>
                        {t("no")}
                    </Button>
                    <Button onClick={() => {
                        setStopDialogOpen(false)
                        if (setChrono) setChrono({ started: undefined, laps: undefined, paused: undefined});
                    }}>{t("yes")}</Button>
                </DialogActions>
            </Dialog>

        </Box>
    </Layout>
}
