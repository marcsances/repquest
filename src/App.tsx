import React from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {WorkoutList} from "./pages/workout-list/workout_list";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {SettingsPage} from "./pages/settings/settings";
import {HistoryPage} from "./pages/history/history";
import {WorkoutPage} from "./pages/workout/workout";
import {YoutubePlayer} from "./pages/workout/youtubePlayer";
import {createTheme, Paper, ThemeProvider} from '@mui/material';
import {DBContext} from "./context/dbContext";
import {DexieDB} from "./db/db";
import {WorkoutContextProvider} from './context/workoutContext';
import {SettingsContextProvider} from "./context/settingsContext";
import {UserContext} from './context/userContext';
import {HistoryEntry} from "./pages/history/historyEntry";
import ErrorBoundary from './components/errorBoundary';
import {PictureViewer} from "./pages/workout/pictureViewer";
import {WhatsNew} from "./pages/whatsNew/whatsNew";
import {Backup} from "./pages/settings/backup";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {

    return (
        <ErrorBoundary>
            <ThemeProvider theme={darkTheme}>
                <DBContext.Provider value={{db: new DexieDB()}}>
                    <UserContext.Provider value={{userName: "Default User"}}>
                        <WorkoutContextProvider>
                            <SettingsContextProvider>
                                <BrowserRouter>
                                    <Paper>
                                        <Routes>
                                            <Route path="/" element={<WorkoutList/>}/>
                                            <Route path="/history" element={<HistoryPage/>}/>
                                            <Route path="/history/:workoutId" element={<HistoryEntry/>}/>
                                            <Route path="/settings/backup"
                                                   element={<Backup/>}/>
                                            <Route path="/settings" element={<SettingsPage/>}/>
                                            <Route path="/workout" element={<WorkoutPage/>}/>
                                            <Route path="/youtube"
                                                   element={<YoutubePlayer/>}/>
                                            <Route path="/picture"
                                                   element={<PictureViewer/>}/>
                                            <Route path="/whats-new"
                                                   element={<WhatsNew/>}/>
                                        </Routes>
                                    </Paper>
                                </BrowserRouter>
                            </SettingsContextProvider>
                        </WorkoutContextProvider>
                    </UserContext.Provider>
                </DBContext.Provider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
