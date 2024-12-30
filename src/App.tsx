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
import React, {ReactElement, useContext, useState} from 'react';
import * as Sentry from "@sentry/react";
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {BrowserRouter, useNavigate} from "react-router-dom";
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
import {ApiContextProvider} from "./context/apiContext";
import {DialogContextProvider} from './context/dialogContext';
import AppRoutes from "./AppRoutes";
import {Geiger} from "react-geiger";

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

if (localStorage.getItem("disable_telemetry") !== "true") {
    Sentry.init({
        dsn: "https://a0ae6d17918730260356b59cf049b2a3@o4506716569927680.ingest.sentry.io/4506716576153601",
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
    const {db, masterDb} = useContext(DBContext);
    const {t} = useTranslation();
    const [masterDbReady, setMasterDbReady] = useState(false);
    const [dbReady, setDbReady] = useState(false);
    const navigate = useNavigate();
    if (masterDb) masterDb?.user.count().then((count) => {
        if (count === 0) {
            localStorage.setItem("userName", "Default User");
            setMasterDbReady(true);
        } else if (count > 0 && !localStorage.getItem("userName") && location.pathname !== "/login") {
            navigate("/login");
        } else setMasterDbReady(true);
    });
    if (masterDbReady && db) db.plan.count().then((count) => {
        if (count === 0) {
            db.plan.put({
                id: 1,
                name: "WeightLog",
                workoutIds: []
            }).then(() => {
                window.location.pathname = "/onboarding";
            });
        } else {
            setDbReady(true);
        }
    });
    if (dbReady || location.pathname === "/login") return children;
    return <div style={{width: "100vw", height: "100vh"}}><Loader prompt={t("loading")}/></div>;
}

function App() {
    const [appTheme, setAppTheme] = useState<AppTheme>((window.matchMedia && window.matchMedia('(prefers-color-scheme: light)')?.matches) || localStorage.getItem("theme") === "light" ? "light" : "dark");
    return (
        <ErrorBoundary>
            <ThemeProvider theme={appTheme === "light" ? lightTheme : darkTheme}>
                <DialogContextProvider>
                    <DBContext.Provider value={{db: new DexieDB(), masterDb: new MasterDB()}}>
                        <BrowserRouter>
                            <DBGuard>
                                <TimerContextProvider>
                                    <UserContextProvider>
                                        <SettingsContextProvider theme={appTheme} setTheme={setAppTheme}>
                                            <ApiContextProvider>
                                                <CalendarProvider>
                                                    <WorkoutContextProvider>
                                                        <Paper>
                                                            <AppRoutes />
                                                        </Paper>
                                                    </WorkoutContextProvider>
                                                </CalendarProvider>
                                            </ApiContextProvider>
                                        </SettingsContextProvider>
                                    </UserContextProvider>
                                </TimerContextProvider>
                            </DBGuard>
                        </BrowserRouter>
                    </DBContext.Provider>
                </DialogContextProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
