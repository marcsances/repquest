import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";

const MetricsStep = (props: { setCompletable: (value: boolean) => void}) => {
    const { setCompletable } = props;
    useEffect(() => {
        setCompletable(true);
    }, []);
    return <Typography>Metrics</Typography>;
}

export default MetricsStep;
