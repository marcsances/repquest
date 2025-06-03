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
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Snackbar} from "@mui/material";
import {AccountCircle, DeleteForever, Link, SwapHoriz} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {DBContext} from "../../context/dbContext";
import {UserContext} from "../../context/userContext";
import CollectionsIcon from "@mui/icons-material/Collections";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Selector from "../../components/selector";
import getBase64 from "../../utils/base64";
import {DialogContext} from "../../context/dialogContext";
import defer from "../../utils/defer";

export const AccountMenuList = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {userName, user, setUser} = useContext(UserContext);

    return <List>
        <ListItemButton component="a" onClick={() => navigate("/account")}>
            <ListItemAvatar>
                <Avatar sx={{width: "32px", height: "32px", bgcolor: (theme) => theme.palette.primary.main}}>
                    {(!user || !user.picture) && <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <AccountCircle/>
                    </Avatar>}
                    {user?.picture && <Avatar src={user!.picture} />}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={userName || t("account.title")}/>
        </ListItemButton>
        <ListItemButton component="a" onClick={() => navigate("/login")}>
            <ListItemAvatar>
                <Avatar sx={{width: "32px", height: "32px", bgcolor: (theme) => theme.palette.warning.main}}>
                    <SwapHoriz/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("account.switchAccounts")} />
        </ListItemButton>
    </List>
}

export const AccountMenu = () => {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const {masterDb, db} = useContext(DBContext);
    const {userName, user, setUser} = useContext(UserContext);
    const [ pictureSelectorOpen, setPictureSelectorOpen ] = useState(false);
    const [ snackbar, setSnackbar ] = useState<string | null>(null);
    const { showAlert, showPrompt } = useContext(DialogContext);


    const deleteAccount = () => {
        showAlert(t("account.deleteAccount"), t("deleteAllWarning"), (result) => {
                if (result) defer(() => showAlert(t("account.deleteAccount"), t("deleteAllWarning2"), (result) => {
                    if (result) db?.delete().then(() => {
                        masterDb?.user.delete(userName).then(() => {
                            localStorage.removeItem("workoutContext");
                            sessionStorage.clear();
                            location.href = window.location.origin + "/#/login";
                        });
                    });
                }))
            }
        )
    };

    return <Layout title={userName === "Default User" ? t("account.title") : userName}>
        <List sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
            <ListItemButton component="a" onClick={() => setPictureSelectorOpen(true)}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        {(!user || !user.picture) && <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                            <AccountCircle/>
                        </Avatar>}
                        {user?.picture && <Avatar src={user!.picture} />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("account.profilePicture")}/>
            </ListItemButton>
            <ListItemButton component="a" onClick={() => navigate("/login")}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.warning.main}}>
                        <SwapHoriz/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("account.switchAccounts")} />
            </ListItemButton>
            {userName !== "Default User" && <ListItemButton component="a" onClick={deleteAccount}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.error.main}}>
                        <DeleteForever/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("account.deleteAccount")} />
            </ListItemButton>}
        </List>
        <Selector open={pictureSelectorOpen} defaultValue="cancel" onClose={(key: string) => {
            if (key === "enterPictureUrl") {
                showPrompt(t("workoutEditor.enterPictureUrl"), "", (url) => {
                    const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
                    if (url && user && setUser && httpRegex.test(url)) {
                        if (userName !== "Default User") {
                            masterDb?.user.update(userName, {picture: url}).then(() => {
                                setUser({...user, picture: url});
                            });
                        } else {
                            localStorage.setItem("picture", url);
                            setUser({...user, picture: url});
                        }
                    } else setSnackbar(t("errors.pleaseValidUrl"));
                });
            } else if (key === "clearImage" && user && setUser) {
                if (userName !== "Default User") masterDb?.user.update(userName, {picture: undefined}).then(() => setUser({...user, picture: undefined}));
                else {
                    localStorage.removeItem("picture");
                    setUser({...user, picture: undefined});
                }
            } else if (key === "uploadPicture") {
                const input = document.createElement('input');
                input.setAttribute('accept', 'image/*');
                input.setAttribute('type', 'file');
                document.body.appendChild(input);
                input.onchange = () => {
                    if (input.files && input.files[0]) getBase64(input.files[0]).then((url: string | undefined) => {
                        if (url && user && setUser) {
                            if (userName !== "Default User") {
                                masterDb?.user.update(userName, {picture: url}).then(() => setUser({...user, picture: url}));
                            } else {
                                localStorage.setItem("picture", url);
                                setUser({...user, picture: url});
                            }
                        }
                    }).catch(() => {
                        setSnackbar(t("somethingWentWrong"));
                    }).finally(() => {
                        input.parentNode?.removeChild(input);
                    })
                    else input.parentNode?.removeChild(input);
                };
                input.click();
            }
            setPictureSelectorOpen(false);
        }} title={t("workoutEditor.uploadPicture")} entries={[
            {key: "uploadPicture", value: t("workoutEditor.uploadPicture"), icon: <CollectionsIcon/>},
            {key: "enterPictureUrl", value: t("workoutEditor.enterPictureUrl"), icon: <Link/>},
            {key: "clearImage", value: t("workoutEditor.clearPicture"), icon: <DeleteIcon/>},
            {key: "cancel", value: t("cancel"), icon: <CloseIcon/>}]}></Selector>
        <Snackbar
            open={snackbar !== null}
            autoHideDuration={2000}
            onClose={() => setSnackbar(null)}
            message={snackbar}
        />
    </Layout>;
}
