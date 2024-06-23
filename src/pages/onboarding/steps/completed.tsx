import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";

const CompletedStep = (props: { setCompletable: (value: boolean) => void}) => {
    const { setCompletable } = props;
    useEffect(() => {
        setCompletable(true);
    }, []);
    const { t } = useTranslation();
    return <Typography>{t("onboarding.completed.message")}</Typography>;
}

export default CompletedStep;
