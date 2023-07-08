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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WorkoutList/>}/>
                <Route path="/history" element={<HistoryPage/>}/>
                <Route path="/settings" element={<SettingsPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
