import React from "react";
import NavLayout from "../../components/navlayout";
import {useTranslation} from "react-i18next";

export const SettingsPage = () => {
    const {t} = useTranslation();
    return <NavLayout title={t("settings")}>settings</NavLayout>;
}