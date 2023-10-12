import React, {useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Fab,
    ListItemButton,
    ListItemText,
    Snackbar,
    TextField
} from "@mui/material";
import {Exercise, ExerciseTag} from "../../models/exercise";
import {useNavigate, useParams} from "react-router-dom";
import {DBContext} from "../../context/dbContext";
import {Clear, Link, Save} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Selector from "../../components/selector";
import CollectionsIcon from "@mui/icons-material/Collections";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import IconButton from "@mui/material/IconButton";
import ConfirmDialog from "../../components/confirmDialog";
import TagPicker from "./tag_picker";

export interface ExerciseEditorProps {
    onSaved?: (exercise: Exercise) => void;
    onClose?: () => void;
}

export const ExerciseEditor = (props: ExerciseEditorProps) => {
    const { onClose, onSaved } = props;
    const {t} = useTranslation();
    const { db } = useContext(DBContext);
    const [ exercise, setExercise ] = useState<Exercise | null>(null);
    const { exerciseId } = useParams();
    const [ unsavedChanges, setUnsavedChanges ] = useState(false);
    const [ isYtError, setIsYtError ] = useState(false);
    const [ displayYt, setDisplayYt ] = useState(exercise?.yt_video || "");
    const [ snackbar, setSnackbar ] = useState<string | null>(null);
    const [ pictureSelectorOpen, setPictureSelectorOpen ] = useState(false);
    const [ confirmDeleteOpen, setConfirmDeleteOpen ] = useState(false);
    const [ required, setRequired ] = useState(false);
    const [ tagPicker, setTagPicker ] = useState(false);
    const navigate = useNavigate();

    const getBase64 = (file: File) => {
        return new Promise<string | undefined>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result?.toString());
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    const fetch = () => {
        if (!db) return;
        if (onSaved || exerciseId === "new") {
            setExercise({
                id: Math.floor(new Date().getTime() * 100 + (Math.random() % 100)),
                name: "",
                tags: []
            });
            setUnsavedChanges(false);
            return;
        }
        if (!exerciseId) return;
        db.exercise.get(parseInt(exerciseId)).then((exercise) => setExercise(exercise || null));
        setUnsavedChanges(false);
    }

    useEffect(() => {
        setDisplayYt(exercise?.yt_video || "");
    }, [exercise?.yt_video]);

    useEffect(fetch, [exerciseId, db]);

    const updateYt = (url: string) => {
        if (!exercise) return;
        if (url === "") {
            setIsYtError(false);
            setExercise({...exercise, yt_video: undefined});
            return;
        }
        const match = Array.from(url.matchAll(/(?:.*?)?(?:^|\/|v=)?([a-z0-9_-]{11})(?:.*)?/gim))[0]
        if (match) {
            setIsYtError(false);
            setExercise({...exercise, yt_video: match[1]});
            setUnsavedChanges(true);
        } else {
            setIsYtError(true);
        }
    }

    const save = () => {
        if (!exercise) return;
        if (exercise.name.length === 0) {
            setRequired(true);
            return;
        }
        db?.exercise.put(exercise).then(() => {
            setSnackbar(t("saved"));
            setUnsavedChanges(false);
            if (onSaved) onSaved(exercise);
            if (onClose) onClose();
        }).catch((e) => {
            console.error(e);
            setSnackbar(t("somethingWentWrong"));
        });
    }

    const portrait = (window.screen.orientation.angle % 180 === 0);

    return <Layout leftToolItems={onClose ?
        <IconButton sx={{mr: 2}} size="large" edge="start" color="inherit"
                    onClick={onClose}><CloseIcon/></IconButton> : <></>} hideBack={!!onClose}
                   title={exercise?.name || t(exerciseId === "new" ? "addExercise" : "loading")} hideNav scroll toolItems={!!exercise && exerciseId !== "new" ? <IconButton color="inherit" onClick={() => setConfirmDeleteOpen(true)}><DeleteIcon /></IconButton> : <></>}>
        {!!exercise && <Card variant="outlined" sx={{padding: "20px"}}>
                <CardContent>
                    {exercise.picture && <CardMedia
                        sx={{height: "30" + (portrait ? "vh" : "vw")}}
                        image={exercise.picture}
                        title={exercise.name}
                        onClick={() => setPictureSelectorOpen(true)}
                    />}
                    {!exercise.picture && <CardActionArea sx={{height: "30" + (portrait ? "vh" : "vw"), width: "100%", display: "flex", flexDirection: "column", gap: "30px", justifyContent: "center", alignItems: "center"}} onClick={() => setPictureSelectorOpen(true)}>
                        <Fab color="primary">
                            <UploadFileIcon/>
                        </Fab>
                        <Typography color="grey.400">{t("workoutEditor.uploadPicture")}</Typography>
                    </CardActionArea>}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "16px"}}>
                    <TextField
                        sx={{width: "100%"}}
                        required
                        label={t("workoutEditor.name")}
                        value={exercise.name || ""}
                        error={required}
                        helperText={required ? t("errors.requiredField") : ""}
                        onChange={(ev) => {
                            setExercise({...exercise, name: ev.target.value});
                            setUnsavedChanges(true);
                        }}
                    />
                    <ListItemButton sx={{padding: 0}} onClick={() => setTagPicker(true)}>
                        <ListItemText primary={t("workoutEditor.tags")} secondary={exercise?.tags.map((tag) => (t("tags." + ExerciseTag[tag].toLowerCase()))).join(", ")}/>
                    </ListItemButton>
                    <TextField
                        sx={{width: "100%"}}
                        error={isYtError}
                        helperText={isYtError ? t("errors.pleaseValidYoutubeUrl") : undefined}
                        label={t("workoutEditor.youtubeId")}
                        value={displayYt}
                        onChange={(ev) => setDisplayYt(ev.target.value)}
                        onBlur={(ev) => {
                            updateYt(ev.target.value)
                        }}

                    />
                    </Box>
                </CardContent>

            <Selector open={pictureSelectorOpen} selectedValue="cancel" onClose={(key: string) => {
                if (key === "enterPictureUrl") {
                    const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
                    const url = prompt(t("workoutEditor.enterPictureUrl"));
                    if (url && httpRegex.test(url)) {
                        setExercise({...exercise, picture: url});
                        setUnsavedChanges(true);
                    }
                    else setSnackbar(t("errors.invalidUrl"));
                } else if (key === "clearImage") {
                    setExercise({...exercise, picture: undefined});
                    setUnsavedChanges(true);
                } else if (key === "uploadPicture") {
                    const input = document.createElement('input');
                    input.setAttribute('accept', 'image/*');
                    input.setAttribute('type', 'file');
                    document.body.appendChild(input);
                    input.onchange = () => {
                        if (input.files && input.files[0]) getBase64(input.files[0]).then((url: string | undefined) => {
                            if (url) {
                                setExercise({...exercise, picture: url})
                                setUnsavedChanges(true);
                            }
                        }).catch(() => {
                            setSnackbar(t("somethingWentWrong"));
                        }).finally(() => {
                            input.parentNode?.removeChild(input);
                        })
                        else input.parentNode?.removeChild(input);
                    };
                    input.click();
                }
                setPictureSelectorOpen(false);
            }} title={t("workoutEditor.uploadPicture")} entries={[
                {key: "uploadPicture", value: t("workoutEditor.uploadPicture"), icon: <CollectionsIcon/>},
                {key: "enterPictureUrl", value: t("workoutEditor.enterPictureUrl"), icon: <Link/>},
                {key: "clearImage", value: t("workoutEditor.clearPicture"), icon: <DeleteIcon/>},
                {key: "cancel", value: t("cancel"), icon: <CloseIcon/>}]}></Selector>
        </Card>}
        {unsavedChanges && <>
            <Fab color="secondary" sx={{position: 'fixed', bottom: 96, right: 16, zIndex: 1}}
                 onClick={fetch}>
                <Clear/>
            </Fab>
            <Fab color="primary" sx={{position: 'fixed', bottom: 16, right: 16, zIndex: 1}}
                   onClick={save}>
            <Save/>
        </Fab></>}

        <Snackbar
            open={snackbar !== null}
            autoHideDuration={2000}
            onClose={() => setSnackbar(null)}
            message={snackbar}
        />

        {tagPicker && exercise && <TagPicker value={exercise.tags} open title={t("selectTags")} onClose={() => setTagPicker(false)} onChange={(tags) => {
            setExercise({...exercise, tags});
            setUnsavedChanges(true);
        }}/>}

        <ConfirmDialog title={t("confirmDeleteExercise.title")} message={t("confirmDeleteExercise.message")} open={confirmDeleteOpen} onDismiss={(r) => {
            if (r && db && exercise && exerciseId !== "new") {
                db.exercise.put({
                    ...exercise,
                    deleted: true
                }).then(() => {
                    navigate(-1);
                }).catch((e) => {
                    console.error(e);
                    setSnackbar(t("somethingWentWrong"));
                });
            }
            setConfirmDeleteOpen(false);
        }}/>
    </Layout>;
}
