/*
    This file is part of WeightLog.

    WeightLog is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WeightLog is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WeightLog.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, {useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {DBContext} from "../../context/dbContext";
import {User} from "../../models/user";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {AccountCircle, PersonAdd} from "@mui/icons-material";

export const Login = () => {
    const {t} = useTranslation();
    const {masterDb} = useContext(DBContext);
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => { if(!masterDb) return; masterDb.user.toArray().then((user) => setUsers(user))}, [masterDb]);
    const setUser = (username?: string) => {
        sessionStorage.clear();
        if (!username) {
            localStorage.removeItem("userName");
        } else localStorage.setItem("userName", username);
        window.location.href = window.location.origin;
    }

    const newUser = () => {
        const username = prompt(t("login.enterNewUsername"));
        if (!username || username === "Default User") return;
        masterDb?.user.put({name: username}).then(() => {
            setUser(username);
        });
    }

    const maybePicture = localStorage.getItem("picture");

    return <Layout title={t("login.selectAccount")} hideBack hideNav>
        <List sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
            <ListItemButton component="a" onClick={() => setUser("Default User")}>
                <ListItemAvatar>
                    {!maybePicture && <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <AccountCircle/>
                    </Avatar>}
                    {maybePicture && <Avatar src={maybePicture} />}
                </ListItemAvatar>
                <ListItemText primary={t("account.defaultUser")}/>
            </ListItemButton>
            {users.map((user) => <ListItemButton key={user.name} component="a" onClick={() => setUser(user.name)}>
                <ListItemAvatar>
                    {!user.picture && <Avatar sx={{bgcolor: (theme) => theme.palette.primary.main}}>
                        <AccountCircle/>
                    </Avatar>}
                    {user.picture && <Avatar src={user.picture} />}
                </ListItemAvatar>
                <ListItemText primary={user.name}/>
            </ListItemButton>)}
            <ListItemButton component="a" onClick={() => newUser()}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: (theme) => theme.palette.success.main}}>
                        <PersonAdd/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("login.newAccount")}/>
            </ListItemButton>
        </List>
    </Layout>
}
