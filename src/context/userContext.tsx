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
import React, {ReactElement, useContext, useEffect, useState} from "react";
import {User} from "../models/user";
import {DBContext} from "./dbContext";

export interface IUserContext {
    userName: string;
    user?: User;
    setUser?: (user: User) => void;
}

export const UserContext = React.createContext<IUserContext>({userName: localStorage.getItem("userName") || "Default User"});

export const UserContextProvider = ({children}: {children: ReactElement}) => {
    const userName = localStorage.getItem("userName") || "Default User";
    const { masterDb} = useContext(DBContext);
    const [user, setUser] = useState<User | undefined>(undefined);
    useEffect(() => {
        if (userName === "Default User") {
            setUser({name: userName, picture: localStorage.getItem("picture") || undefined})
        }
        masterDb?.user.get(userName).then((maybeUser) => {
            if (maybeUser) setUser(maybeUser);
        })
    }, [masterDb]);
    return <UserContext.Provider value={{userName, user, setUser}}>{children}</UserContext.Provider>
}
