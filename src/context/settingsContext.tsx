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
import React, {ReactElement, useCallback, useContext, useEffect, useState} from "react";
import {OneRm} from "../utils/oneRm";
import {TimerContext} from "./timerContext";
import {UserContext} from "./userContext";
import {DBContext} from "./dbContext";
import i18n from "i18next";

export interface ISettingsContext {
    showRpe: boolean;
    showRir: boolean;
    autostop: boolean;
    useLbs: boolean;
    sound: boolean;
    oneRm: OneRm;
    emojis: string[];
    refreshToken: string;
    fullname: string;
    saveRpe?: (value: boolean) => void;
    saveRir?: (value: boolean) => void;
    saveLbs?: (value: boolean) => void;
    saveSound?: (value: boolean) => void;
    saveAutostop?: (value: boolean) => void;
    saveOneRm?: (value: OneRm) => void;
    wakeLock?: boolean;
    toggleWakeLock?: () => void;
    errorWakeLock ?: boolean;
    lang?: string;
    saveLang?: (value: string) => void;
    saveEmojis?: (value: string[]) => void;
    saveRefreshToken?: (value: string) => void;
    saveFullname?: (value: string) => void;
}

export const SettingsContext = React.createContext({
    showRpe: false,
    showRir: false,
    useLbs: false,
    sound: false,
    autostop: true,
    oneRm: OneRm.EPLEY,
    wakeLock: false
} as ISettingsContext);

interface WakeLockSentinel {
    release: () => void;
    addEventListener: (event: string, eventHandler: () => void) => void;
}

export const DEFAULT_EMOJIS = ["1f44d", "1f44e", "1f4aa", "1f615", "1f915", "1f4a9"];

