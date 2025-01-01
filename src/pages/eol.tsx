import Layout from "../components/layout";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Box, Button, CircularProgress, useMediaQuery} from "@mui/material";
import {ArrowForward, ArrowRight} from "@mui/icons-material";
import {backupToJSON} from "../db/backup";
import {useContext, useState} from "react";
import {UserContext} from "../context/userContext";
import {DBContext} from "../context/dbContext";
import {SettingsContext} from "../context/settingsContext";
import Loader from "../components/Loader";

const EOLPage = () => {
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');
    const {t} = useTranslation();
    const [isWorking, setIsWorking] = useState(false);
    const {user} = useContext(UserContext);
    const {db} = useContext(DBContext);
    const settings = useContext(SettingsContext);

    const doBackup = () => {
        if (!db || !user) return;
        setIsWorking(true);
        backupToJSON(db, "everything", user, settings).then((blobUrl) => {
            const link = document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute("download", "repquest-backup-" + new Date().toJSON() + ".json");
            link.href = blobUrl;
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            setIsWorking(false);
        })
    }

    return <Layout title={t("eol.title")} scroll hideBack hideNav sx={{padding: "8px", height: "calc(100% - 18px)", width: "calc(100% - 16px)"}}>
        <Box sx={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center", marginBottom: "12px"}}><img src="https://raw.githubusercontent.com/marcsances/repquest/395957a7a947318e860a4146e2f607ab13a7e4c8/public/logo192.png" style={{flexGrow: 1, maxWidth: "30%", objectFit: "contain"}} />
            <ArrowForward sx={{placeSelf: "center", fontSize: "72px"}}/>
            <img src="/logo192.png" style={{flexGrow: 1, maxWidth: "30%", objectFit: "contain"}} /></Box>
        <Typography sx={{fontSize: "12px", marginBottom: "8px"}}>{t("eol.message")}</Typography>
        <Typography sx={{fontSize: "12px", marginBottom: "8px"}}>{t("eol.message2")}</Typography>
        <Typography sx={{fontSize: "12px", marginBottom: "8px"}}>{t("eol.message3")}</Typography>
        <Typography sx={{fontSize: "12px", marginBottom: "8px"}}>{t("eol.message4")}</Typography>
        <Typography sx={{fontSize: "12px", marginBottom: "8px"}}>{t("eol.message5")}</Typography>
        {isWorking ? <Box sx={{display: "flex", flexDirection: "row", placeSelf: "center"}}><CircularProgress size="24px" />&nbsp;{t("backup.backingUp")}</Box> : <><Button variant="outlined" sx={{width: "100%", marginBottom: "8px"}} onClick={doBackup}>{t("backup.doBackup")}</Button>
        <Button href="/#/login" variant="outlined" sx={{width: "100%", marginBottom: "8px"}}>{t("account.switchAccounts")}</Button><Button href="https://client.repquest.app" target="_blank" variant="outlined" sx={{width: "100%"}}>{t("eol.openRepquest")}</Button></>}
    </Layout>
}

export default EOLPage;