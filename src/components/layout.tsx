import React, {ReactNode} from "react";
import WLAppBar from "./app_bar";
import WLNav from "./nav";
import Box from "@mui/material/Box";
import {Paper} from "@mui/material";

const Layout = (props: {
    children: ReactNode,
    title: string,
    hideAppBar?: boolean,
    hideNav?: boolean,
    hideBack?: boolean,
    toolItems?: ReactNode
}) => {
    const {children, title, hideAppBar, hideNav, toolItems, hideBack} = props;
    return <Box sx={{display: "flex", flexDirection: "column", height: "100vh", width: "100vw"}}>
        {!hideAppBar && <WLAppBar title={title} toolItems={toolItems} hideBack={hideBack}/>}
        <Paper sx={{flexGrow: 1, padding: "5px", marginTop: "56px", maxHeight: "calc(100% - 56px)"}}>{children}</Paper>
        {!hideNav && <WLNav/>}
    </Box>;
}

export default Layout;