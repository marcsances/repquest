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
import {Workout} from "./pages/workout/workout";
import {YoutubePlayer} from "./pages/workout/youtubePlayer";
import {createTheme, Paper, ThemeProvider} from '@mui/material';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <BrowserRouter>
                <Paper>
                    <Routes>
                        <Route path="/" element={<WorkoutList/>}/>
                        <Route path="/history" element={<HistoryPage/>}/>
                        <Route path="/settings" element={<SettingsPage/>}/>
                        <Route path="/workout" element={<Workout/>}/>
                        <Route path="/youtube"
                               element={<YoutubePlayer exerciseName="Barbell Bench Press" embedId="vthMCtgVtFw"/>}/>
                    </Routes>
                </Paper>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
