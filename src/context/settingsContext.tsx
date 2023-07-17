import React, {ReactElement, useCallback, useState} from "react";

export interface ISettingsContext {
    showRpe: boolean;
    showRir: boolean;
    saveRpe?: (value: boolean) => void;
    saveRir?: (value: boolean) => void;
}

export const SettingsContext = React.createContext({
    showRpe: true,
    showRir: true
} as ISettingsContext);

export const SettingsContextProvider = (props: { children: ReactElement }) => {
    const {children} = props;
    const [rpe, setRpe] = useState(localStorage.getItem("showRpe") !== "false");
    const [rir, setRir] = useState(localStorage.getItem("showRir") !== "false");
    const saveRpe = useCallback((value: boolean) => {
        localStorage.setItem("showRpe", value ? "true" : "false");
        setRpe(value);
    }, []);
    const saveRir = useCallback((value: boolean) => {
        localStorage.setItem("showRir", value ? "true" : "false");
        setRir(value);
    }, []);
    const settings = {
        showRpe: rpe,
        showRir: rir,
        saveRpe,
        saveRir
    }
    return <SettingsContext.Provider value={settings}>
        {children}
    </SettingsContext.Provider>
}
