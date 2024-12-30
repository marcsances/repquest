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
import React, {useContext, useEffect, useRef, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {
    Avatar, CircularProgress,
    Dialog,
    InputAdornment,
    List, ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    TextField,
    useTheme
} from "@mui/material";
import {DBContext} from "../../context/dbContext";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {Exercise, ExerciseTag} from "../../models/exercise";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import {SpeedDialActionSx} from "../../utils/globalStyles";
import {Clear, FilterAlt, Search} from "@mui/icons-material";
import {compareExercises} from "../../utils/comparators";
import {useNavigate} from "react-router-dom";
import Loader from "../../components/Loader";
import IconButton from "@mui/material/IconButton";
import normalize from "../../utils/normalize";
import {includesAll} from "../../utils/sets";
import TagPicker from "./tag_picker";
import {ExerciseEditor} from "./exercise_editor";
import BackIcon from "@mui/icons-material/ArrowBack";
import {SettingsContext} from "../../context/settingsContext";
import TutorialAlert from "../../components/tutorialAlert";

export interface ExerciseListProps {
    onSelectExercise?: (exercise: Exercise) => void;
    onCancel?: () => void;
    options?: Exercise[];
    tags?: ExerciseTag[];
    onBack?: () => void;
}

export const ExerciseList = (props: ExerciseListProps) => {
    const {onSelectExercise, onBack, onCancel, tags, options} = props;
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const {theme: appTheme} = useContext(SettingsContext);
    const [exercises, setExercises] = useState<Exercise[] | undefined>(options);
    const theme = useTheme();
    const speedDialActionSx = SpeedDialActionSx(theme);
    const navigate = useNavigate();
    const [searchBox, setSearchBox] = useState<string | undefined>(undefined);
    const [filterPicker, setFilterPicker] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [filterTags, setFilterTags] = useState<ExerciseTag[]>(tags ? tags : []);
    const [overHeight, setOverHeight] = useState(58);
    const [currentSlice, setCurrentSlice] = useState(50);
    const exerciseList = exercises ? exercises.filter((entry) => !entry.deleted && (filterTags.length === 0 || includesAll(entry.tags, filterTags)) && (!searchBox || normalize(entry.name).includes(normalize(searchBox)))) : [];
    useEffect(() => {
        let oh = 58;
        if (searchBox !== undefined) {
            oh += 48;
        }
        if (onSelectExercise) {
            oh -= 68;
        }
        setOverHeight(oh);
    }, [searchBox, onSelectExercise]);


    useEffect(() => {
        if (options) return;
        db?.exercise.toArray().then((exercises) => {
            setExercises(exercises.sort(compareExercises));
        }).catch(() => {
            setExercises([]);
        });
    }, [db]);

    const boxRef = useRef<HTMLInputElement>();
    useEffect(() => {
        setTimeout(() => {
            if (searchBox !== undefined) {
                if (boxRef.current) {
                    boxRef.current.click();
                }
            }
        }, 0);
    }, [searchBox, boxRef]);

    const newExercise = () => {
        if (!db) return;
        setEditorOpen(true);
    };

    const [reachedBottom, setReachedBottom] = useState(false);
    const listRef = useRef<any>();

    useEffect(() => {
        if (!listRef.current) return;
        const handleScroll = () => {
            if (!listRef.current) return;
            const scrollTop = listRef.current.scrollTop;
            const scrollHeight = listRef.current.scrollHeight;
            const clientHeight = listRef.current.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setReachedBottom(true);
            }
        };

        listRef.current.addEventListener('scroll', handleScroll);

        return () => {
            if (listRef.current) listRef.current.removeEventListener('scroll', handleScroll);
        };
    }, [listRef.current]);
//
    useEffect(() => {
        if(reachedBottom){
            setCurrentSlice((prevSlice) => prevSlice + 50);
            setReachedBottom(false)
        }
    }, [reachedBottom]);

    return <Layout showAccountMenu={!onBack} title={onSelectExercise ? t("selectExercise") : t("exercises")}
                   toolItems={<IconButton sx={{
                       color: searchBox !== undefined ? theme.palette.primary.main : "inherit",
                       backgroundColor: searchBox !== undefined ? { dark: "inherit", light: theme.palette.primary.contrastText }[appTheme] : "inherit",
                   }} disableFocusRipple disableRipple
                                          onClick={() => setSearchBox((prevBox) => {
                                              return prevBox === undefined ? "" : undefined;
                                          })}>
                       <Search/>
                   </IconButton>} leftToolItems={onCancel || onBack ?
        <IconButton sx={{mr: 2}} size="large" edge="start" color="inherit"
                    onClick={onCancel ? onCancel : onBack!}>{onBack ? <BackIcon /> : <CloseIcon/>}</IconButton> : <></>} hideBack={!!onSelectExercise}
                   hideNav={!!onSelectExercise}>
        {searchBox !== undefined && <TextField value={searchBox} InputProps={{
            ref: boxRef,
            endAdornment: <InputAdornment position="end"><IconButton
                onClick={() => setSearchBox("")}><Clear/></IconButton></InputAdornment>
        }} size="small" variant="standard" sx={{width: "calc(100% - 24px)", height: "24px", margin: "12px"}}
                                               placeholder={t("searchExercises")}
                                               onChange={(ev) => setSearchBox(ev.target.value)}/>}
        {exercises !== undefined &&
            <List ref={listRef} sx={{backgroundImage: {dark: "url('/logofadenoback.png')", light: "url('/logofadelight.png')"}[appTheme], backgroundSize: "contain", backgroundPosition: "right bottom", backgroundRepeat: "no-repeat", width: '100%', height: 'calc(100% - ' + overHeight.toString() + 'px)', overflow: "auto", padding: 0}}>
                <ListItemButton sx={filterTags.length > 0 ? {backgroundColor: (theme) => theme.palette.primary.main} : {}} component="a"
                                                          onClick={() => setFilterPicker(true)}>
                    <ListItemAvatar>
                        <Avatar sx={{bgcolor: (theme) => filterTags.length > 0 ? theme.palette.primary.contrastText : theme.palette.primary.main}}>
                            <FilterAlt sx={{color: (theme) => filterTags.length > 0 ? theme.palette.primary.main : theme.palette.primary.contrastText}}/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText sx={filterTags.length > 0 ? {color: (theme) => theme.palette.success.contrastText} : {}}
                                  primary={filterTags.length > 0 ? filterTags.map((tag) => (t("tags." + ExerciseTag[tag].toLowerCase()))).join(", ") : t("filter")}/>
                </ListItemButton>
                <ListItemButton component="a" onClick={newExercise}><ListItemAvatar><Avatar sx={{bgcolor: (theme) => theme.palette.success.main}}>
                    <AddIcon sx={{color: (theme) => theme.palette.success.contrastText}}/>
                </Avatar></ListItemAvatar><ListItemText primary={t("newExercise")} /></ListItemButton>
                {exerciseList.slice(0, currentSlice).map((entry) =>
                    <ListItemButton key={entry.id} component="a"
                                    onClick={() => onSelectExercise ? onSelectExercise(entry) : navigate("/exercises/" + entry.id.toString())}>
                        <ListItemAvatar>
                            {!entry.picture && <Avatar>
                                <FitnessCenterIcon/>
                            </Avatar>}
                            {entry.picture && <Avatar src={entry.picture}/>}
                        </ListItemAvatar>
                        <ListItemText primary={entry.name}
                                      secondary={entry.tags.map((tag) => (t("tags." + ExerciseTag[tag].toLowerCase()))).join(", ")}/>
                    </ListItemButton>)}
                {currentSlice < exerciseList.length && <ListItem><ListItemAvatar><CircularProgress /></ListItemAvatar><ListItemText primary={t("loading")} /></ListItem>}
            </List>}
        {exercises === undefined && <Loader/>}
        {exercises && exercises.length === 0 && <TutorialAlert title={t("startAddingAnExercise")} message={t("thisIsTheExerciseList")} action={t("addExercise")} onAction={newExercise} sx={{left: 0, position: "fixed", bottom: "8px"}} />}
        {filterPicker && <TagPicker title={t("filter")} open value={filterTags} onChange={(tags) => setFilterTags(tags)}
                                    onClose={() => setFilterPicker(false)}/>}
        {editorOpen && <Dialog open={true} fullScreen onClose={()=> setEditorOpen(false)}><ExerciseEditor onSaved={(exercise) => onSelectExercise ? onSelectExercise(exercise) : navigate("/exercises/" + exercise.id.toString())} onClose={() => setEditorOpen(false)} /></Dialog>}
    </Layout>;
}