export const SettingsContextProvider = (props: { children: ReactElement }) => {
    const {children} = props;
    const [rpe, setRpe] = useState(localStorage.getItem("showRpe") === "true");
    const [rir, setRir] = useState(localStorage.getItem("showRir") === "true");
    const [lbs, setLbs] = useState(localStorage.getItem("useLbs") === "true");
    const [sound, setSound] = useState(localStorage.getItem("sound") === "true");
    const [autostop, setAutostop] = useState(localStorage.getItem("autostopDisabled") !== "true");
    const [wakeLock, setWakeLock] = useState(localStorage.getItem("wakeLock") === "true");
    const [errorWakeLock, setErrorWakeLock] = useState(false);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || "");
    const [fullname, setFullname] = useState(localStorage.getItem("fullname") || "");
    const [oneRm, setOneRm] = useState(parseInt(localStorage.getItem("oneRm") || "0"));
    const [emojis, setEmojis] = useState<string[]>(localStorage.getItem("emojis")?.split(";") || DEFAULT_EMOJIS);
    const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel | null>(null);
    const {time} = useContext(TimerContext);
    const { user, userName} = useContext(UserContext);
    const [lang, setLang] = useState<string | undefined>(user?.lang || localStorage.getItem("lang") || "");
    const {masterDb} = useContext(DBContext);
    const toggleWakeLock = () => {
        setWakeLock((prev) => {
            localStorage.setItem("wakeLock", prev ? "false" : "true");
            return !prev;
        });
    };

    useEffect(() => {
        if (["ca", "es", "en"].includes(lang || "")) {
            i18n.changeLanguage(lang || "en");
        }
    }, [lang]);

    useEffect(() => {
        if (user?.autostop !== undefined) setAutostop(user.autostop);
        if (user?.showRir !== undefined) setRir(user.showRir);
        if (user?.showRpe !== undefined) setRpe(user.showRpe);
        if (user?.useLbs !== undefined) setLbs(user.useLbs);
        if (user?.sound !== undefined) setSound(user.sound);
        if (user?.oneRm !== undefined) setOneRm(user.oneRm);
        if (user?.lang !== undefined) setLang(user.lang);
        if (user?.wakeLock !== undefined) setWakeLock(user.wakeLock);
        if (user?.emojis !== undefined) setEmojis(user.emojis);
        if (user?.refreshToken !== undefined) setRefreshToken(user.refreshToken);
        if (user?.fullname !== undefined) setFullname(user.fullname);
    }, [user]);

    const requestWakeLock = useCallback(async () => {
        if (!("wakeLock" in navigator)) return;
        if (wakeLock && !wakeLockSentinel) {
                try {
                    const sentinel: WakeLockSentinel = await (navigator as any).wakeLock.request("screen");
                    sentinel.addEventListener("release", () => {
                        setWakeLockSentinel(null);
                    });
                    setWakeLockSentinel(sentinel);
                    setErrorWakeLock(false);
                } catch {
                    setErrorWakeLock(true);
                }
        } else if (!wakeLock && wakeLockSentinel) {
            await wakeLockSentinel.release();
        }
    }, [wakeLock, wakeLockSentinel, setWakeLockSentinel]);

    useEffect(() => {
        requestWakeLock()
    }, [requestWakeLock, errorWakeLock, time, wakeLock, wakeLockSentinel, setWakeLock, setWakeLockSentinel]);
    const saveRpe = useCallback((value: boolean) => {
        if (userName === "Default User") localStorage.setItem("showRpe", value ? "true" : "false");
        else masterDb?.user.update(userName, { showRpe: value })
        setRpe(value);
    }, []);
    const saveRir = useCallback((value: boolean) => {
        if (userName === "Default User") localStorage.setItem("showRir", value ? "true" : "false");
        else masterDb?.user.update(userName, { showRir: value });
        setRir(value);
    }, []);
    const saveAutostop = useCallback((value: boolean) => {
        if (userName === "Default User") localStorage.setItem("autostopDisabled", value ? "false" : "true");
        else masterDb?.user.update(userName, {autostop: value});
        setAutostop(value);
    }, []);
    const saveLbs = useCallback((value: boolean) => {
        if (userName === "Default User") localStorage.setItem("useLbs", value ? "true" : "false");
        else masterDb?.user.update(userName, {useLbs: value});
        setLbs(value);
    }, []);
    const saveRefreshToken = useCallback((value: string) => {
        if (userName === "Default User") localStorage.setItem("refreshToken", value);
        else masterDb?.user.update(userName, {refreshToken: value});
        setRefreshToken(value);
    }, []);
    const saveFullname = useCallback((value: string) => {
        if (userName === "Default User") localStorage.setItem("fullname", value);
        else masterDb?.user.update(userName, {fullname: value});
        setFullname(value);
    }, []);
    const saveOneRm = useCallback((value: OneRm) => {
        if (userName === "Default User") localStorage.setItem("oneRm", value.toString(10));
        else masterDb?.user.update(userName, {oneRm: value});
        setOneRm(value);
    }, []);
    const saveSound = useCallback((value: boolean) => {
        if (userName === "Default User") localStorage.setItem("sound", value ? "true" : "false");
        else masterDb?.user.update(userName, {sound: value});
        setSound(value);
    }, []);
    const saveLang = useCallback((value: string) => {
        if (userName === "Default User") localStorage.setItem("lang", value);
        else masterDb?.user.update(userName, {lang: value});
        setLang(value);
    }, [])
    const saveEmojis = useCallback((value: string[]) => {
        if (userName === "Default User") localStorage.setItem("emojis", value.join(";"));
        else masterDb?.user.update(userName, {emojis: value});
        setEmojis(value);
    }, [])
    const settings = {
        showRpe: rpe,
        showRir: rir,
        useLbs: lbs,
        oneRm: oneRm,
        emojis,
        lang,
        autostop,
        refreshToken,
        fullname,
        saveRpe,
        saveRir,
        saveLbs,
        saveOneRm,
        saveLang,
        saveAutostop,
        wakeLock,
        toggleWakeLock,
        errorWakeLock,
        saveEmojis,
        saveRefreshToken,
        saveFullname,
        sound, saveSound
    };
    return <SettingsContext.Provider value={settings}>
        {children}
    </SettingsContext.Provider>
}
