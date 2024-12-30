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
import {Avatar, Button, Paper, useMediaQuery} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {DBContext} from "../context/dbContext";
import {UserContext} from "../context/userContext";
import {Apps} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

export const WLNav = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');

    const options = [
        { path: "/", name: t("workouts"), icon: <CalendarMonthIcon />},
        { path: "/exercises", name: t("exercises"), icon: <FitnessCenterIcon />},
        { path: "/apps", name: t("appsMenu.title"), icon: <Apps />},
        { path: "/settings", name: t("settings"), icon: <SettingsIcon />},
    ]
    return (
        <Paper sx={{ position: 'fixed', display: "flex", flexDirection: "row", alignItems: "center", placeItems: "center", justifyContent: "center", bottom: 0, left: 0, right: 0, width: "100%", paddingLeft: "4px", paddingRight: "4px", background: "transparent", boxShadow: "none" }} elevation={3}>
            {options.map((option) => <Button size="small" onClick={() => navigate(option.path)} key={option.path} variant="text" sx={{fontSize: "10px", color: (theme) => theme.palette.text.primary, textTransform: "none", flexGrow: 1, display: "flex", flexDirection: "column"}}><Avatar sx={{marginBottom: "2px", color: location.pathname === option.path ? (theme) => theme.palette.primary.contrastText : (theme) => theme.palette.text.primary, backgroundColor: location.pathname === option.path ? (theme) => theme.palette.primary.main : "transparent"}}>{option.icon}</Avatar>{!isMini && option.name}</Button>)}
        </Paper>
    );
}

export default WLNav;
