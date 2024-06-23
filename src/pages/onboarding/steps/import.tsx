import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Box, FormControlLabel, Radio, RadioGroup} from "@mui/material";

const ImportStep = (props: { setCompletable: (value: boolean) => void, importData: boolean, setImportData: (value: boolean) => void}) => {
    const { importData, setImportData, setCompletable } = props;
    useEffect(() => {
        setCompletable(true);
    }, []);
    const {t} = useTranslation();
    return <Box sx={{ display: "flex", flexDirection: "column", gap: "20px"}}>
        <Typography>{t("onboarding.importData.message")}</Typography>
        <RadioGroup>
            <FormControlLabel control={<Radio checked={importData} onChange={() => {setImportData(true)}} />} label={t("onboarding.importData.importFile")} />
            {importData && <Typography sx={{ fontSize: "14px" }}>{t("onboarding.importData.willRedirect")}</Typography>}
            <FormControlLabel control={<Radio checked={!importData} onChange={() => {setImportData(false)}} />} label={t("onboarding.importData.noThanks")} />
        </RadioGroup>
    </Box>;
}

export default ImportStep;
