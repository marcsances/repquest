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
import React, {CSSProperties, ReactNode} from "react";
import WLAppBar from "./app_bar";
import WLNav from "./nav";
import {Box, Paper} from "@mui/material";

const Layout = (props: {
    children: ReactNode,
    title: string,
    hideAppBar?: boolean,
    hideNav?: boolean,
    hideBack?: boolean,
    showAccountMenu?: boolean,
    toolItems?: ReactNode,
    onBack?: () => void,
    sx?: CSSProperties,
    scroll?: boolean,
    leftToolItems?: ReactNode,
    nogrow?: boolean
}) => {
    const {children, title, nogrow, showAccountMenu, hideAppBar, hideNav, toolItems, leftToolItems, hideBack, onBack, sx, scroll} = props;
    return <Paper sx={{display: "flex", flexDirection: "column", position: "absolute", width: "100%", ...(scroll ? { overflow: "auto", height: "auto" } : { overflow: "hidden", height: "100%"}), ...sx}}>
        {!hideAppBar && <WLAppBar title={title} showAccountMenu={showAccountMenu} leftToolItems={leftToolItems} toolItems={toolItems} hideBack={hideBack} onBack={onBack}/>}
        <Box sx={{flexGrow: nogrow ? undefined : 1, marginTop: "56px", maxHeight: "calc(100% - 56px)"}}>{children}</Box>
        {!hideNav && <WLNav/>}
    </Paper>;
}

export default Layout;
