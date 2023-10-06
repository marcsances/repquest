import React from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";

export const WhatsNew = () => {
    const {t} = useTranslation();
    return <Layout title={t("whatsNew")} hideNav scroll>
        <Box sx={{padding: "20px", height: "100%", width: "100%"}}>
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
