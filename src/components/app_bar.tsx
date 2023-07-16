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
    hideBack?: boolean;
}

export const WLAppBar = (props: WLAppBarProps) => {
    const location = useLocation();
    const {title, toolItems, hideBack} = props;
    const navigate = useNavigate();

    return <Box>
        <AppBar position="fixed">
            <Toolbar>
                {!["/", "/history", "/settings"].includes(location.pathname) && !hideBack && <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    <BackIcon/>
                </IconButton>}
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    {title}
                </Typography>
                {toolItems}
            </Toolbar>
        </AppBar>
    </Box>;
}

export default WLAppBar;