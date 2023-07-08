import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";

export const WLNav = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const paths = ["/", "/history", "/settings"];
    const value = paths.indexOf(location.pathname);
    return (
        <Box>
            <BottomNavigation
                showLabels
                value={value}
            >
                <BottomNavigationAction href="/" label={t("workouts")} icon={<FitnessCenterIcon/>}/>
                <BottomNavigationAction href="/history" label={t("history")} icon={<HistoryIcon/>}/>
                <BottomNavigationAction href="/settings" label={t("settings")} icon={<SettingsIcon/>}/>
            </BottomNavigation>
        </Box>
    );
}

export default WLNav;