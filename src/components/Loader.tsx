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
import {Box, CircularProgress} from "@mui/material";
import React from "react";
import Typography from "@mui/material/Typography";

const Loader = ({prompt}: {prompt?: string}) => {
    return <Box sx={{display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%"}}><CircularProgress/>{prompt && <Typography sx={{marginTop: "12px", color: "white"}}>{prompt}</Typography>}</Box>
}

export default Loader;
