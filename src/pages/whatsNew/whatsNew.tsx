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
import React from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";

export const WhatsNew = () => {
    const {t} = useTranslation();
    return <Layout title={t("whatsNew")} hideNav scroll>
        <Box sx={{padding: "20px", width: "calc(100% - 40px)", height: "calc(100vh - 96px)", overflow: "scroll"}}>
            <Typography variant="h4">WeightLog</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.<br/>
                This program is free software: you can redistribute it and/or modify
                it under the terms of the GNU General Public License as published by
                the Free Software Foundation, either version 3 of the License, or
                (at your option) any later version.

                This program is distributed in the hope that it will be useful,
                but WITHOUT ANY WARRANTY; without even the implied warranty of
                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                GNU General Public License for more details.

                You should have received a copy of the GNU General Public License
                along with this program.  If not, see <a href="Https://www.gnu.org/licenses" style={{ color: "white" }}>https://www.gnu.org/licenses/</a>.
            </Typography>
            <br/>
            <Typography variant="h4">WeightLog Version 0.2.5</Typography>
            <Typography variant="subtitle1">Released on 03/11/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added the possibility to reorder workouts in workout plans.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>If an exercise without rest is completed while a rest from a previous exercise was in progress, the rest will now be stopped.</li>
                <li>The workout summary page will now show "Set" when an exercise with no parameters is completed.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.2.4</Typography>
            <Typography variant="subtitle1">Released on 24/09/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Removed menu in workout list and switched by a simple button to change plans.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Solved a bug showing a wrongly aligned 0 in the rest screen when the next set weight is 0.</li>
                <li>Disabled the possibility of adding or removing a set to the current exercise until the user is in the last set.</li>
                <li>Fixed "Exercise completed" background color in light mode</li>
                <li>Fixed 1RM calculator not scrolling when opened from the tools menu</li>
                <li>Save button is now disabled in completed exercises</li>
            </ul>
            <Typography variant="h5">Maintenance</Typography>
            <ul>
                <li>Updated package dependencies to latest versions</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.2.3</Typography>
            <Typography variant="subtitle1">Released on 07/08/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Bulk editor now allows to enter decimal numbers</li>
                <li>Fixed an issue with light mode causing the save button in bulk editor to not be visible</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.2.2</Typography>
            <Typography variant="subtitle1">Released on 23/06/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>New onboarding wizard will show for new users.</li>
                <li>Added new help screens to guide the user through the app.</li>
                <li>Added bulk editor for workouts.</li>
            </ul>
            <Typography variant="h5">Improvements</Typography>
            <ul>
                <li>The next set will be focused when changing exercises instead of the first set.</li>
                <li>Removed the arrow buttons to change sets to improve the functionality of the app. You can edit the sets in the history.</li>
                <li>Making history page visible by default in simple mode.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.2.1</Typography>
            <Typography variant="subtitle1">Released on 22/06/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Simple layout now shows only the exercise image by default (user can tap to see the history)</li>
                <li>Bigger controls in simple layout and using better the screen space.</li>
                <li>Bigger font size in all layouts for the parameters.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.2.0</Typography>
            <Typography variant="subtitle1">Released on 22/06/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>New appearance settings page.</li>
                <li>New feature level setting: simple layout for beginners and advanced layout for more advanced lifters</li>
                <li>User RPE visibility setting is considered as having "advanced" mode enabled. If you want to change this go to settings</li>
                <li>RPE and RIR no longer independently configurable, they are now bound to advanced mode</li>
                <li>Simple mode hides 1RM and notes, as well as RPE and RIR fields. Supersets and set types are not available either.</li>
                <li>New light theme in beta available in appearance settings.</li>
                <li>Some settings moved from workout settings to appearance settings.</li>
                <li>Some margins and layouts have been fixed.</li>
                <li>More improvements to simple layout will come soon. Stay tuned!</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.68</Typography>
            <Typography variant="subtitle1">Released on 22/06/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Metrics chart no longer displayed in reverse order.</li>
                <li>Fixed an error causing new alert dialogs to not show any content.</li>
                <li>Fixed an error causing user metrics to not be restored from backups.</li>
                <li>Added some missing user preferences in backup objects.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.67</Typography>
            <Typography variant="subtitle1">Released on 15/06/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Rest timer beep now available also in workout and workout list screens.</li>
                <li>Information from last set of history (if available) is now automatically copied into the current set.</li>
                <li>The workout screen now lets you know when you completed an exercise so you don't overwrite your existing data.</li>
                <li>Improved system error screen.</li>
                <li>All the browser prompts have been replaced with our own prompts</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Edit set screen no longer has the notes field.</li>
                <li>Fixed search box layout and padding in exercise list</li>
                <li>Removed account menu from exercise picker, now only visible in exercise list</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.66</Typography>
            <Typography variant="subtitle1">Released on 08/05/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Cues for the sets are back below the exercise name (except for small layouts)</li>
                <li>Added a helper text in the screens with dropdowns to allow identify the controlled parameter</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Metrics screen now properly obtains the last values instead of the first ones</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.65</Typography>
            <Typography variant="subtitle1">Released on 14/04/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added average formula of Epley + Brzycki for 1RM</li>
                <li>Account menu is now in Settings page. In the top bar there is a shortcut to change accounts or log
                    in to WeightCloud.
                </li>
                <li>Added apps menu. The 1RM calculator, history, body metrics and stats are now here.</li>
                <li>Added stopwatch app.</li>
                <li>Added beeps when rest timer is about to finish (must be enabled through settings and only works when rest timer is focused).</li>
                <li>Pictures are now compressed to save disk space and prevent crashes when large pictures are attached.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Fixed body fat metrics in calculator not updating properly in certain situations.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.64</Typography>
            <Typography variant="subtitle1">Released on 01/04/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>WeightCloud: Added WeightCloud login for users with access to this service.</li>
                <li>Added support to backup to WeightCloud.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.63</Typography>
            <Typography variant="subtitle1">Released on 25/03/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added a feedback form link.</li>
                <li>First public version on GitHub.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.62</Typography>
            <Typography variant="subtitle1">Released on 10/03/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added the possibility to add notes and emojis to sets.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.61</Typography>
            <Typography variant="subtitle1">Released on 10/03/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added the possibility to view an exercise history without starting a workout, through the exercise editor.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.60</Typography>
            <Typography variant="subtitle1">Released on 10/03/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added period selector for stats and metrics screens.</li>
                <li>Added body fat and BMI calculator in the metrics page.</li>
                <li>Stats screen now shows maximum values for the selected exercise.</li>
                <li>Body weight exercises now display a button to use the last recorded user weight from the metrics screen, if one defined.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Corrected metrics screen showing metrics in reverse order.</li>
                <li>Fixed share feature not exporting sets from workouts.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.59</Typography>
            <Typography variant="subtitle1">Released on 08/03/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added early preview of user metrics feature.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Fixed loss of precision in parameters when doing very small increments (things like 2.00000001)</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.58</Typography>
            <Typography variant="subtitle1">Released on 06/03/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added early preview of stats feature.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.57</Typography>
            <Typography variant="subtitle1">Released on 06/03/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added support for supersets (only sets of two exercises for now...)</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.56</Typography>
            <Typography variant="subtitle1">Released on 04/03/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Fixed post workout screen crashing on iOS devices.</li>
                <li>Fixed post workout screen title.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.55</Typography>
            <Typography variant="subtitle1">Released on 04/03/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added the possibility to change the default increments for common parameters.</li>
                <li>Added GPL license disclaimer. Planning to open source this project soon. If you want the source code earlier, please contact me through email and I'll happily send it to you.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Fixed post workout screen freezing in iOS devices when leaving the app and resuming.</li>
                <li>Fixed timer in post workout screen.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.54</Typography>
            <Typography variant="subtitle1">Released on 19/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>New post workout screen.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.53</Typography>
            <Typography variant="subtitle1">Released on 18/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>New history browser with calendar and a more friendly format.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Rest time no longer can show as negative.</li>
                <li>Some performance and stability improvements around workouts and session restoring.</li>
                <li>Solved an error preventing the user from editing or deleting history entries.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.52</Typography>
            <Typography variant="subtitle1">Released on 12/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Reorganised history table, removing delete set button (you can still delete a set through the edit menu), placing edit and copy buttons inline.</li>
                <li>Temporarily disabling profile history as we work in reworking this feature.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.51</Typography>
            <Typography variant="subtitle1">Released on 11/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added a shortcut to edit exercises from within the workout editor.</li>
                <li>Made tags field in exercise editor more prominent when there are no tags set yet.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.50</Typography>
            <Typography variant="subtitle1">Released on 11/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Supports importing CSV files from a popular Android gym app.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.49</Typography>
            <Typography variant="subtitle1">Released on 11/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Extended account menu with upcoming features. Stay tuned!</li>
                <li>Supports importing CSV files from a popular Android gym app.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Fixed app manifest to package for stores.</li>
                <li>Added a fallback UI in case we messed things somewhere and you end up in a nonexistant route.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.48</Typography>
            <Typography variant="subtitle1">Released on 11/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>User preferences are now saved per profile.</li>
                <li>Default users can now have a profile picture.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.47</Typography>
            <Typography variant="subtitle1">Released on 10/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added autostop feature to stop and save workouts after one hour of inactivity. You can disable it in the workout preferences.</li>
                <li>Improved padding in history table so all data is visible at a glance without scrolling.</li>
                <li>Added an edit and delete option in history entries.</li>
                <li>Support for multiple user accounts and profile picture, more features to come.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Fixed an issue causing workout history to not match the actual workout ocassionally.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.46</Typography>
            <Typography variant="subtitle1">Released on 09/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Exercises can be started now from the exercise page.</li>
                <li>Settings page has been reorganised in sections to make it cleaner.</li>
                <li>It is now possible to share workouts, plans and exercises without having to make a full backup. Workouts are shared in their individual plan (we are working in allowing to add them to an existing plan yet).</li>
                <li>RPE and RIR are no longer enabled by default (this is for advanced users).</li>
                <li>Added a button to reload the page if it gets stuck.</li>
                <li>It is now possible to set a color for workouts.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Page no longer reloads when clicking bottom navigation links.</li>
                <li>Page no longer flickers when opening for the first time or after an app reset.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.45</Typography>
            <Typography variant="subtitle1">Released on 09/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added telemetry via Sentry. This allows us to gather error reports when the app breaks and have some insights on the app usage. You can disable telemetry through the app preferences.</li>
                <li>Added contact button.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.44</Typography>
            <Typography variant="subtitle1">Released on 04/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Small UI layout is no longer activated when the screen orientation is changed and the app enters in pseudo rotation lock mode.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.42</Typography>
            <Typography variant="subtitle1">Released on 04/02/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li><b>Free workouts:</b>&nbsp;Now users can mix exercises in the same workout, either by picking exercises one by one, or preselecting from existing workouts.</li>
                <li><b>Swap exercise:</b>&nbsp;Now users can users can swap an exercise with alternatives hitting the same muscle groups (or a different exercise).</li>
                <li>Reworked workout page: Improved layout for smaller phones. History is now always shown and only shows last 20 entries by default for improved performance.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Added some missing scrollbars.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.41</Typography>
            <Typography variant="subtitle1">Released on 29/01/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added a button to copy a set from history.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.40</Typography>
            <Typography variant="subtitle1">Released on 22/01/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added 1RM calculator.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.39</Typography>
            <Typography variant="subtitle1">Released on 22/01/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Fixed issues causing the personal bests feature to report wrong exercises.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.38</Typography>
            <Typography variant="subtitle1">Released on 21/01/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added personal bests notification dialog.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Solved an error causing the backup restore feature to not work in certain conditions.</li>
                <li>Solved an error where history entries do not appear for the last exercise.</li>
                <li>Empty history entries are no longer shown in the history.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.37</Typography>
            <Typography variant="subtitle1">Released on 14/01/2024</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2024. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>The end of workout menu now shows when stopping workouts.</li>
                <li>The end of workout menu now includes an option to download a backup after each workout.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.36</Typography>
            <Typography variant="subtitle1">Released on 12/12/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Application updates will come in faster.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.34</Typography>
            <Typography variant="subtitle1">Released on 12/12/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>It is now possible to add and remove sets from a workout.</li>
                <li>New "End of Workout" popup allowing to add another set, go back or stop the workout.</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Fixed a bug causing user being unable to input RPE/RIR with the toggle buttons when these parameters
                    were unset in the workout.
                </li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.33</Typography>
            <Typography variant="subtitle1">Released on 10/12/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>We enabled again the backup restore feature after resolving all the issues.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.32</Typography>
            <Typography variant="subtitle1">Released on 10/12/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Fixed issues with fetching workout history.</li>
                <li>Added factory reset feature.</li>
                <li>We disabled the backup reset feature as it causes issues in the app. We aim to restore it as soon as
                    possible.
                </li>
                <li>We changed the build system and the application will perform faster.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.31</Typography>
            <Typography variant="subtitle1">Released on 13/10/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Added backup restore feature.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.30</Typography>
            <Typography variant="subtitle1">Released on 11/10/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <Typography>Welcome to our first public version of WeightLog! We've worked hard to allow you to start using
                WeightLog.</Typography>
            <br/>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Workout editor is fully functional now, including adding new exercises and creating and deleting
                    exercises, workouts and plans.
                </li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Fixed glitch in youtube url field in exercise editor.</li>
                <li>Fixed width of app bar in desktop.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.29</Typography>
            <Typography variant="subtitle1">Released on 10/10/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <br/>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Partially functional workout editor (can add and remove exercises but only in existing workouts)
                </li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.28</Typography>
            <Typography variant="subtitle1">Released on 06/10/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <br/>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Exercise editor now able to save.</li>
                <li>Exercise editor now able to edit exercise names, youtube ID and picture (tags coming soon).</li>
            </ul>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>The image in the workout card is visible again.</li>
                <li>The what's new page can be scrolled again.</li>
                <li>Added missing assets for iOS splash screens.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.27</Typography>
            <Typography variant="subtitle1">Released on 05/10/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <br/>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>Pseudo rotation allows to use the app in iOS with rotation unlocked.</li>
                <li>Added custom splash screen for iOS and some theme coloring for the PWA.</li>
                <li>Added exercise database browser and editor (work in progress).</li>
            </ul>
            <br/>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>The cancel button in the backup menu is now functional.</li>
            </ul>
            <Typography variant="h4">WeightLog Version 0.1.26</Typography>
            <Typography variant="subtitle1">Released on 03/10/2023</Typography>
            <Typography variant="subtitle2">Copyright Marc Sances 2023. All rights reserved.</Typography>
            <br/>
            <Typography variant="h5">Features</Typography>
            <ul>
                <li>New backup feature in design, currently supporting data export to a file.</li>
                <li>You can change the type of set from the workout window.</li>
                <li>Restored vibration support only for Android phones.</li>
                <li>Screen orientation is locked where supported.</li>
                <li>Added new workout menu with quick access to Youtube, exercise picture, and RPE/RIR settings.</li>
                <li>Wake lock feature preventing the screen from turning off can be accessed from the new workout menu
                    in supported devices.
                </li>
                <li>Added change log.</li>
                <li>Increased internal timers to make smoother time animations.</li>
            </ul>
            <br/>
            <Typography variant="h5">Bugfixes</Typography>
            <ul>
                <li>Erasing a parameter no longer causes an error.</li>
                <li>Rest timer no longer goes negative in the workout widget</li>
                <li>Fixed height of rest timer to a fixed size</li>
                <li>History now shows correct month in dates</li>
            </ul>
        </Box>
    </Layout>;
}
