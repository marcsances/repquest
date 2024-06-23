import Typography from "@mui/material/Typography";
import React from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Checkbox, FormControlLabel, TextField, useMediaQuery} from "@mui/material";
import {gpl} from "../../whatsNew/license";

const LicenseStep = (props: { setCompletable: (value: boolean) => void}) => {
    const { setCompletable } = props;
    const {t} = useTranslation();
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');

    return <Box sx={{ display: "flex", flexDirection: "column", gap: "20px"}}>
        <Typography>{t("onboarding.license.pleaseRead")}</Typography>
        {!isMini && <TextField
            variant="filled"
            label="GNU General Public License version 3"
            multiline
            rows={10}
            value={gpl}
            InputProps={{readOnly: true, style: { fontSize: "12px", fontFamily: '"Lucida Console", "Consolas", "Courier New", "Courier", monospaced'}}}
        />}
        <Button variant="outlined" component="a" href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">{t("onboarding.license.readOnline")}</Button>
        <FormControlLabel control={<Checkbox onChange={(ev) => setCompletable(ev.target.checked)}/>} label={t("onboarding.license.accept")} />
    </Box>;
}

export default LicenseStep;
