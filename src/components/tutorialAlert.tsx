import React, {CSSProperties} from "react";
import {Alert, Button} from "@mui/material";

export interface TutorialAlertProps {
    title: string;
    message: string;
    action: string;
    onAction: () => void;
    sx?: CSSProperties;
}

const TutorialAlert = (props: TutorialAlertProps) => {
    const { title, message, action, onAction, sx} = props;
    return <Alert sx={{borderRadius: "10px", zIndex: 100, margin: "8px", ...sx}}
           severity="info"><span
        style={{display: "block", fontWeight: 600}}>{title}</span><span
        style={{display: "block"}}>{message}</span><span style={{display: "inline-block", textAlign: "right", width: "100%"}}><Button color="inherit" size="small"
                                                                                                                                                        onClick={onAction}>
                {action}
            </Button></span></Alert>;
}

export default TutorialAlert;
