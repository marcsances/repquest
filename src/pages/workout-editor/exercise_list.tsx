import React, {useContext, useEffect, useRef, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    Dialog,
    InputAdornment,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    TextField,
    useTheme
} from "@mui/material";
import {DBContext} from "../../context/dbContext";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {Exercise, ExerciseTag} from "../../models/exercise";
import MenuIcon from "@mui/icons-material/Menu";
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

export interface ExerciseListProps {
    onSelectExercise?: (exercise: Exercise) => void;
    onCancel?: () => void;
}

export const ExerciseList = (props: ExerciseListProps) => {
    const {onSelectExercise, onCancel} = props;
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [exercises, setExercises] = useState<Exercise[] | undefined>(undefined);
    const theme = useTheme();
    const [showMenu, setShowMenu] = useState(false);
    const speedDialActionSx = SpeedDialActionSx(theme);
    const navigate = useNavigate();
    const [searchBox, setSearchBox] = useState<string | undefined>(undefined);
    const [filterPicker, setFilterPicker] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [filterTags, setFilterTags] = useState<ExerciseTag[]>([]);
    let overHeight = 78;
    if (searchBox !== undefined) {
        overHeight += 32;
    }
    if (onSelectExercise) {
        overHeight -= 48;
    }

    useEffect(() => {
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
        setShowMenu(false);
    };

    return <Layout title={onSelectExercise ? t("selectExercise") : t("exercises")}
                   toolItems={<IconButton color={searchBox !== undefined ? "primary" : "inherit"}
                                          onClick={() => setSearchBox((prevBox) => {
                                              return prevBox === undefined ? "" : undefined;
                                          })}>
                       <Search/>
                   </IconButton>} leftToolItems={onCancel ?
        <IconButton sx={{mr: 2}} size="large" edge="start" color="inherit"
                    onClick={onCancel}><CloseIcon/></IconButton> : <></>} hideBack={!!onSelectExercise}
                   hideNav={!!onSelectExercise}>
        {searchBox !== undefined && <TextField value={searchBox} InputProps={{
            ref: boxRef,
            endAdornment: <InputAdornment position="end"><IconButton
                onClick={() => setSearchBox("")}><Clear/></IconButton></InputAdornment>
        }} size="small" variant="standard" sx={{width: "100%", height: "24px", marginBottom: "8px"}}
                                               placeholder={t("searchExercises")}
                                               onChange={(ev) => setSearchBox(ev.target.value)}/>}
        {exercises !== undefined &&
            <List sx={{width: '100%', height: 'calc(100% - ' + overHeight.toString() + 'px)', overflow: "auto"}}>
                <ListItemButton component="a" onClick={newExercise}><ListItemAvatar><Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                    <AddIcon sx={{color: (theme) => theme.palette.primary.contrastText}}/>
                </Avatar></ListItemAvatar><ListItemText primary={t("newExercise")} /></ListItemButton>
                {exercises.filter((entry) => !entry.deleted && (filterTags.length === 0 || includesAll(entry.tags, filterTags)) && (!searchBox || normalize(entry.name).includes(normalize(searchBox)))).map((entry) =>
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
            </List>}
        {exercises === undefined && <Loader/>}
        {exercises !== undefined &&
            <SpeedDial sx={{position: 'fixed', bottom: onSelectExercise ? 16 : 72, right: 16, zIndex: 1}}
                       ariaLabel="Actions"
                       icon={<SpeedDialIcon icon={filterTags.length > 0 ? <FilterAlt/> : <MenuIcon/>}
                                            openIcon={<CloseIcon/>}/>}
                       open={showMenu} onOpen={() => setShowMenu(true)}
                       onClose={() => setShowMenu(false)}>
                <SpeedDialAction tooltipOpen
                                 icon={<FilterAlt/>}
                                 tooltipTitle={t("filter")}
                                 sx={speedDialActionSx}
                                 onClick={() => {
                                     setShowMenu(false);
                                     setFilterPicker(true);
                                 }}
                />
                <SpeedDialAction tooltipOpen
                                 icon={<AddIcon/>}
                                 tooltipTitle={t("newExercise")}
                                 sx={speedDialActionSx}
                                 onClick={newExercise}
                />
            </SpeedDial>}

        {filterPicker && <TagPicker title={t("filter")} open value={filterTags} onChange={(tags) => setFilterTags(tags)}
                                    onClose={() => setFilterPicker(false)}/>}
        {editorOpen && <Dialog open fullScreen onClose={()=> setEditorOpen(false)}><ExerciseEditor onSaved={(exercise) => onSelectExercise ? onSelectExercise(exercise) : navigate("/exercises/" + exercise.id.toString())} onClose={() => setEditorOpen(false)} /></Dialog>}
    </Layout>;
}
