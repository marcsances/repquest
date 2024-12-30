import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Box, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {ImportMode} from "../onboarding";

const ImportStep = (props: { setCompletable: (value: boolean) => void, importData: ImportMode, setImportData: (value: ImportMode) => void}) => {
    const { importData, setImportData, setCompletable } = props;
    useEffect(() => {
        setCompletable(true);
    }, []);
    const {t} = useTranslation();
    return <Box sx={{ display: "flex", flexDirection: "column", gap: "20px"}}>
        <Typography>{t("onboarding.importData.message")}</Typography>
        <RadioGroup>
            <FormControlLabel control={<Radio checked={importData === ImportMode.IMPORT_FILE} onChange={() => {setImportData(ImportMode.IMPORT_FILE)}} />} label={t("onboarding.importData.importFile")} />
            {importData === ImportMode.IMPORT_FILE && <Typography sx={{ fontSize: "14px" }}>{t("onboarding.importData.willRedirect")}</Typography>}
            <FormControlLabel control={<Radio checked={importData === ImportMode.IMPORT_DATASET} onChange={() => {setImportData(ImportMode.IMPORT_DATASET)}} />} label={t("onboarding.importData.importDataset")} />
            <FormControlLabel control={<Radio checked={importData === ImportMode.NO_IMPORT} onChange={() => {setImportData(ImportMode.NO_IMPORT)}} />} label={t("onboarding.importData.noThanks")} />
        </RadioGroup>
    </Box>;
}

export default ImportStep;
