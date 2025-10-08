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
import React, {ReactElement, useContext, useEffect, useState} from 'react';
import * as Sentry from "@sentry/react";
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {HashRouter, useNavigate} from "react-router-dom";
import {createTheme, Paper, ThemeProvider} from '@mui/material';
import {DBContext} from "./context/dbContext";
import {DexieDB} from "./db/db";
import {WorkoutContextProvider} from './context/workoutContext';
import {AppTheme, SettingsContextProvider} from "./context/settingsContext";
import {UserContextProvider} from './context/userContext';
import ErrorBoundary from './components/errorBoundary';
// @ts-ignore
import {registerSW} from 'virtual:pwa-register';
import {TimerContextProvider} from "./context/timerContext";
import Loader from "./components/Loader";
import {useTranslation} from "react-i18next";
import {MasterDB} from "./db/masterDb";
import CalendarProvider from './context/calendarProvider';
import {DialogContextProvider} from './context/dialogContext';
import AppRoutes from "./AppRoutes";
import {SupabaseContextProvider} from "./context/supabaseContext";
import defer from "./utils/defer";

registerSW({immediate: true})
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light'
    }
})

if (localStorage.getItem("disable_telemetry") !== "true" && import.meta.env.VITE_SENTRY_ENABLED === "true") {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
            Sentry.browserTracingIntegration()
        ],
        // Performance Monitoring
        tracesSampleRate: 0.1,
        transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
        transportOptions: {
            dbName: 'sentry-offline',
            storeName: 'queue',
            maxQueueSize: 10,
            flushAtStartup: true
        }
    });
}

const DBGuard = ({children}: { children: ReactElement }) => {
    const {db} = useContext(DBContext);
    const {t} = useTranslation();
    const [userReady, setUserReady] = useState(false);
    const [dbReady, setDbReady] = useState(false);
    const navigate = useNavigate();
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        if (userReady) return;
        if (!localStorage.getItem("userName") && location.hash !== "#/login")  {
            localStorage.setItem("userName", "Default User");
            defer(() => window.location.reload());
        } else setUserReady(true);
    }, [db]);
    useEffect(() => {
        if (userReady && db) db.plan.count().then((count) => {
            if (count === 0) {
                db.plan.put({
                    id: 1,
                    name: "RepQuest",
                    workoutIds: []
                }).then(() => {
                    setDbReady(true);
                    defer(() => {
                        location.hash = "#/onboarding";
                        forceUpdate();
                    });
                });
            } else {
                setDbReady(true);
            }
        });
    }, [db, userReady]);
    if (dbReady || location.hash === "#/login" || location.hash === "#/onboarding") return children;
    return <div style={{width: "100vw", height: "100vh"}}><Loader prompt={t("loading")}/></div>;
}

function App() {
    const [appTheme, setAppTheme] = useState<AppTheme>((window.matchMedia && window.matchMedia('(prefers-color-scheme: light)')?.matches) || localStorage.getItem("theme") === "light" ? "light" : "dark");
    return (
        <ErrorBoundary>
            <ThemeProvider theme={appTheme === "light" ? lightTheme : darkTheme}>
                <DialogContextProvider>
                    <SupabaseContextProvider>
                        <DBContext.Provider value={{db: new DexieDB(), masterDb: new MasterDB()}}>
                            <HashRouter>
                                <DBGuard>
                                    <TimerContextProvider>
                                        <UserContextProvider>
                                            <SettingsContextProvider theme={appTheme} setTheme={setAppTheme}>
                                                <CalendarProvider>
                                                    <WorkoutContextProvider>
                                                        <Paper>
                                                            <AppRoutes />
                                                        </Paper>
                                                    </WorkoutContextProvider>
                                                </CalendarProvider>
                                            </SettingsContextProvider>
                                        </UserContextProvider>
                                    </TimerContextProvider>
                                </DBGuard>
                            </HashRouter>
                        </DBContext.Provider>
                    </SupabaseContextProvider>
                </DialogContextProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
