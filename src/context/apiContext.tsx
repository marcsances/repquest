import React, {ReactElement, useContext, useState} from "react";
import {SettingsContext} from "./settingsContext";

export interface ResponseOf <T> {
    code: number;
    payload?: T;
    headers?: object;
    error?: Error;
}

export const ApiContext = React.createContext({logged_in: false} as {
    apiFetch?: <T>(url: string, method?: string, body?: unknown, isAuth?: boolean, headers?: object, options?: object) => Promise<ResponseOf<T>>,
    login?: (username: string, password: string) => Promise<boolean>,
    logout?: () => Promise<boolean>
    logged_in: boolean
});

// TODO: use proper .env...
const API_HOST = "https://api.weightcloud.marcsances.net";

export const ApiContextProvider = (props: { children: ReactElement }) => {
    const {children} = props;
    const [authToken, setAuthToken] = useState<string>("");
    const {refreshToken, saveRefreshToken, saveFullname} = useContext(SettingsContext);

    async function apiFetchFn<T>(url: string, method: string = 'GET', body: unknown = undefined, isAuth = true, headers: object = {}, options: object = {}, retrying = false): Promise<ResponseOf<T>> {
        const output = await fetch(API_HOST + url, {
                method,
                body: body ? JSON.stringify(body) : undefined,
                headers: {
                    ...(body ? {"Content-Type": "application/json"} : {}),
                    ...(isAuth && authToken ? {"Authorization": `Bearer ${authToken}`} : {}),
                    ...headers
                },
                ...options
        });
        if (output.ok) {
            return { code: output.status, payload: output.headers.get("Content-Type") === "application/json" ? await output.json() as unknown as T : await output.text() as T, headers: output.headers } as ResponseOf<T>;
        } else if (output.status === 401 && isAuth && !retrying) {
            const response = await fetch(API_HOST + "/refresh", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                }
            });
            if (response.status === 401) {
                return { code: -2, error: new Error("TokenExpired")} as ResponseOf<T>;
            } else {
                const token = (await response.json() as unknown as {access_token: string}).access_token;
                setAuthToken(token);
                return apiFetchFn<T>(url, method, body, isAuth, {...headers, Authorization: `Bearer ${token}`}, options, true);
            }
        } else {
            return { code: output.status, error: new Error(await output.text()) } as ResponseOf<T>;
        }
    }

    async function login(username: string, password: string): Promise<boolean> {
        if (!saveRefreshToken || !saveFullname) return false;
        const output: ResponseOf<{access_token: string, refresh_token: string, fullname: string, email_verified: boolean}> = await apiFetchFn("/login", 'POST', {username, password}, false);
        if (output.code === 200) {
            setAuthToken(output.payload?.access_token || "");
            saveRefreshToken(output.payload?.refresh_token || "");
            saveFullname(output.payload?.fullname || username);
        }
        return output.code === 200;
    }

    async function logout(): Promise<boolean> {
        if (!saveRefreshToken) return false;
        setAuthToken("");
        saveRefreshToken("");
        return (await apiFetchFn<string>("/logout", "DELETE", undefined, false, {Authorization: `Bearer ${refreshToken}`})).code === 200;
    }

    const context = {
        apiFetch: apiFetchFn,
        login,
        logout,
        logged_in: refreshToken !== ""
    }
    return <ApiContext.Provider value={context}>
        {children}
    </ApiContext.Provider>
}
