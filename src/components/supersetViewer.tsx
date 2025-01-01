/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
import * as React from "react";
import {useContext} from "react";
import {useTranslation} from "react-i18next";
import {WorkoutContext} from "../context/workoutContext";
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Cancel, MultipleStop} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

export const SupersetViewer = () => {
    const { t } = useTranslation();
    const {superset, currentSetNumber, setSuperset} = useContext(WorkoutContext);
    return superset ? <Box sx={{position: "relative", height: "96px"}}><ListItem sx={{backgroundColor: (theme) => theme.palette.primary.main}}>
        <ListItemAvatar>
            <Avatar sx={{backgroundColor: (theme) => theme.palette.primary.contrastText, color: (theme) => theme.palette.primary.main}}>
                <Box position="relative" display="inline-flex">
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
                        <Typography variant="caption" component="div" color="white">
                            <MultipleStop sx={{marginTop: "7px"}}/>
                        </Typography>
                    </Box>
                </Box>
            </Avatar>
        </ListItemAvatar>
        <ListItemText sx={{color: (theme) => theme.palette.primary.contrastText}} secondaryTypographyProps={{sx: {color: (theme) => theme.palette.primary.contrastText}}} primary={t("supersetInProgress")} secondary={t("supersetDescription", { current: superset.current, total: superset.size, set: currentSetNumber })}/>
        <IconButton color="inherit" onClick={() => { if(setSuperset) setSuperset(undefined)}}><Avatar sx={{backgroundColor: (theme) => theme.palette.primary.contrastText, color: (theme) => theme.palette.primary.main}}><Cancel /></Avatar></IconButton>
    </ListItem></Box> : <></>;
}
