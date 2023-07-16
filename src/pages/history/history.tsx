import React from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";

export const HistoryPage = () => {
    const {t} = useTranslation();
    return <Layout title={t("history")}><Typography>
        No implementado
    </Typography>
    </Layout>;
}