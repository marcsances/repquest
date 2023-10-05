import React, {useContext, useState} from "react";
import Layout from "../../components/layout";
import {WorkoutContext} from "../../context/workoutContext";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    Box,
    CircularProgress,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    ListSubheader
} from "@mui/material";
import BackupIcon from '@mui/icons-material/Backup';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {CloudUpload} from "@mui/icons-material";
import Selector from "../../components/selector";
import {DBContext} from "../../context/dbContext";
import {backupToJSON} from "../../db/backup";
import Typography from "@mui/material/Typography";

export const Backup  = () => {
    const { db } = useContext(DBContext);
    const {focusedExercise} = useContext(WorkoutContext);
    const {t} = useTranslation();
    const [ mode, setMode ] = useState("");
    const [ target, setTarget ] = useState("");
    const [ isWorking, setIsWorking ] = useState(false);
    return <Layout title={t("backup.title")} hideNav>
        <ListSubheader>{t("backup.doBackup")}</ListSubheader>
        <ListItemButton component="a" onClick={() => {
            setMode("backup");
            setTarget("json");
        }} disabled={isWorking}>
            <ListItemAvatar>
                <Avatar>
                    <Box position="relative" display="inline-flex">
                        {isWorking && mode === "backup" && target === "json" && <CircularProgress />}
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
            <ListItemText primary={t("backup.toFile")} secondary={isWorking && mode === "backup" && target === "json" ? t("backup.backingUp") : undefined}/>
        </ListItemButton>
        <ListItemButton component="a" disabled>
            <ListItemAvatar>
                <Avatar>
                    <BackupIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.toGoogleDrive")} secondary={t("comingSoon")} />
        </ListItemButton>
        <ListSubheader>{t("backup.importData")}</ListSubheader>
        <ListItemButton component="a" onClick={() => {
            setMode("restore");
            setTarget("json");
        }} disabled>
            <ListItemAvatar>
                <Avatar>
                    <UploadFileIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.fromFile")} secondary={t("comingSoon")} />
        </ListItemButton>
        <ListItemButton component="a" disabled>
            <ListItemAvatar>
                <Avatar>
                    <CloudUpload/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("backup.toGoogleDrive")} secondary={t("comingSoon")} />
        </ListItemButton>
        <Selector
            selectedValue="cancel"
            open={mode !== "" && !isWorking}
            onClose={(val: string) => {
                if (val !== "cancel" && mode === "backup" && target === "json" && db) {
                    setIsWorking(true);
                    backupToJSON(db, val).then((blobUrl) => {
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
                } else if (val === "cancel") {
                    setMode("")
                    setIsWorking(false);
                }
            }}
            title={t(mode === "backup" ? "backup.whatToBackup" : "backup.whatToImport")}
            entries={[
                { key: "exercises", value: t("backup.items.exercises")},
                { key: "workouts", value: t("backup.items.workouts")},
                { key: "plans", value: t("backup.items.plans")},
                { key: "everything", value: t("backup.items.everything")},
                ...(mode === "restore" ? [{ key: "restoreBackup", value: t("backup.items.restoreBackup")}] : []),
                { key: "cancel", value: t("cancel") }
            ]}
        />
    </Layout>;
}
