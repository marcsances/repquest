import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import BackIcon from '@mui/icons-material/ArrowBack';
import {useLocation} from "react-router-dom";

export interface WLAppBarProps {
    title: string;
}

export const WLAppBar = (props: WLAppBarProps) => {
    const location = useLocation();
    const {title} = props;

    return <Box>
        <AppBar position="static">
            <Toolbar>
                {!["/", "/history", "/settings"].includes(location.pathname) && <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                    onClick={() => {
                        window.history.go(-1)
                    }}
                >
                    <BackIcon/>
                </IconButton>}
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    </Box>;
}

export default WLAppBar;