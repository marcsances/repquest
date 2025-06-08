import React, {useContext, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import {Alert, Box, Button, CssBaseline, Link, Stack, TextField} from "@mui/material";
import {SupabaseContext} from "../../context/supabaseContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {Report} from "@mui/icons-material";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";

const RepcloudLoginPage = () => {
    const {supabase, hasSupabase} = useContext(SupabaseContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tab, setTab] = useState(0);
    const [forgot, setForgot] = useState(false);
    const [infoBar, setInfoBar] = useState<{
        message: string,
        level: "info" | "warning" | "error"
    } | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();

    const login = async () => {
        if (email.length < 1 || password.length < 1) {
            setInfoBar({message: t("repcloud.pleaseEnterCredentials"), level: "warning"});
            setLoading(false);
            return;
        }
        const {error} = await supabase!.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);
        if (error) {
            console.error(error);
            setInfoBar({message: t("repcloud.wrongCredentials"), level: "error"});
        }
    }

    const createAccount = async () => {
        if (email.length < 1 || password.length < 1) {
            setInfoBar({message: t("repcloud.pleaseEnterCredentials"), level: "warning"});
            setLoading(false);
            return;
        }
        const {error} = await supabase!.auth.signUp({
            email, password
        });
        setLoading(false);
        if (error) {
            console.error(error);
            setInfoBar({message: t("repcloud.checkIfAccountExists"), level: "error"});
        }
    }

    const forgotPassword = async () => {
        if (email.length < 1) {
            setInfoBar({message: t("repcloud.pleaseEnterCredentials"), level: "warning"});
            setLoading(false);
            return;
        }
        await supabase!.auth.resetPasswordForEmail(email, {redirectTo: window.location.origin + "/user/change-password"});
        setInfoBar({
            level: "info",
            message: t("repcloud.emailSent")
        })
    }

    return hasSupabase ? <Layout title={t("repcloud.loginTitle")}>
        <Box sx={{display: "flex", flexDirection: "column", gap: "16px", padding: "16px"}}>
        <center><a href="https://socis.ponentdnb.com"><img alt="RepQuest"
                                                           src="/logo512.png"
                                                           height="64px" style={{marginBottom: "24px"}}/></a>
            {infoBar && <Alert severity={infoBar.level} sx={{marginBottom: "12px"}}>{infoBar.message}</Alert>}
            {forgot ? <Typography variant="h5">{t("repcloud.recoverYourAccount")}</Typography> : <Typography
                variant="h5">{tab === 0 ? t("repcloud.loginTitle") : t("repcloud.createAccount")}</Typography>}
        </center>
        {!forgot ? <><TextField autoFocus value={email} onKeyDown={(e) => {
            if (e.key.toLowerCase().includes("enter")) {
                setInfoBar(undefined);
                setLoading(true);
                (tab === 0 ? login : createAccount)().then()
            }
        }} onChange={(e) => setEmail(e.target.value)} label={t("repcloud.email")}/>
            <TextField type="password" onKeyDown={(e) => {
                if (e.key.toLowerCase().includes("enter")) {
                    setInfoBar(undefined);
                    setLoading(true);
                    (tab === 0 ? login : createAccount)().then()
                }
            }} value={password} onChange={(e) => setPassword(e.target.value)} label={t("repcloud.password")}/>
            <Button variant="contained" color="primary" disabled={loading} onClick={() => {
                setInfoBar(undefined);
                setLoading(true);
                if (tab === 0) login(); else createAccount()
            }}>{loading ? t("loading") : (tab === 1 ? t("repcloud.register") : t("repcloud.login"))}</Button>
            {import.meta.env.VITE_SUPABASE_REGISTRATION_ENABLED === "true" && <Button variant="outlined" color="primary" disabled={loading} onClick={() => {
                setInfoBar(undefined);
                setTab(tab ? 0 : 1)
            }}>{tab === 0 ? t("repcloud.register") : t("repcloud.login")}</Button>}
            <Link sx={{textAlign: "center", cursor: "pointer"}} onClick={() => {
                setInfoBar(undefined);
                setForgot(true);
            }}>{t("repcloud.forgotPassword")}</Link></> : <>
            <Typography sx={{textAlign: "center"}}>{t("repcloud.enterYourEmailForgot")}</Typography>
            <TextField autoFocus value={email} onKeyDown={(e) => {
                if (e.key.toLowerCase().includes("enter")) {
                    setInfoBar(undefined);
                    setLoading(true);
                    forgotPassword().then()
                }
            }} onChange={(e) => setEmail(e.target.value)} label={t("repcloud.email")}/>
            <Button variant="contained" color="primary" onClick={() => {
                setInfoBar(undefined);
                setLoading(true);
                forgotPassword();
            }}>{t("repcloud.sendEmail")}</Button>
            <Link sx={{textAlign: "center", cursor: "pointer"}} onClick={() => {
                setInfoBar(undefined);
                setForgot(false);
                setLoading(false);
            }}>{t("back")}</Link>
        </>}
        </Box>
    </Layout> : <CssBaseline>
        <AppBar position="fixed" style={{zIndex: 1}}>
            <Toolbar sx={{paddingRight: "8px", backgroundColor: (theme) => theme.palette.error.main}}>
                <Typography variant="h6" component="div"
                            sx={{flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                    Feature not available
                </Typography>
            </Toolbar>
        </AppBar>
        <Stack direction="column" sx={{padding: "24px", height: "calc(100vh - 82px)", justifyContent: "center"}}>
            <Box sx={{display: "inline-block", width: "100%", height: "auto", textAlign: "center"}}><Report
                sx={{color: "red", width: "96px", height: "96px"}}/></Box>
            <Typography
                sx={{color: "white", marginBottom: "24px", fontWeight: 600, textAlign: "center"}}>RepCloud is not
                available for this app. This page should not be displayed.</Typography>
        </Stack><Button sx={{margin: "24px", width: "calc(100% - 48px)"}} color="error" variant="contained"
                        onClick={() => window.location.href = window.location.origin}
                        type="button">Reload</Button></CssBaseline>;
}

export default RepcloudLoginPage;
