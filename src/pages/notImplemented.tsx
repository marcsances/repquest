/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
import {useTranslation} from "react-i18next";
import Layout from "../components/layout";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

const NotImplemented = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    return <Layout title={t("notImplemented.title")} sx={{padding: "20px"}}>
        <Typography>{t("notImplemented.description")}</Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>{t("actions.goBack")}</Button>
    </Layout>
}

export default NotImplemented;
