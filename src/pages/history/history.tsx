import React, {useCallback, useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {DBContext} from "../../context/dbContext";
import {WorkoutContext} from "../../context/workoutContext";
import {WorkoutHistory} from "../../models/workout";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {useNavigate} from "react-router-dom";

export const HistoryPage = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const {followingWorkout} = useContext(WorkoutContext);
    const navigate = useNavigate();

    const [ history, setHistory ] = useState<WorkoutHistory[]>([]);
    
    const fetchHistory = useCallback(async () => {
        if (!db) return;
        setHistory(await (db.workoutHistory.where("userName").equals("Default User").reverse().sortBy("date")));
    }, [db])
    
    useEffect(() => {
        // effect triggers when following workout changes since when we stop a workout we want the history entry to show up
        fetchHistory();
    }, [followingWorkout])
    return <Layout title={t("history")}><List sx={{width: '100%', height: '100%', bgcolor: 'background.paper'}}>
        {history.map((entry) =>  <ListItemButton key={entry.id} component="a" onClick={() => navigate("/history/" + entry.id.toString())}>
            <ListItemAvatar>
                <Avatar>
                    <FitnessCenterIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={entry.workoutName}
                          secondary={new Date(entry.date).toLocaleDateString() + " " + new Date(entry.date).toLocaleTimeString()}/>
        </ListItemButton>)}
    </List>
    </Layout>;
}
