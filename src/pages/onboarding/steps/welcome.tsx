import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Box} from "@mui/material";

const WelcomeStep = (props: { setCompletable: (value: boolean) => void}) => {
    const { setCompletable } = props;
    const {t} = useTranslation();
    useEffect(() => {
        setCompletable(true);
    }, []);
    return <Box sx={{ display: "flex", flexDirection: "column", gap: "20px"}}>
        <Typography sx={{ fontWeight: 600 }}>{t("onboarding.welcome.subtitle")}</Typography>
        <Typography>{t("onboarding.welcome.message")}</Typography>
        <Typography>{t("onboarding.welcome.disclaimer1")}</Typography>
        <Typography>{t("onboarding.welcome.disclaimer2")}</Typography>
        <Typography>{t("onboarding.welcome.disclaimer3")}</Typography>
    </Box>;
}

export default WelcomeStep;
