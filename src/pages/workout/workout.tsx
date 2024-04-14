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
    Avatar,
    Box,
    Button,
    Fab,
    Fade,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Popper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery
} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import YouTubeIcon from '@mui/icons-material/YouTube';
import DoneIcon from '@mui/icons-material/Done';
import Parameter from "../../components/parameter";
import SetParameter from "../../components/setParameter";
import {useTranslation} from "react-i18next";
import {WorkoutContext} from "../../context/workoutContext";
import {DBContext} from "../../context/dbContext";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {useNavigate} from "react-router-dom";
import {ExerciseSet, SetType} from "../../models/workout";
import {Rest} from "./rest";
import StopIcon from "@mui/icons-material/Stop";
import {ExerciseTag} from "../../models/exercise";
import {SettingsContext} from "../../context/settingsContext";
import {RestInProgress} from "../../components/restInProgress";
import ToggleParameter from "../../components/toggleParameter";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CollectionsIcon from '@mui/icons-material/Collections';
import {
    AddCircleOutlined,
    CheckBox,
    CheckBoxOutlineBlank,
    ContentCopy,
    Edit,
    ErrorOutlineRounded,
    MonitorWeight,
    MultipleStop,
    RemoveCircleOutlined,
    SwapHoriz,
    Timer
} from "@mui/icons-material";
import getId from "../../utils/id";
import {WorkoutFinished} from "./workoutFinished";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PbsDialog from "../../components/pbsDialog";
import OneRmPicker from "./oneRm_picker";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddExercisePicker from "./addExercisePicker";
import Loader from "../../components/Loader";
import SetEditor from "../workout-editor/set_editor";
import {SupersetViewer} from "../../components/supersetViewer";
import {compareWithDate} from "../../utils/comparators";
import NotesParameter from "../../components/notesparameter";

