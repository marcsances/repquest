import React, {ReactNode} from "react";
import WLAppBar from "./app_bar";
import WLNav from "./nav";
import Box from "@mui/material/Box";
import {Paper} from "@mui/material";

const NavLayout = (props: { children: ReactNode, title: string }) => {
    const {children, title} = props;
    return <Box sx={{display: "flex", flexDirection: "column", height: "100vh", width: "100vw"}}>
        <WLAppBar title={title}/>
        <Paper sx={{flexGrow: 1}}>{children}</Paper>
        <WLNav/>
    </Box>;
}

export default NavLayout;