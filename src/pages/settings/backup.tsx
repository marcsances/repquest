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
import {BackupObject, backupToJSON, importFromJSON} from "../../db/backup";
import Typography from "@mui/material/Typography";
import Loader from "../../components/Loader";

export const Backup = () => {
    const {db} = useContext(DBContext);
    const {focusedExercise} = useContext(WorkoutContext);
    const {t} = useTranslation();
    const [mode, setMode] = useState("");
    const [target, setTarget] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [payload, setPayload] = useState<BackupObject | undefined>();

    const backupJson = (level: string) => {
        if (!db) return;
        setIsWorking(true);
        backupToJSON(db, level).then((blobUrl) => {
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

    const importJson = (level: string) => {
        if (!db || !payload) return;
        setIsWorking(true);
        importFromJSON(db, level, payload).then(() => {
            setMode("");
            setIsWorking(false);
            alert(t("backup.importSuccess"));
            window.location.reload();
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

    const readPayload = () => {
        const input = document.createElement('input');
        input.setAttribute('accept', 'application/json');
        input.setAttribute('type', 'file');
        document.body.appendChild(input);
        input.onchange = () => {
            if (input.files && input.files[0]) readFile(input.files[0]).then((jsonData: unknown) => {
                if (jsonData) {
                    const backup = JSON.parse(jsonData.toString());
                    if (backup.date && backup.exercises) {
                        setPayload(backup as unknown as BackupObject);
                        setMode("restore");
                        setTarget("json");
                    } else {
                        alert(t("errors.invalidJSON"))
                    }
                }
            }).catch(() => {
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
        <ListSubheader>{t("backup.importData")}</ListSubheader>
        <ListItemButton component="a" onClick={() => {
            readPayload();
        }} disabled={isWorking}>
            <ListItemAvatar><Avatar>
                <Box position="relative" display="inline-flex">
                    {isWorking && mode === "restore" && target === "json" && <Loader/>}
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
                          secondary={isWorking && mode === "backup" && target === "json" ? t("backup.importing") : undefined}/>
        </ListItemButton>
        <ListItemButton component="a" disabled>
            <ListItemAvatar>
                <Avatar>
                    <CloudUpload/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.toGoogleDrive")} secondary={t("comingSoon")}/>
        </ListItemButton>
        <Selector
            selectedValue="cancel"
            open={mode !== "" && !isWorking}
            onClose={(val: string) => {
                if (val !== "cancel" && mode === "backup" && target === "json" && db) {
                    backupJson(val);
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
                ...(mode !== "restore" || (payload?.workouts && payload?.workoutExercises) ? [{key: "workouts", value: t("backup.items.workouts")}] : []),
                ...(mode !== "restore" || (payload?.workouts && payload?.workoutExercises && payload?.plans) ? [{key: "plans", value: t("backup.items.plans")}] : []),
                ...(mode !== "restore" || (payload?.workouts && payload?.workoutExercises && payload?.plans && payload?.users && payload?.userMetric && payload?.workoutHistory && payload?.settings) ? [{key: "everything", value: t("backup.items.everything")}] : []),
                ...(mode === "restore" && (payload?.workouts && payload?.workoutExercises && payload?.plans && payload?.users && payload?.userMetric && payload?.workoutHistory && payload?.settings) ? [{key: "restoreBackup", value: t("backup.items.restoreBackup")}] : []),
                {key: "cancel", value: t("cancel")}
            ]}
        />
    </Layout>;
}
