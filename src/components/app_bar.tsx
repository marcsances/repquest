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
import {ReactNode} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import BackIcon from '@mui/icons-material/ArrowBack';
import {useLocation, useNavigate} from "react-router-dom";

export interface WLAppBarProps {
    title: string;
    toolItems?: ReactNode;
    leftToolItems?: ReactNode;
    hideBack?: boolean;
    onBack?: () => void;
}

export const WLAppBar = (props: WLAppBarProps) => {
    const location = useLocation();
    const {title, toolItems, leftToolItems, hideBack, onBack} = props;
    const navigate = useNavigate();

    return <Box>
        <AppBar position="fixed" style={{zIndex:1}}>
            <Toolbar>
                {leftToolItems}
                {!["/", "/account", "/settings", "/exercises"].includes(location.pathname) && !hideBack && <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={() => {
                        if (!onBack) navigate(-1);
                        else onBack();
                    }}
                >
                    <BackIcon/>
                </IconButton>}
                <Typography variant="h6" component="div" sx={{flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                    {title}
                </Typography>
                <Box sx={{flexShrink: 1, whiteSpace: "nowrap"}}>{toolItems}</Box>
            </Toolbar>
        </AppBar>
    </Box>;
}

export default WLAppBar;
