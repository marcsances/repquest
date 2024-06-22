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
import Layout from "./layout";
import {useTranslation} from "react-i18next";
import Parameter from "./parameter";
import {getOneRm} from "../utils/oneRm";
import {SettingsContext} from "../context/settingsContext";
import {Card, CardActionArea, CardContent, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import {Check} from "@mui/icons-material";

export interface OneRmCalcProps {
    weight?: number;
    reps?: number;
    onSelect?: (weight: number, reps: number) => void;
    onCancel?: () => void;
}

const OneRmCalculator = (props: OneRmCalcProps) => {
    const {weight, reps, onSelect, onCancel} = props;
    const {t} = useTranslation();
    const {oneRm, useLbs} = useContext(SettingsContext);
    const [curWeight, setCurWeight] = useState<number>(weight || 60);
    const [curReps, setCurReps] = useState<number>(reps || 12);
    const rms = [];
    for (let i = 1; i <= 20; i++) {
        rms.push({reps: i, rm: getOneRm(curWeight, curReps, oneRm, i)});
    }
    return <Layout title={t("oneRmCalculator")} scroll leftToolItems={onCancel ?
        <IconButton color="inherit" sx={{mr: 2}} size="large" edge="start" color="inherit"
                    onClick={onCancel}><CloseIcon/></IconButton> : <></>}
                   toolItems={onSelect ?
                       <IconButton color="inherit" size="large" edge="start" color="inherit"
                                   onClick={() => onSelect(curWeight, curReps)}><Check/></IconButton> : <></>}
                   hideBack={onSelect !== undefined} hideNav>
        <Box sx={{height: "100%", width: "100%"}}>
            <Parameter name={t("weight")} unit={useLbs ? "lbs" : "kg"} value={curWeight || 0} min={0}
                       increments={[2.5, 1.25, 1, 0.5, 5]}
                       allowDecimals onChange={(weight) => {
                setCurWeight(weight)
            }}/>
            <Parameter name={t("reps")} value={curReps || 0} min={1}
                       onChange={(reps) => {
                           setCurReps(reps)
                       }}/>
            <Grid container sx={{display: "flex", placeSelf: "center", alignContent: "center", width: "100%"}}
                  spacing={2} columns={{xs: 4, sm: 8, md: 12}}>
                {rms.map((it) => <Grid item key={it.reps} xs="auto" sx={{placeSelf: "center"}}>
                    <Card variant="outlined" sx={{width: "120px", height: "120px"}}>
                        <CardActionArea onClick={() => {
                            if (onSelect) onSelect(it.rm, it.reps)
                        }}>
                            <CardContent>
                                <Typography sx={{fontSize: 14, textAlign: "center"}} color="text.secondary"
                                            gutterBottom>
                                    {it.reps}RM
                                </Typography>
                                <Typography sx={{textAlign: "center"}} variant="h5" component="div">
                                    {it.rm}
                                </Typography>
                                <Typography sx={{mb: 1.5, textAlign: "center"}} color="text.secondary">
                                    {useLbs ? "lbs" : "kg"}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>)}
            </Grid>
        </Box>
    </Layout>
}

export default OneRmCalculator;
