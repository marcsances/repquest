import React, {CSSProperties, ReactNode} from "react";
import WLAppBar from "./app_bar";
import WLNav from "./nav";
import {Paper} from "@mui/material";

const Layout = (props: {
    children: ReactNode,
    title: string,
    hideAppBar?: boolean,
    hideNav?: boolean,
    hideBack?: boolean,
    toolItems?: ReactNode,
    onBack?: () => void,
    sx?: CSSProperties,
    scroll?: boolean,
    leftToolItems?: ReactNode
}) => {
    const {children, title, hideAppBar, hideNav, toolItems, leftToolItems, hideBack, onBack, sx, scroll} = props;
    return <Paper sx={{display: "flex", flexDirection: "column", height: "100%", position: "absolute", width: "100%", ...(scroll ? { overflow: "auto" } : { overflow: "hidden"}), ...sx}}>
        {!hideAppBar && <WLAppBar title={title} leftToolItems={leftToolItems} toolItems={toolItems} hideBack={hideBack} onBack={onBack}/>}
        <Paper sx={{flexGrow: 1, padding: "5px", marginTop: "56px", maxHeight: "calc(100% - 56px)"}}>{children}</Paper>
        {!hideNav && <WLNav/>}
    </Paper>;
}

export default Layout;
