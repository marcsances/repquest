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
import React, {useContext, useState} from "react";
import Layout from "../../components/layout";
import {WorkoutContext} from "../../context/workoutContext";
import {useTranslation} from "react-i18next";
import {Avatar, Box, ListItemAvatar, ListItemButton, ListItemText, ListSubheader} from "@mui/material";
import BackupIcon from '@mui/icons-material/Backup';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {CloudUpload} from "@mui/icons-material";
import Selector from "../../components/selector";
import {DBContext} from "../../context/dbContext";
import {BackupObject, backupToJSON, generateBackup, importFromJSON} from "../../db/backup";
import Typography from "@mui/material/Typography";
import Loader from "../../components/Loader";
import {UserContext} from "../../context/userContext";
import {SettingsContext} from "../../context/settingsContext";
import {Exercise} from "../../models/exercise";
import getId from "../../utils/id";
import {ExerciseSet, Plan, Workout, WorkoutExercise} from "../../models/workout";
import {ApiContext} from "../../context/apiContext";

export const Backup = () => {
    const {db, masterDb} = useContext(DBContext);
    const {focusedExercise} = useContext(WorkoutContext);
    const {apiFetch, logged_in} = useContext(ApiContext);
    const {t} = useTranslation();
    const [mode, setMode] = useState("");
    const [target, setTarget] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [payload, setPayload] = useState<BackupObject | undefined>();

    const {user, userName} = useContext(UserContext);
    const settings = useContext(SettingsContext);

    const backupJson = (level: string) => {
        if (!db || !user) return;
        setIsWorking(true);
        backupToJSON(db, level, user, settings).then((blobUrl) => {
            const link = document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute("download", "weightlog-backup-" + new Date().toJSON() + ".json");
            link.href = blobUrl;
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            setMode("");
            setIsWorking(false);
        })

    }

    const backupWeightCloud = (level: string) => {
        if (!db || !user) return;
        setIsWorking(true);
        generateBackup(db, level, user, settings).then((backup) => {
            apiFetch!<{result: string}>("/backup", "PUT", backup).then((result) => {
                setMode("");
                setIsWorking(false);
            });
        });
    }

    const importJson = (level: string) => {
        if (!db || !payload || !masterDb || !userName) return;
        setIsWorking(true);
        importFromJSON(db, masterDb, userName, level, payload).then(() => {
            setMode("");
            setIsWorking(false);
            alert(t("backup.importSuccess"));
            window.location.href = window.location.origin;
        });
    }

    const readFile = (file: File) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result?.toString());
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        })
    }

    const readFromCloud = () => {
        apiFetch!<{timestamp: string, payload: BackupObject}>("/backup").then((response) => {
            const backup = response.payload?.payload;
            if (response.code === 200 && backup && backup.date && backup.exercises) {
                setPayload(backup as unknown as BackupObject);
                setMode("restore");
                setTarget("json");
            } else {
                return Promise.reject();
            }
        })
    }

    const readPayload = () => {
        const input = document.createElement('input');
        input.setAttribute('accept', 'application/json, text/plain, text/csv');
        input.setAttribute('type', 'file');
        document.body.appendChild(input);
        input.onchange = () => {
            if (input.files && input.files[0]) readFile(input.files[0]).then((payload: unknown) => {
                const data = payload?.toString();
                if (data && data.length > 0 && data[0] === '{') {
                    const backup = JSON.parse(data);
                    if (backup.date && backup.exercises) {
                        setPayload(backup as unknown as BackupObject);
                        setMode("restore");
                        setTarget("json");
                    } else {
                        return Promise.reject();
                    }
                } else if (data && data.length > 5 && data.slice(0, 5) === "Date;") {
                    const exercises: Record<string, Exercise> = {};
                    const sets = [];
                    const workoutExercises: Record<string, WorkoutExercise> = {};
                    const workouts: Record<string, Workout> = {};
                    const initialSets: Record<string, ExerciseSet> = {};
                    for (const line of data.split("\n").slice(1)) {
                        const fields = line.trim().split(";");
                        if (fields.length === 0 || fields[0].length === 0) {
                            continue;
                        }
                        if (fields.length < 18) {
                            return Promise.reject();
                        }
                        const date = fields[0];
                        const day = date.length > 0 ? parseInt(date.slice(0, 2), 10) : undefined;
                        const month = date.length > 0 ? parseInt(date.slice(3, 5), 10) : undefined;
                        const year = date.length > 0 ? parseInt(date.slice(6), 10) : undefined;
                        const time = fields[1];
                        const hour = time.length > 0 ? parseInt(time.slice(0, 2), 10) : undefined;
                        const minute = time.length > 0 ? parseInt(time.slice(3, 5), 10) : undefined;
                        const second = time.length > 0 ? parseInt(time.slice(6), 10) : undefined;
                        const routine = fields[2];
                        const exercise = fields[3]
                        const setN = fields[4].length > 0 ? parseInt(fields[4], 10) : undefined;
                        const weight = fields[5].length > 0 ? parseFloat(fields[5]) : undefined;
                        const reps = fields[6].length > 0 ? parseInt(fields[6], 10) : undefined;
                        const duration = fields[7].length > 0 ? parseInt(fields[7], 10) : undefined;
                        const distance = fields[8].length > 0 ? parseInt(fields[8], 10) : undefined;
                        const para6 = fields[9].length > 0 ? parseInt(fields[9], 10) : undefined;
                        const para7 = fields[10].length > 0 ? parseInt(fields[10], 10) : undefined;
                        const para8 = fields[11].length > 0 ? parseInt(fields[11], 10) : undefined;
                        const para9 = fields[12].length > 0 ? parseInt(fields[12], 10) : undefined;
                        const para10 = fields[13].length > 0 ? parseInt(fields[13], 10) : undefined;
                        const note = fields[14].length > 0 ? parseInt(fields[14], 10) : undefined;
                        const type = fields[15].length > 0 ? parseInt(fields[15], 10) : undefined;
                        const book = fields[16].length > 0 ? parseInt(fields[16], 10) : undefined;
                        const version = fields[17].length > 0 ? parseInt(fields[17], 10) : undefined;
                        const timestamp = year && month ? new Date(year, month - 1, day, hour, minute, second) : new Date();
                        if (!(exercise in exercises)) {
                            exercises[exercise] = {
                                id: getId(),
                                name: exercise,
                                tags: []
                            }
                        }
                        const set: ExerciseSet = {
                            id: getId(),
                            exerciseId: exercises[exercise].id,
                            date: timestamp,
                            setNumber: setN || 1,
                            weight,
                            reps,
                            time: duration,
                            distance,
                            laps: para6,
                            rpe: para7,
                            rir: para8,
                            rest: para9,
                            side: para10,
                            type: type ? type - 1 : 1
                        }
                        sets.push(set);
                        const eid = `${routine}-${exercise}`;
                        initialSets[eid] = set;
                        if (!(eid in workoutExercises)) {
                            workoutExercises[eid] = {
                                id: getId(),
                                setIds: [],
                                exerciseId: exercises[exercise].id,
                                initial: true
                            };
                            if (!(routine in workouts)) {
                                workouts[routine] = {
                                    id: getId(),
                                    name: routine,
                                    daysOfWeek: [],
                                    workoutExerciseIds: [workoutExercises[eid].id]
                                }
                            } else {
                                workouts[routine] = {
                                    id: workouts[routine].id,
                                    name: workouts[routine].name,
                                    daysOfWeek: [],
                                    workoutExerciseIds: workouts[routine].workoutExerciseIds.concat([workoutExercises[eid].id])
                                }
                            }
                        }
                    }
                    Object.entries(initialSets).forEach(([eid, set]) => {
                        const initialSetIds = [];
                        for (let i = set.setNumber || 1; i >= 1; i--) {
                            const initialSet = {...set, id: getId(), initial: true, setNumber: i};
                            sets.push(initialSet);
                            initialSetIds.push(initialSet.id);
                        }
                        workoutExercises[eid].setIds = initialSetIds.reverse();
                    });
                    const plans: Plan[] = [
                        {
                            id: getId(),
                            name: input.files![0].name.split(".")[0],
                            workoutIds: Object.values(workouts).map((it) => it.id)
                        }
                    ]
                    const backup: BackupObject = {
                        date: new Date().toJSON(),
                        exercises: Object.values(exercises),
                        workouts: Object.values(workouts),
                        exerciseSets: sets,
                        workoutExercises: Object.values(workoutExercises),
                        plans: plans
                    };
                    alert(t("csvImportDisclaimer"));
                    setPayload(backup);
                    setMode("restore");
                    setTarget("json");
                } else {
                    return Promise.reject();
                }
            }).catch((e) => {
                alert(t("errors.invalidJSON"));
            }).finally(() => {
                input.parentNode?.removeChild(input);
            })
            else input.parentNode?.removeChild(input);
        };
        input.click();
    }

    return <Layout title={t("backup.title")} hideNav hideBack={isWorking}>
        <ListSubheader>{t("backup.doBackup")}</ListSubheader>
        <ListItemButton component="a" onClick={() => {
            setMode("backup");
            setTarget("json");
        }} disabled={isWorking}>
            <ListItemAvatar>
                <Avatar>
                    <Box position="relative" display="inline-flex">
                        {isWorking && mode === "backup" && target === "json" && <Loader/>}
                        <Box
                            top={0}
                            left={0}
                            bottom={0}
                            right={0}
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography variant="caption" component="div">
                                <FileDownloadIcon sx={{marginTop: "7px"}}/>
                            </Typography>
                        </Box>
                    </Box>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.toFile")}
                          secondary={isWorking && mode === "backup" && target === "json" ? t("backup.backingUp") : undefined}/>
        </ListItemButton>
        <ListItemButton component="a" disabled>
            <ListItemAvatar>
                <Avatar>
                    <BackupIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.toGoogleDrive")} secondary={t("comingSoon")}/>
        </ListItemButton>
        {logged_in && <ListItemButton component="a" onClick={() => {
            setMode("backup");
            setTarget("weightcloud");
        }}>
            <ListItemAvatar>
                <Avatar>
                    <BackupIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.toWeightCloud")}/>
        </ListItemButton>}
        <ListSubheader>{t("backup.importData")}</ListSubheader>
        <ListItemButton component="a" onClick={() => {
            readPayload();
        }} disabled={isWorking}>
            <ListItemAvatar><Avatar>
                <Box position="relative" display="inline-flex">
                    {isWorking && mode === "restore" && <Loader/>}
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="caption" component="div">
                            <UploadFileIcon sx={{marginTop: "7px"}}/>
                        </Typography>
                    </Box>
                </Box>
            </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.fromFile")}
                          secondary={isWorking && mode === "backup" && target === "json" ? t("backup.importing") : ""}/>
        </ListItemButton>
        <ListItemButton component="a" disabled>
            <ListItemAvatar>
                <Avatar>
                    <CloudUpload/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.fromGoogleDrive")} secondary={t("comingSoon")}/>
        </ListItemButton>
        {logged_in && <ListItemButton component="a" onClick={() => {
            readFromCloud();
        }}>
            <ListItemAvatar>
                <Avatar>
                    <CloudUpload/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.fromWeightCloud")} />
        </ListItemButton>}
        <Selector
            defaultValue="cancel"
            open={mode !== "" && !isWorking}
            onClose={(val: string) => {
                if (val !== "cancel" && mode === "backup" && target === "json" && db) {
                    backupJson(val);
                } else if (val !== "cancel" && mode === "backup" && target === "weightcloud" && db) {
                    backupWeightCloud(val);
                } else if (val !== "cancel" && mode === "restore" && target === "json" && db && payload) {
                    if (val === "restoreBackup" && !window.confirm(t("importWillReplaceEverything"))) return;
                    importJson(val);
                } else if (val === "cancel") {
                    setMode("")
                    setIsWorking(false);
                }
            }}
            title={t(mode === "backup" ? "backup.whatToBackup" : "backup.whatToImport")}
            entries={[
                {key: "exercises", value: t("backup.items.exercises")},
                ...(mode !== "restore" || (payload?.workouts && payload?.workoutExercises && payload?.plans) ? [{
                    key: "plans",
                    value: t("backup.items.plans")
                }] : []),
                ...(mode !== "restore" || (payload?.workouts && payload?.workoutExercises && payload?.plans && payload?.exerciseSets) ? [{
                    key: "everything",
                    value: t("backup.items.everything")
                }] : []),
                ...(mode === "restore" && (payload?.workouts && payload?.workoutExercises && payload?.plans && payload?.exerciseSets) ? [{
                    key: "restoreBackup",
                    value: t("backup.items.restoreBackup")
                }] : []),
                {key: "cancel", value: t("cancel")}
            ]}
        />
    </Layout>;
}
