import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {OneRm} from "../utils/oneRm";

export interface ISettingsContext {
    showRpe: boolean;
    showRir: boolean;
    useLbs: boolean;
    oneRm: OneRm;
    saveRpe?: (value: boolean) => void;
    saveRir?: (value: boolean) => void;
    saveLbs?: (value: boolean) => void;
    saveOneRm?: (value: OneRm) => void;
    wakeLock?: boolean;
    saveWakeLock?: (value: boolean) => void;
    errorWakeLock ?: boolean;
}

export const SettingsContext = React.createContext({
    showRpe: true,
    showRir: true,
    useLbs: false,
    oneRm: OneRm.EPLEY,
    wakeLock: false
} as ISettingsContext);

interface WakeLockSentinel {
    release: () => void;
    addEventListener: (event: string, eventHandler: () => void) => void;
}

export const SettingsContextProvider = (props: { children: ReactElement }) => {
    const {children} = props;
    const [rpe, setRpe] = useState(localStorage.getItem("showRpe") !== "false");
    const [rir, setRir] = useState(localStorage.getItem("showRir") !== "false");
    const [lbs, setLbs] = useState(localStorage.getItem("useLbs") === "true");
    const [wakeLock, setWakeLock] = useState(localStorage.getItem("wakeLock") === "true");
    const [errorWakeLock, setErrorWakeLock] = useState(false);
    const [oneRm, setOneRm] = useState(parseInt(localStorage.getItem("oneRm") || "0"));
    const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel | null>(null);

    const requestWakeLock = useCallback(async () => {
            if (wakeLock && "wakeLock" in navigator && !wakeLockSentinel) {
                try {
                    const sentinel: WakeLockSentinel = await (navigator.wakeLock as any).request("screen");
                    sentinel.addEventListener("release", () => {
                        setWakeLockSentinel(null);
                    });
                    setWakeLockSentinel(sentinel);
                } catch {
                    setErrorWakeLock(true);
                }
            } else if (!wakeLock && "wakeLock" in navigator && wakeLockSentinel) {
                await wakeLockSentinel.release();
            }
        }, [wakeLock, wakeLockSentinel, setWakeLock, setWakeLockSentinel]);

    useEffect(() => { if ("wakeLock" in navigator) requestWakeLock() }, [requestWakeLock, wakeLock, wakeLockSentinel, setWakeLock, setWakeLockSentinel]);
    const saveRpe = useCallback((value: boolean) => {
        localStorage.setItem("showRpe", value ? "true" : "false");
        setRpe(value);
    }, []);
    const saveRir = useCallback((value: boolean) => {
        localStorage.setItem("showRir", value ? "true" : "false");
        setRir(value);
    }, []);
    const saveLbs = useCallback((value: boolean) => {
        localStorage.setItem("useLbs", value ? "true" : "false");
        setLbs(value);
    }, []);
    const saveOneRm = useCallback((value: OneRm) => {
        localStorage.setItem("oneRm", value.toString(10));
        setOneRm(value);
    }, [])
    const saveWakeLock = useCallback((value: boolean) => {
        localStorage.setItem("wakeLock", value ? "true" : "false");
        setWakeLock(value);
    }, []);
    const settings = {
        showRpe: rpe,
        showRir: rir,
        useLbs: lbs,
        oneRm: oneRm,
        saveRpe,
        saveRir,
        saveLbs,
        saveOneRm,
        saveWakeLock,
        errorWakeLock
    }
    return <SettingsContext.Provider value={settings}>
        {children}
    </SettingsContext.Provider>
}
