import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Box} from "@mui/material";

const BackupsStep = (props: { setCompletable: (value: boolean) => void}) => {
    const { setCompletable } = props;
    const {t} = useTranslation();
    useEffect(() => {
        setCompletable(true);
    }, []);
    return <Box sx={{ display: "flex", flexDirection: "column", gap: "20px"}}>
        <Typography>{t("onboarding.backups.message1")}</Typography>
        <Typography>{t("onboarding.backups.message2")}</Typography>
        <Typography>{t("onboarding.backups.message3")}</Typography>
    </Box>;
}

export default BackupsStep;
