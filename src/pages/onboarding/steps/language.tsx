import {FormControlLabel, Radio, RadioGroup} from "@mui/material";
import React, {useContext} from "react";
import languages from "../../../i18n/languages";
import i18n from "i18next";
import {SettingsContext} from "../../../context/settingsContext";

const LanguageStep = (props: { setCompletable: (value: boolean) => void}) => {
    const { setCompletable } = props;
    const { saveLang } = useContext(SettingsContext);
    setCompletable(true);
    return <RadioGroup>{languages.map((lang: any) => <FormControlLabel control={<Radio checked={i18n.language === lang.key} onChange={() => {
            if (saveLang) saveLang(lang.key);
            i18n.changeLanguage(lang.key).then();
            setCompletable(true);
    }} />} label={lang.value} />)}</RadioGroup>;
}

export default LanguageStep;
