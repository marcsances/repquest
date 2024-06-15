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
import React, {useContext, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Box, FormControlLabel, Switch, Typography} from "@mui/material";
import {DialogContext} from "../../context/dialogContext";

export const Telemetry = () => {
    const {t} = useTranslation();

    const {showAlert} = useContext(DialogContext);

    const [ telemetry, setTelemetry ] = useState(localStorage.getItem("disable_telemetry") !== "true");

    const toggleTelemetry = () => {
        showAlert(t("telemetry"), t("weightlogWillRestart"), (result) => {
            if (!result) return;
            localStorage.setItem("disable_telemetry", telemetry ? "true" : "false");
            window.location.reload();
            setTelemetry((prevState) => !prevState);
        }, "okCancel");
    }

    return <Layout title={t("telemetry")} hideNav scroll>
        <Box sx={{padding: "20px", width: "calc(100% - 40px)", height: "calc(100vh - 96px)", overflow: "scroll"}}>
            <Typography variant="h4">{t("telemetry1")}</Typography>
            <Typography sx={{marginTop: "12px"}}>{t("telemetry2")}</Typography>
            <Typography sx={{marginTop: "12px"}}>{t("telemetry3")}</Typography>
            <Typography sx={{marginTop: "12px"}}>{t("telemetry4")}</Typography>
            <Typography sx={{marginTop: "12px", marginBottom: "12px"}}>{t("telemetry5")}</Typography>
            <FormControlLabel control={<Switch checked={telemetry} onClick={toggleTelemetry} />} label={t("enableTelemetry")} />
        </Box>
    </Layout>;
}
