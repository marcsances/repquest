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
import {WorkoutList} from "./pages/workout-list/workout_list";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import {SettingsPage} from "./pages/settings/settings";
import {HistoryPage} from "./pages/history/history";
import {WorkoutPage} from "./pages/workout/workout";
import {YoutubePlayer} from "./pages/workout/youtubePlayer";
import {createTheme, Paper, ThemeProvider} from '@mui/material';
import {DBContext} from "./context/dbContext";
import {DexieDB} from "./db/db";
import {WorkoutContextProvider} from './context/workoutContext';
import {SettingsContextProvider} from "./context/settingsContext";
import {UserContextProvider} from './context/userContext';
import ErrorBoundary from './components/errorBoundary';
import {PictureViewer} from "./pages/workout/pictureViewer";
import {WhatsNew} from "./pages/whatsNew/whatsNew";
import {Backup} from "./pages/settings/backup";
import {ExerciseList} from "./pages/workout-editor/exercise_list";
import {ExerciseEditor} from "./pages/workout-editor/exercise_editor";
import {WorkoutEditor} from './pages/workout-editor/workout_editor';
import {WorkoutExerciseEditor} from './pages/workout-editor/workoutExercise_editor';
// @ts-ignore
import {registerSW} from 'virtual:pwa-register';
import {TimerContextProvider} from "./context/timerContext";
import OneRmCalculator from "./components/onermcalc";
import {Telemetry} from "./pages/settings/telemetry";
import {WorkoutSettingsPage} from "./pages/settings/workoutSettings";
import {SystemSettingsPage} from "./pages/settings/system";
import Loader from "./components/Loader";
import {useTranslation} from "react-i18next";
import {AccountMenu} from "./pages/profile/accountMenu";
import {MasterDB} from "./db/masterDb";
import {Login} from "./pages/profile/login";
import NotImplemented from "./pages/notImplemented";
import CalendarProvider from './context/calendarProvider';
import PostWorkout from "./pages/workout/postWorkout";
import {License} from "./pages/whatsNew/license";
import StatsPage from "./pages/stats/stats";
import MetricsPage from './pages/profile/metrics';
import {ApiContextProvider} from "./context/apiContext";
import {LoginPage} from "./pages/weightcloud/login";
import {AppsMenu} from "./pages/apps/appsMenu";
import {Timer} from "./pages/apps/timer";
import {DialogContextProvider} from './context/dialogContext';

registerSW({immediate: true})
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

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
    if (masterDb) db?.user.count().then((count) => {
        if (count > 0 && !localStorage.getItem("userName") && location.pathname !== "/login") {
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
                window.location.reload();
            });
        } else {
            setDbReady(true);
        }
    });
    if (dbReady || location.pathname === "/login") return children;
    return <div style={{width: "100vw", height: "100vh"}}><Loader prompt={t("loading")}/></div>;
}

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider theme={darkTheme}>
                <DialogContextProvider>
                    <DBContext.Provider value={{db: new DexieDB(), masterDb: new MasterDB()}}>
                        <BrowserRouter>
                            <DBGuard>
                                <TimerContextProvider>
                                    <UserContextProvider>
                                        <SettingsContextProvider>
                                            <ApiContextProvider>
                                                <CalendarProvider>
                                                    <WorkoutContextProvider>
                                                        <Paper>
                                                            <Routes>
                                                                <Route path="/login" element={<Login/>}/>
                                                                <Route path="/" element={<WorkoutList/>}/>
                                                                <Route path="/apps" element={<AppsMenu/>}/>
                                                                <Route path="/apps/timer" element={<Timer/>}/>
                                                                <Route path="/history" element={<HistoryPage/>}/>
                                                                <Route path="/account/stats" element={<StatsPage/>}/>
                                                                <Route path="/account/measures"
                                                                       element={<MetricsPage/>}/>
                                                                <Route path="/settings/backup"
                                                                       element={<Backup/>}/>
                                                                <Route path="/settings" element={<SettingsPage/>}/>
                                                                <Route path="/settings/telemetry"
                                                                       element={<Telemetry/>}/>
                                                                <Route path="/settings/workout"
                                                                       element={<WorkoutSettingsPage/>}/>
                                                                <Route path="/settings/system"
                                                                       element={<SystemSettingsPage/>}/>
                                                                <Route path="/workout" element={<WorkoutPage/>}/>
                                                                <Route path="/workout/postworkout"
                                                                       element={<PostWorkout/>}/>
                                                                <Route path="/workout/:workoutId"
                                                                       element={<WorkoutEditor/>}/>
                                                                <Route path="/workoutExercise/:workoutExerciseId"
                                                                       element={<WorkoutExerciseEditor/>}/>
                                                                <Route path="/exercises" element={<ExerciseList/>}/>
                                                                <Route path="/exercises/:exerciseId"
                                                                       element={<ExerciseEditor/>}/>
                                                                <Route path="/youtube"
                                                                       element={<YoutubePlayer/>}/>
                                                                <Route path="/picture"
                                                                       element={<PictureViewer/>}/>
                                                                <Route path="/whats-new"
                                                                       element={<WhatsNew/>}/>
                                                                <Route path="/license"
                                                                       element={<License/>}/>
                                                                <Route path="/onerm" element={<OneRmCalculator/>}/>
                                                                <Route path="/account" element={<AccountMenu/>}/>
                                                                <Route path="/account/login" element={<LoginPage/>}/>
                                                                <Route path="*" element={<NotImplemented/>}/>
                                                            </Routes>
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
