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
import * as React from 'react';
import {useContext} from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import {useTranslation} from "react-i18next";
import {Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
import {Avatar, Box, Button, Paper, useMediaQuery} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {DBContext} from "../context/dbContext";
import {UserContext} from "../context/userContext";
import {Apps} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import {SettingsContext} from "../context/settingsContext";

export const WLNav = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');
    const {theme: appTheme} = useContext(SettingsContext);

    const options = [
        { path: "/", name: t("workouts"), icon: <CalendarMonthIcon />},
        { path: "/exercises", name: t("exercises"), icon: <FitnessCenterIcon />},
        { path: "/apps", name: t("appsMenu.title"), icon: <Apps />},
        { path: "/settings", name: t("settings"), icon: <SettingsIcon />},
    ]
    return (<>
        <Paper sx={{ zIndex: 10, position: 'fixed', display: "flex", flexDirection: "row", alignItems: "center", placeItems: "center", justifyContent: "center", bottom: 0, left: 0, right: 0, width: "100%", paddingLeft: "4px", paddingRight: "4px", background: "transparent", boxShadow: "none" }} elevation={3}>
            {options.map((option) => <Button size="small" onClick={() => navigate(option.path)} disableRipple disableFocusRipple disableTouchRipple key={option.path} variant="text" sx={{":hover": {background: "transparent", zoom: location.pathname === option.path ? 0 : 1.1}, fontSize: "10px", color: appTheme === "light" ? (theme) => theme.palette.primary.contrastText : (theme) => theme.palette.text.primary, textTransform: "none", flexGrow: 1, display: "flex", flexDirection: "column"}}><Avatar sx={{boxShadow: location.pathname === option.path ?  "0px 0 5px 0px " + (appTheme === "light" ? "black" : "white") : "", marginBottom: location.pathname === option.path ? "2px" : "-6px", color: location.pathname === option.path ? (theme) => (appTheme === "light" ? theme.palette.primary.main : theme.palette.primary.contrastText) : (theme) => (appTheme === "light" ? theme.palette.primary.contrastText : theme.palette.text.primary), backgroundColor: location.pathname === option.path ? (theme) => (appTheme === "light" ? theme.palette.primary.contrastText : theme.palette.primary.main) : "transparent"}}>{option.icon}</Avatar>{!isMini && option.name}</Button>)}
        </Paper>
            <Box sx={{backgroundColor: appTheme === "light" ? (theme) => theme.palette.primary.main : "#272727",zIndex: 0, position: "fixed", bottom: 0, left: 0, right: 0, height: "56px"}} />
        </>
    );
}

export default WLNav;
