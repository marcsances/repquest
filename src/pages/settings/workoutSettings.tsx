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
import React, {useContext, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Snackbar} from "@mui/material";
import FunctionsIcon from '@mui/icons-material/Functions';
import {SettingsContext} from "../../context/settingsContext";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Selector from "../../components/selector";
import {OneRm} from "../../utils/oneRm";
import {useNavigate} from "react-router-dom";
import {Straighten} from "@mui/icons-material";

declare let window: any;
export const WorkoutSettingsPage = () => {
    const {t} = useTranslation();

    const {  useLbs, oneRm,saveLbs, featureLevel, saveOneRm, autostop, saveAutostop } = useContext(SettingsContext);
    const navigate = useNavigate();
    const [openOneRm, setOpenOneRm] = useState(false);
    const [snackbar, setSnackbar] = useState<string>("");
    return <Layout title={t("workoutSettings")} hideNav>
        <List dense sx={{width: '100%', height: 'calc(100% - 78px)', overflow: "auto"}}>
            <ListItemButton component="a" onClick={() => { if (saveLbs) saveLbs(!useLbs) }}>
                <ListItemAvatar>
                    <Avatar><Straighten/></Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("unitSystem")} secondary={useLbs ? t("imperialSystem") : t("metricSystem")} />
            </ListItemButton>
            {featureLevel === "advanced" && <ListItemButton component="a" onClick={() => setOpenOneRm(true)}>
                <ListItemAvatar>
                    <Avatar>
                        <FunctionsIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("oneRmFormula")} secondary={["Epley", "Brzycki", t("average")][oneRm]} />
            </ListItemButton>}

            <ListItemButton component="a" onClick={() => { if (saveAutostop) saveAutostop(!autostop) }}>
                <ListItemAvatar>
                    <Avatar>
                        {autostop ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("autoStop")} secondary={t("autoStopDescription")} />
            </ListItemButton>
        </List>
        <Selector
            defaultValue={oneRm.toString(10)}
            open={openOneRm}
            onClose={(val: string) => {
                if (saveOneRm) saveOneRm(parseInt(val));
                setOpenOneRm(false);
            }}
            title={t("oneRmFormula")}
            entries={[{key: OneRm.EPLEY.toString(10), value: "Epley"}, {key: OneRm.BRZYCKI.toString(10), value: "Brzycki"}, {key: OneRm.AVERAGE.toString(10), value: t("average")}]}
        />
        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
    </Layout>;
}
