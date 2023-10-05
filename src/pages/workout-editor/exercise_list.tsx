import React, {useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {
    Avatar,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Snackbar,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    useTheme
} from "@mui/material";
import {DBContext} from "../../context/dbContext";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {Exercise, ExerciseTag} from "../../models/exercise";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import {SpeedDialActionSx} from "../../utils/globalStyles";
import {FilterAlt} from "@mui/icons-material";
import {compareExercises} from "../../utils/comparators";
import {useNavigate} from "react-router-dom";

export const ExerciseList = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [ exercises, setExercises ] = useState<Exercise[]>([]);
    const theme = useTheme();
    const [ showMenu, setShowMenu ] = useState(false);
    const [ notImplemented, setNotImplemented ] = useState(false);
    const speedDialActionSx = SpeedDialActionSx(theme);
    const navigate = useNavigate();

    useEffect(() => {
        db?.exercise.toArray().then((exercises) => {
            setExercises(exercises.sort(compareExercises));
        });
    }, [db]);
    return <Layout title={t("exercises")}>
        <List sx={{width: '100%', height: 'calc(100% - 72px)', bgcolor: 'background.paper', overflow: "scroll"}}>
            {exercises.map((entry) =>  <ListItemButton key={entry.id} component="a" onClick={() => navigate("/exercises/" + entry.id.toString())}>
                <ListItemAvatar>
                    {!entry.picture && <Avatar>
                        <FitnessCenterIcon/>
                    </Avatar>}
                    {entry.picture && <Avatar src={entry.picture} />}
                </ListItemAvatar>
                <ListItemText primary={entry.name} secondary={entry.tags.map((tag) => (t("tags." + ExerciseTag[tag].toLowerCase()))).join(", ")}/>
            </ListItemButton>)}
        </List>
        <SpeedDial sx={{position: 'fixed', bottom: 72, right: 16, zIndex: 1}} ariaLabel="Actions"
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
        </SpeedDial>
        <Snackbar
            open={notImplemented}
            autoHideDuration={2000}
            onClose={() => setNotImplemented(false)}
            message={t("notImplemented")}
        />
    </Layout>;
}
