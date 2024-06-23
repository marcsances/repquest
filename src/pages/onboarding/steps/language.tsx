import {FormControlLabel, Radio, RadioGroup} from "@mui/material";
import React, {useContext, useEffect} from "react";
import languages from "../../../i18n/languages";
import i18n from "i18next";
import {SettingsContext} from "../../../context/settingsContext";

const LanguageStep = (props: { setCompletable: (value: boolean) => void}) => {
    const { setCompletable } = props;
    const { saveLang } = useContext(SettingsContext);
    useEffect(() => {
        setCompletable(true);
    }, []);
    return <RadioGroup>{languages.map((lang: any) => <FormControlLabel control={<Radio checked={i18n.language === lang.key} onChange={() => {
            if (saveLang) saveLang(lang.key);
            i18n.changeLanguage(lang.key).then();
    }} />} label={lang.value} />)}</RadioGroup>;
}

export default LanguageStep;
