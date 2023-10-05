import React, {useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Box, Card, CardContent, Fab, ListItemButton, ListItemText, Snackbar, Stack, TextField} from "@mui/material";
import {Exercise, ExerciseTag} from "../../models/exercise";
import {useParams} from "react-router-dom";
import {DBContext} from "../../context/dbContext";
import {ContentPaste, Save} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

export const ExerciseEditor = () => {
    const {t} = useTranslation();
    const { db } = useContext(DBContext);
    const [ exercise, setExercise ] = useState<Exercise | undefined>();
    const { exerciseId } = useParams();
    const [ isYtError, setIsYtError ] = useState(false);
    const [ displayYt, setDisplayYt ] = useState(exercise?.yt_video);
    const [ notImplemented, setNotImplemented ] = useState(false);

    useEffect(() => {
        setDisplayYt(exercise?.yt_video);
    }, [exercise?.yt_video]);
    useEffect(() => {
        if (!db || !exerciseId) return;
        db.exercise.get(parseInt(exerciseId)).then((exercise) => setExercise(exercise));
    }, [exerciseId, db]);

    const updateYt = (url: string) => {
        if (!exercise) return;
        const match = Array.from(url.matchAll(/(?:.*?)?(?:^|\/|v=)?([a-z0-9_-]{11})(?:.*)?/gim))[0]
        if (match) {
            setIsYtError(false);
            setExercise({...exercise, yt_video: match[1]});
        } else {
            setIsYtError(true);
        }
    }

    return <Layout title={exercise?.name || t("loading")} hideNav>
        {!!exercise && <Card variant="outlined" sx={{padding: "20px"}}>
                <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "15px"}}>
                    <TextField
                        sx={{width: "100%"}}
                        required
                        label={t("workoutEditor.name")}
                        value={exercise?.name}
                        onChange={(ev) => setExercise({...exercise, name: ev.target.value})}
                    />
                    <Typography>{t("workoutEditor.type")}</Typography>
                    <ListItemButton sx={{padding: 0}}>
                        <ListItemText primary={t("workoutEditor.tags")} secondary={exercise?.tags.map((tag) => (t("tags." + ExerciseTag[tag].toLowerCase()))).join(", ")}/>
                    </ListItemButton>
                    <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}}>
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
                        <IconButton>
                            <ContentPaste onClick={() => {
                                navigator.clipboard
                                    .readText()
                                    .then(updateYt);
                            }}/>
                        </IconButton>
                    </Stack>
                    </Box>
                </CardContent>
        </Card>}
        <Fab color="primary" sx={{position: 'fixed', bottom: 16, right: 16, zIndex: 1}}
                   onClick={() => setNotImplemented(true)}>
            <Save/>
        </Fab>

        <Snackbar
            open={notImplemented}
            autoHideDuration={2000}
            onClose={() => setNotImplemented(false)}
            message={t("notImplemented")}
        />
    </Layout>;
}
