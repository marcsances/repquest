import {Box, CircularProgress} from "@mui/material";
import React from "react";

const Loader = () => {
    return <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%"}}><CircularProgress/></Box>
}

export default Loader;
