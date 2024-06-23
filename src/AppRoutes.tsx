import {Route, Routes} from "react-router-dom";
import {Login} from "./pages/profile/login";
import {WorkoutList} from "./pages/workout-list/workout_list";
import {AppsMenu} from "./pages/apps/appsMenu";
import {Timer} from "./pages/apps/timer";
import {HistoryPage} from "./pages/history/history";
import StatsPage from "./pages/stats/stats";
import MetricsPage from "./pages/profile/metrics";
import {AppearanceSettingsPage} from "./pages/settings/appearanceSettings";
import {Backup} from "./pages/settings/backup";
import {SettingsPage} from "./pages/settings/settings";
import {Telemetry} from "./pages/settings/telemetry";
import {WorkoutSettingsPage} from "./pages/settings/workoutSettings";
import {SystemSettingsPage} from "./pages/settings/system";
import {WorkoutPage} from "./pages/workout/workout";
import PostWorkout from "./pages/workout/postWorkout";
import {WorkoutEditor} from "./pages/workout-editor/workout_editor";
import {WorkoutExerciseEditor} from "./pages/workout-editor/workoutExercise_editor";
import {ExerciseList} from "./pages/workout-editor/exercise_list";
import {ExerciseEditor} from "./pages/workout-editor/exercise_editor";
import {YoutubePlayer} from "./pages/workout/youtubePlayer";
import {PictureViewer} from "./pages/workout/pictureViewer";
import {WhatsNew} from "./pages/whatsNew/whatsNew";
import {License} from "./pages/whatsNew/license";
import OneRmCalculator from "./components/onermcalc";
import {AccountMenu} from "./pages/profile/accountMenu";
import {LoginPage} from "./pages/weightcloud/login";
import NotImplemented from "./pages/notImplemented";
import Onboarding from "./pages/onboarding/onboarding";
import React from "react";

const AppRoutes = () => {
    return <Routes>
        <Route path="/onboarding" element={<Onboarding/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<WorkoutList/>}/>
        <Route path="/apps" element={<AppsMenu/>}/>
        <Route path="/apps/timer" element={<Timer/>}/>
        <Route path="/history" element={<HistoryPage/>}/>
        <Route path="/account/stats" element={<StatsPage/>}/>
        <Route path="/account/measures"
               element={<MetricsPage/>}/>
        <Route path="/settings/appearance" element={<AppearanceSettingsPage />} />
        <Route path="/settings/backup"
               element={<Backup/>}/>
        <Route path="/onboarding/backup"
               element={<Backup onboarding/>}/>
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
               element={<WorkoutExerciseEditor />}/>
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
}

export default AppRoutes;
