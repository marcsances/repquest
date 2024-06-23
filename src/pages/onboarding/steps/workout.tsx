import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";

const WorkoutStep = (props: { setCompletable: (value: boolean) => void}) => {
    const { setCompletable } = props;
    useEffect(() => {
        setCompletable(true);
    }, []);
    return <Typography>Workout</Typography>;
}

export default WorkoutStep;
