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

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {

    return (
        <ThemeProvider theme={darkTheme}>
            <DBContext.Provider value={{db: new DexieDB()}}>
                <WorkoutContextProvider>
                    <BrowserRouter>
                                <Paper>
                                    <Routes>
                                        <Route path="/" element={<WorkoutList/>}/>
                                        <Route path="/history" element={<HistoryPage/>}/>
                                        <Route path="/settings" element={<SettingsPage/>}/>
                                        <Route path="/workout" element={<WorkoutPage/>}/>
                                        <Route path="/youtube"
                                               element={<YoutubePlayer />}/>
                                    </Routes>
                                </Paper>
                        </BrowserRouter>
                    </WorkoutContextProvider>
            </DBContext.Provider>
        </ThemeProvider>
    );
}

export default App;
