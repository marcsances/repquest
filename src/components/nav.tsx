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
import {Link as RouterLink, useLocation} from "react-router-dom";
import {Box, Paper} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {DBContext} from "../context/dbContext";
import {UserContext} from "../context/userContext";
import {Apps, Restaurant} from "@mui/icons-material";

const Dummy = (props: Record<string, any>) => {
    return <Box sx={{flexGrow: 1}} />
}

export const WLNav = () => {
    const {t} = useTranslation();
    const {db, masterDb} = useContext(DBContext);
    const {userName, user} = useContext(UserContext);
    const location = useLocation();
    const paths = ["", "/", "/exercises", "/nutrition", "/apps", "/settings", ""];
    const value = paths.indexOf(location.pathname);
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                sx={{ overflowX: "auto", justifyContent: "left" }}
            >
                <Dummy />
                <BottomNavigationAction component={RouterLink} to="/" label={t("workouts")} icon={<CalendarMonthIcon/>}/>
                <BottomNavigationAction component={RouterLink} to="/exercises" label={t("exercises")} icon={<FitnessCenterIcon/>}/>
                <BottomNavigationAction component={RouterLink} to="/nutrition" label={t("nutrition.title")} icon={<Restaurant/>}/>
                <BottomNavigationAction component={RouterLink} to="/apps" label={t("appsMenu.title")} icon={<Apps/>}/>
                <BottomNavigationAction component={RouterLink} to="/settings" label={t("settings")} icon={<SettingsIcon/>}/>
                <Dummy />
            </BottomNavigation>
        </Paper>
    );
}

export default WLNav;
