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
import React, {useContext, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Button, Snackbar, TextField} from "@mui/material";
import {SettingsContext} from "../../context/settingsContext";
import {ApiContext} from "../../context/apiContext";

export const LoginPage = () => {
    const {t} = useTranslation();
    const {fullname} = useContext(SettingsContext);
    const {logged_in, login, logout} = useContext(ApiContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [snackbar, setSnackbar] = useState("");

    const doLogin = () => {
        if (username == "" || password == "") {
            setSnackbar(t("weightcloud.login.wrong_credentials"));
            return;
        }
        login!(username, password)
            .then((ok) => { if (ok) setSnackbar(t("weightcloud.login.logged_in", {user: username})); else setSnackbar(t("weightcloud.login.wrong_credentials")) })
            .catch(() => setSnackbar(t("weightcloud.login.wrong_credentials")));
    };


    return <Layout title={t("weightcloud.login.login")} sx={{display: "flex", flexDirection: "column", alignItems: "center", placeItems: "center", padding: "20px", width: "calc(100% - 24px)", height: "100%"}}>
        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
        {logged_in ? <>
            <Typography>{t("weightcloud.login.logged_in", {user: fullname})}</Typography>
            <Button onClick={() => logout!().finally(() => setSnackbar(t("weightcloud.login.logged_out")))}>{t("weightcloud.login.logout")}</Button>
        </> : <form method="GET" action="#" style={{padding: "10px", display: "flex", flexDirection: "column", alignItems: "center", placeItems: "center", gap: "20px", marginBottom: "20px"}}>
            <Typography variant="h2">WeightCloud</Typography>
            <TextField InputProps={{required: true}} sx={{width: "50%", minWidth: "300px"}} placeholder={t("weightcloud.login.username")} value={username} onChange={(e) => setUsername(e.target.value)}></TextField>
            <TextField InputProps={{required: true}} sx={{width: "50%", minWidth: "300px"}} type="password" placeholder={t("weightcloud.login.password")} value={password} onChange={(e) => setPassword(e.target.value)}></TextField>
            <Button type="submit" variant="contained" onClick={(e) => { doLogin(); e.preventDefault(); }}>{t("weightcloud.login.do_login")}</Button>
        </form>}
        <Typography>{t("weightcloud.alpha")}</Typography>
    </Layout>;
}
