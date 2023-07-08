import React from "react";
import NavLayout from "../../components/navlayout";
import {useTranslation} from "react-i18next";

export const HistoryPage = () => {
    const {t} = useTranslation();
    return <NavLayout title={t("history")}>history</NavLayout>;
}