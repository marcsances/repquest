import React, {useContext, useEffect, useRef, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    InputAdornment,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Snackbar,
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

export interface ExerciseListProps {
    onSelectExercise?: (exercise: Exercise) => void;
    onCancel?: () => void;
}

export const ExerciseList = (props: ExerciseListProps) => {
    const { onSelectExercise, onCancel } = props;
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [ exercises, setExercises ] = useState<Exercise[] | undefined>(undefined);
    const theme = useTheme();
    const [ showMenu, setShowMenu ] = useState(false);
    const [ notImplemented, setNotImplemented ] = useState(false);
    const speedDialActionSx = SpeedDialActionSx(theme);
    const navigate = useNavigate();
    const [searchBox, setSearchBox] = useState<string | undefined>(undefined);

    let overHeight = 78;
    if (searchBox) {
        overHeight += 72;
    }
    if (onSelectExercise) {
        overHeight -= 48;
    }

    useEffect(() => {
        db?.exercise.toArray().then((exercises) => {
            setExercises(exercises.sort(compareExercises));
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

    return <Layout title={onSelectExercise ? t("selectExercise") : t("exercises")} toolItems={<IconButton color={searchBox !== undefined ? "primary" : "inherit"} onClick={() => setSearchBox((prevBox) => {
        return prevBox === undefined ? "" : undefined;
    })}>
            <Search/>
        </IconButton>} leftToolItems={onCancel ? <IconButton sx={{mr: 2}} size="large" edge="start" color="inherit" onClick={onCancel}><CloseIcon/></IconButton> : <></>} hideBack={!!onSelectExercise} hideNav={!!onSelectExercise}>
        {searchBox !== undefined && <TextField value={searchBox} InputProps={{ref: boxRef, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setSearchBox("")}><Clear /></IconButton></InputAdornment>}} size="small" variant="standard" sx={{width: "100%", height: "24px", marginBottom: "8px"}} placeholder={t("searchExercises")} onChange={(ev) => setSearchBox(ev.target.value)} />}
        {exercises !== undefined && <List sx={{width: '100%', height: 'calc(100% - ' + overHeight.toString() + 'px)', overflow: "auto"}}>
            {exercises.filter((entry) => !searchBox || entry.name.toLowerCase().includes(searchBox)).map((entry) =>  <ListItemButton key={entry.id} component="a" onClick={() => onSelectExercise ? onSelectExercise(entry) : navigate("/exercises/" + entry.id.toString())}>
                <ListItemAvatar>
                    {!entry.picture && <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>}
                    {entry.picture && <Avatar src={entry.picture} />}
                </ListItemAvatar>
                <ListItemText primary={entry.name} secondary={entry.tags.map((tag) => (t("tags." + ExerciseTag[tag].toLowerCase()))).join(", ")}/>
            </ListItemButton>)}
        </List>}
        {exercises === undefined && <Loader/>}
        {exercises !== undefined && <SpeedDial sx={{position: 'fixed', bottom: onSelectExercise ? 16 : 72, right: 16, zIndex: 1}} ariaLabel="Actions"
                   icon={<SpeedDialIcon icon={<MenuIcon/>} openIcon={<CloseIcon/>}/>}
                   open={showMenu} onOpen={() => setShowMenu(true)}
                   onClose={() => setShowMenu(false)}>
            <SpeedDialAction tooltipOpen
                             icon={<FilterAlt/>}
                             tooltipTitle={t("filter")}
                             sx={speedDialActionSx}
                             onClick={() => {
                                 setNotImplemented(true);
                                 setShowMenu(false);
                             }}
            />
            <SpeedDialAction tooltipOpen
                             icon={<AddIcon/>}
                             tooltipTitle={t("addExercise")}
                             sx={speedDialActionSx}
                             onClick={() => {
                                 setNotImplemented(true);
                                 setShowMenu(false);
                             }}
            />
        </SpeedDial>}
        <Snackbar
            open={notImplemented}
            autoHideDuration={2000}
            onClose={() => setNotImplemented(false)}
            message={t("notImplemented")}
        />
    </Layout>;
}
