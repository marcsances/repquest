/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
import {WorkoutContext} from "../context/workoutContext";
import {Button, Dialog, DialogActions, DialogTitle, List, ListItemText} from "@mui/material";
import React, {useContext} from "react";
import {PB} from "../models/pb";
import {useTranslation} from "react-i18next";

const PbsDialog = (props: { onClose: () => void }) => {
    const {onClose} = props;
    const {pbs} = useContext(WorkoutContext);
    const bests: Record<string, PB[]> = {};
    pbs?.forEach(async (pb) => {
        bests[pb.exercise] = [...(pb.exercise in bests ? bests[pb.exercise] : []), pb];
    })
    const {t} = useTranslation();
    const getLabel = (pbList: PB[]) => pbList.map((pb) => `${t(pb?.recordType || "")}: ${pb.value?.toString()}`).join(", ");
    return <Dialog open={!!pbs && pbs.length > 0} onClose={onClose}>
        <DialogTitle>{t("newPbs")}</DialogTitle>
        <List sx={{padding: "16px"}}>
            {Object.keys(bests).map((key) =>
                <ListItemText primary={bests[key][0].exercise}
                              secondary={getLabel(bests[key])}/>)}
        </List>
        <DialogActions>
            <Button onClick={() => onClose()}>{t("ok")}</Button>
        </DialogActions>
    </Dialog>;
}

export default PbsDialog;