export const WorkoutPage = () => {
    const {
        followingWorkout,
        focusedExercise,
        currentWorkout,
        currentSet,
        currentSetNumber,
        currentWorkoutExercise,
        currentWorkoutExerciseNumber,
        setCurrentSet,
        setCurrentSetNumber,
        currentWorkoutHistory,
        storedExercises,
        restTime,
        setCurrentWorkoutExerciseNumber,
        saveSet,
        stopWorkout,
        showWorkoutFinishedPage,
        startRest,
        addSet,
        removeSet,
        pbs,
        currentExerciseHistory,
        isFetching,
        refetchHistory,
        superset,
        setSuperset
    } = useContext(WorkoutContext);
    const {showRpe, showRir, useLbs, oneRm, wakeLock,
        toggleWakeLock, saveRpe,
        saveRir, errorWakeLock } = useContext(SettingsContext);
    const {db} = useContext(DBContext);
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [ showRest, setShowRest ] = useState(true);
    const [showPbs, setShowPbs] = useState(false);
    const [oneRmOpen, setOneRmOpen] = useState(false);
    const [addExerciseOpen, setAddExerciseOpen] = useState(false);
    const [swapExerciseOpen, setSwapExerciseOpen] = useState(false);
    const [currentSlice, setCurrentSlice] = useState(20);
    const [editingSet, setEditingSet] = useState<ExerciseSet | undefined>(undefined);
    const [lastUserWeight, setLastUserWeight] = useState<number>(0);
    const [notes, setNotes] = useState<string | undefined>(undefined);
    const [notesEmoji, setNotesEmoji] = useState<string | undefined>(undefined);
    const [notesAnchor, setNotesAnchor] = useState<HTMLElement | undefined>(undefined);
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');
    useEffect(() => {
        if (!db) return;
        db.userMetric.where("metric").equals("body_weight").toArray().then((r) => setLastUserWeight(r.sort(compareWithDate).reverse()[0]?.value || 0))
    }, [db]);
    const save = async () => {
        if (!currentSet || !saveSet) return;
        setShowRest(true);
        return saveSet({
            ...currentSet,
            id: currentSet.initial ? getId() : currentSet.id,
            date: new Date(),
            setNumber: currentSetNumber,
            initial: false
        });
    }

    const [stopDialogOpen, setStopDialogOpen] = useState(false);

    const setOptions = [{
            key: 0,
            value: t("workSet")
        },
        {
            key: 1,
            value: t("warmup")
        },
        {
            key: 2,
            value: t("dropSet")
        },
        {
            key: 3,
            value: t("failure")
        }];

    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchor);
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget);
    };
    const closeMenu = () => {
        setMenuAnchor(null);
    }
    const toolbar = <>
        {pbs && pbs.length > 0 && <IconButton color="inherit" onClick={() => setShowPbs(true)}><EmojiEventsIcon
            color="success"/>&nbsp;<Typography>{pbs.length}</Typography></IconButton>}
        {!isMini && <><Button variant="text" color="inherit" onClick={() => setOneRmOpen(true)}>1RM</Button></>}
        <IconButton aria-label="menu" color="inherit" onClick={openMenu}><MoreVertIcon/></IconButton>
    </>;
    useEffect(() => {
        setCurrentSlice(20);
    }, [currentExerciseHistory, setCurrentSlice]);

    useEffect(() => {
        if (!currentWorkoutHistory) navigate("/");
    }, [currentWorkoutHistory]);

    const delSet = (set: ExerciseSet) => {
        if (!db || !set) return;
        db.exerciseSet.delete(set.id).then(() => {
            if (refetchHistory) refetchHistory();
            setEditingSet(undefined);
        });
    }

    if (!!restTime && showRest) return <Rest onBack={() => setShowRest(false)}/>;
    return <Layout title={followingWorkout?.name || t("freeTraining")} hideNav
                   toolItems={toolbar}>
        {isFetching && <Loader/>}
        {(showWorkoutFinishedPage || stopDialogOpen) && <WorkoutFinished addExercise={() => { setStopDialogOpen(false); setAddExerciseOpen(true)}} stopWorkoutCancel={stopDialogOpen ? () => {
            setStopDialogOpen(false);
        } : undefined}/>}
        {showPbs && <PbsDialog onClose={() => setShowPbs(false)}/>}

        <Menu
            anchorEl={menuAnchor}
            open={menuOpen}
            onClose={closeMenu}
            MenuListProps={{
                'aria-labelledby': 'menu',
            }}
        >
            {focusedExercise?.yt_video && <MenuItem onClick={() => { navigate("/youtube"); closeMenu(); }}>
                <ListItemIcon><YouTubeIcon /></ListItemIcon>
                <ListItemText>{t("actions.viewOnYoutube")}</ListItemText>
            </MenuItem>}
            <MenuItem onClick={() => { navigate("/picture"); closeMenu(); }}>
                <ListItemIcon><CollectionsIcon /></ListItemIcon>
                <ListItemText>{t("actions.viewPicture")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                if (addSet) addSet();
                closeMenu()
            }}>
                <ListItemIcon><AddCircleOutlined/></ListItemIcon>
                <ListItemText>{t("actions.addSet")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                if (removeSet) removeSet();
                closeMenu()
            }}>
                <ListItemIcon><RemoveCircleOutlined/></ListItemIcon>
                <ListItemText>{t("actions.removeSet")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                setAddExerciseOpen(true);
                closeMenu()
            }}>
                <ListItemIcon><FitnessCenterIcon/></ListItemIcon>
                <ListItemText>{t("addExercise")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                if (startRest && currentSet && currentSet.rest) startRest(currentSet.rest);
                closeMenu()
            }}>
                <ListItemIcon><Timer/></ListItemIcon>
                <ListItemText>{t("actions.startRest")}</ListItemText>
            </MenuItem>
            {!superset && currentWorkout && currentWorkout.workoutExerciseIds && (currentWorkoutExerciseNumber < currentWorkout!.workoutExerciseIds!.length - 1) && <MenuItem onClick={() => {
                if (setSuperset) setSuperset({ current: 1, size: 2 });
                closeMenu()
            }}>
                <ListItemIcon><MultipleStop/></ListItemIcon>
                <ListItemText>{t("startSuperset")}</ListItemText>
            </MenuItem>}
            {"wakeLock" in navigator && !errorWakeLock && toggleWakeLock &&
                <MenuItem onClick={toggleWakeLock} disabled={errorWakeLock}>
                    <ListItemIcon>
                        {wakeLock && !errorWakeLock && <CheckBox />}
                        {!wakeLock && !errorWakeLock && <CheckBoxOutlineBlank/>}
                        {errorWakeLock && <ErrorOutlineRounded/>}
                    </ListItemIcon>
                <ListItemText>{errorWakeLock ? t("errorWakeLock") : t("wakeLock")}</ListItemText>
                </MenuItem>}
        </Menu>
        <Box sx={{height: "calc(100% - 16px)", display: "flex", flexDirection: "column"}}>
            <ListItem>
                {!isMini && <ListItemIcon>{focusedExercise?.picture && <Avatar variant="rounded" onClick={() => navigate("/picture")} src={focusedExercise?.picture} sx={{display: "inline-block"}} />}</ListItemIcon>}
                <ListItemText primary={focusedExercise?.name} secondary={!isMini ? focusedExercise?.tags.map((tag) => (t("tags." + ExerciseTag[tag].toLowerCase()))).join(", ") : undefined}
                              primaryTypographyProps={{sx: {fontWeight: 600}, fontSize: isMini ? "small" : "medium"}} secondaryTypographyProps={{fontSize: "x-small"}}/>
                <IconButton aria-label="menu" color="inherit" onClick={() => setSwapExerciseOpen(true)}><SwapHoriz/></IconButton>
        </ListItem>
            {!!restTime && !showRest && <RestInProgress onClick={() => setShowRest(true)} />}
            <SupersetViewer/>
            <Paper variant="outlined">
                        <TableContainer component={Paper} sx={{flexGrow: 1, maxHeight: "30vh", width: "auto"}}>
                            <Table size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{width: "16px", padding: showRpe || showRir ? "1px" : "4px"}}>&nbsp;</TableCell>
                                        <TableCell sx={{width: "16px", padding: showRpe || showRir ? "1px" : "4px"}}>&nbsp;</TableCell>
                                        <TableCell  sx={{width: "16px", padding: showRpe || showRir ? "1px" : "4px"}} align="right">{t("set")}</TableCell>
                                        <TableCell  sx={{width: "16px", padding: showRpe || showRir ? "1px" : "4px"}} align="right">{t("weight")}</TableCell>
                                        <TableCell  sx={{width: "16px", padding: showRpe || showRir ? "1px" : "4px"}} align="right">{t("amount")}</TableCell>
                                        {showRpe && <TableCell align="right" sx={{width: "16px", padding: showRpe || showRir ? "1px" : "4px"}}>{t("rpe")}</TableCell>}
                                        {showRir && <TableCell align="right" sx={{width: "16px", padding: showRpe || showRir ? "1px" : "4px"}}>{t("rir")}</TableCell>}
                                        <TableCell align="right" sx={{width: "16px", padding: showRpe || showRir ? "1px" : "4px"}}>&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentExerciseHistory && currentExerciseHistory.slice(0, currentSlice).map((set: ExerciseSet) =>
                                        <TableRow
                                            key={set.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell sx={{padding: showRpe || showRir ? "1px" : "4px"}} component="th" scope="row">
                                                {set.notes || set.emoji ? <IconButton size="small" sx={{padding: "1px"}} onClick={(ev) => {if (set.notes && !notesAnchor) { setNotesEmoji(set.emoji); setNotes(set.notes); setNotesAnchor(ev.currentTarget)} else setNotesAnchor(undefined)}}>{set.emoji ? set.emoji : "📝"}</IconButton> : null}
                                            </TableCell>
                                            <TableCell sx={{padding: showRpe || showRir ? "1px" : "4px"}} component="th" scope="row">
                                                {set.date ? set.date.getDate().toString(10).padStart(2, "0") + "/" + (set.date.getMonth() + 1).toString(10).padStart(2, "0") : ""}
                                            </TableCell>
                                            <TableCell
                                                sx={{padding: showRpe || showRir ? "1px" : "4px"}} align="right">{set.setNumber}{set.type === 1 ? "W" : ""}{set.type === 2 ? "D" : ""}{set.type === 3 ? "F" : ""}{set.side === 1 ? "L" : ""}{set.side === 2 ? "R" : ""}</TableCell>
                                            <TableCell sx={{padding: showRpe || showRir ? "1px" : "4px"}} align="right">{set.weight}</TableCell>
                                            <TableCell sx={{padding: showRpe || showRir ? "1px" : "4px"}} align="right">{set.reps || set.time || set.laps || set.distance}</TableCell>
                                            {showRpe && <TableCell sx={{padding: showRpe || showRir ? "1px" : "4px"}} align="right">{set.rpe !== 0 ? set.rpe : "0"}</TableCell>}
                                            {showRir && <TableCell sx={{padding: showRpe || showRir ? "1px" : "4px"}}  align="right">{set.rir !== 0 ? set.rir : "0"}</TableCell>}
                                            <TableCell align="center"  sx={{whiteSpace: "nowrap",padding: showRpe || showRir ? "1px" : "4px"}} >
                                                <IconButton size="small" sx={{padding: "1px"}} onClick={(e) => { e.stopPropagation(); if (currentSet && setCurrentSet) setCurrentSet({...currentSet, type: set.type, weight: set.weight, reps: set.reps, rpe: showRpe ? set.rpe || 0 : undefined, rir: showRir ? set.rir || 0 : undefined, laps: set.laps, rest: set.rest || 0 })}}><ContentCopy fontSize="small"/></IconButton>
                                                <IconButton size="small" sx={{padding: "1px"}} onClick={(e) => { e.stopPropagation(); if (set) setEditingSet(set)}}><Edit fontSize="small"/></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {currentExerciseHistory && currentExerciseHistory.length > currentSlice && <TableRow onClick={() => setCurrentSlice((prevSlice) => prevSlice + 20)}><TableCell  sx={{textAlign: "center"}} colSpan={8}>{t("loadMore")}</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>

            </Paper>
            {<Box sx={{overflow: "auto", flexShrink: 1}}>
                {!!currentSet?.side && <Typography sx={{marginTop: "8px", textAlign: "center"}} variant="h4"
                                                 component="p">{currentSet.side === 1 ? t("leftSide") : t("rightSide")}</Typography>}
                {!!currentSet && currentSet?.weight !== undefined &&
                    <ToggleParameter<SetType> options={setOptions} value={currentSet.type} onChange={(type: number) => {
                        if (currentSet && setCurrentSet) setCurrentSet({...currentSet, type})
                    }}/>}
                <SetParameter disabled={!!superset} key={currentSetNumber} name={t("set")} value={currentSetNumber} min={1}
                              max={currentWorkoutExercise?.setIds.length}
                          incrementBy={1} onChange={(setNumber) => { if (setCurrentSetNumber) setCurrentSetNumber(setNumber)}}/>
                {currentSet?.weight !== undefined &&
                    <Parameter paramButtons={focusedExercise?.tags.includes(ExerciseTag.BODY_WEIGHT) && setCurrentSet && !!lastUserWeight ? <IconButton onClick={() => {
                        setCurrentSet({...currentSet, weight: lastUserWeight});
                    }}><MonitorWeight /></IconButton> : undefined} name={t("weight")} unit={useLbs ? "lbs" : "kg"} value={currentSet?.weight || 0} min={0}
                               increments={[2.5, 1.25, 1, 0.5, 5]}
                           allowDecimals onChange={(weight) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, weight})}} />}
                {currentSet?.reps !== undefined &&
                    <Parameter name={t("reps")} value={currentSet?.reps || 0} min={1}
                                            onChange={(reps) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, reps})}}/>}
                {currentSet?.time !== undefined &&
                    <Parameter name={t("time")} unit="min" value={currentSet?.time || 0} min={0} increments={[1, 5, 10, 15]}
                               allowDecimals onChange={(time) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, time})}}/>}
                {currentSet?.distance !== undefined &&
                    <Parameter name={t("distance")} unit="m" value={currentSet?.distance || 0} min={1} increments={[2.5, 1.25, 1, 0.5, 5]}
                               allowDecimals onChange={(distance) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, distance})}}/>}
                {currentSet?.laps !== undefined &&
                    <Parameter name={t("laps")} value={currentSet?.laps || 0} min={1}
                               allowDecimals onChange={(laps) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, laps})}}/>}
                {showRpe && currentSet?.reps !== undefined &&
                    <Parameter name={t("rpe")} value={currentSet?.rpe || 0} min={0} max={10}
                                           onChange={(rpe) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, rpe})}}/>}
                {showRir && currentSet?.reps !== undefined &&
                    <Parameter name={t("rir")} value={currentSet?.rir || 0} min={0}
                                           onChange={(rir) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, rir})}}/>}
                {currentSet?.rest !== undefined &&
                    <Parameter name={t("rest")} unit="s" value={currentSet?.rest || 0} min={0} increments={[10, 15, 30, 1, 5]}
                           onChange={(rest) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, rest})}}/>}
                <NotesParameter name={"Notes"} value={currentSet?.notes} onChange={(notes, emoji) => { if (currentSet && setCurrentSet) setCurrentSet({...currentSet, notes, emoji})}} />
            </Box>}
            <Box sx={{flexGrow: 1}}/>
            <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}} sx={{alignSelf: "center", marginTop: "10px"}}>
                {currentWorkout?.workoutExerciseIds && setCurrentWorkoutExerciseNumber &&
                    <Fab aria-label="previous" color="primary" size={isMini ? "small" : "large"}
                         disabled={!!superset || currentWorkoutExerciseNumber <= 0}
                         onClick={() => setCurrentWorkoutExerciseNumber(currentWorkoutExerciseNumber - 1)}>
                        <ArrowLeftIcon/>
                    </Fab>}
                {<Fab color="success" size={isMini ? "small" : "large"} aria-label="add" onClick={save}>
                    <DoneIcon/>
                </Fab>}
                <Fab aria-label="stop" size={isMini ? "small" : "large"} color="error"
                     onClick={() => setStopDialogOpen(true)}>
                    <StopIcon/>
                </Fab>
                {currentWorkout?.workoutExerciseIds && setCurrentWorkoutExerciseNumber &&
                    <Fab aria-label="next" size={isMini ? "small" : "large"} color="primary"
                         disabled={!!superset || currentWorkoutExerciseNumber >= currentWorkout?.workoutExerciseIds.length - 1}
                                onClick={() => setCurrentWorkoutExerciseNumber(currentWorkoutExerciseNumber + 1)}>
                        <ArrowRightIcon/>
                    </Fab>}

            </Stack>
            {oneRmOpen && <OneRmPicker open weight={currentSet?.weight} reps={currentSet?.reps}
                                       onClose={() => setOneRmOpen(false)}
                                       onSelect={(weight, reps) => {
                                           if (setCurrentSet && currentSet) setCurrentSet({...currentSet, weight: weight || currentSet.weight, reps: reps || currentSet.reps})
                                       }}/>}
            {addExerciseOpen && <AddExercisePicker onClose={() => setAddExerciseOpen(false)} />}
            {swapExerciseOpen && <AddExercisePicker replacingExercise={true} onClose={() => setSwapExerciseOpen(false)} />}
            {editingSet && <SetEditor isEditingHistoryEntry open set={editingSet} setNumber={editingSet.setNumber || 1} onChange={(newset) => {
                if (!db) return;
                db.exerciseSet.put(newset).then(() => {
                    if (refetchHistory) refetchHistory();
                    setEditingSet(undefined);
                });
            }} onClose={() => setEditingSet(undefined)} onDelete={() => {
                delSet(editingSet);
            }} />}
        </Box>
        <Popper sx={{zIndex: 1200}} open={!!notesAnchor} transition anchorEl={notesAnchor} onBlur={() => setNotesAnchor(undefined)} placement="bottom-start">
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper sx={{padding: "5px"}}>
                        <Typography sx={{fontSize: "14px"}}>{notes}</Typography>
                    </Paper>
                </Fade>
            )}
        </Popper>
    </Layout>;
}
