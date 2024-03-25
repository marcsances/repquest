import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import {SwapHoriz} from "@mui/icons-material";
import React, {useContext, useEffect, useState} from "react";
import Layout from "../../components/layout";
import {useTranslation} from "react-i18next";
import {Exercise} from "../../models/exercise";
import ExercisePicker from "../workout-editor/exercise_picker";
import {useNavigate} from "react-router-dom";
import {LineChart} from "@mui/x-charts";
import {DBContext} from "../../context/dbContext";
import {compareSetHistoryEntries} from "../../utils/comparators";
import {getOneRm} from "../../utils/oneRm";
import {SettingsContext} from "../../context/settingsContext";
import {ExerciseSet} from "../../models/workout";
import {Box, Button, Dialog, DialogActions, DialogTitle, NativeSelect} from "@mui/material";
import {DateCalendar} from "@mui/x-date-pickers";
import Typography from "@mui/material/Typography";

const StatsPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {oneRm, useLbs} = useContext(SettingsContext);
    const {db} = useContext(DBContext);
    const [exercise, setExercise] = useState<Exercise | undefined>(undefined);
    const [dataset, setDataset] = useState<{x: Date, y: number}[]>([]);
    const [maxVal, setMaxVal] = useState<number>(0);
    const [parameter, setParameter] = useState<string>("oneRm");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [period, setPeriod] = useState<string>("allTime");
    const [pickerOpen, setPickerOpen] = useState(false);
    const getEntry = (set: ExerciseSet) => {
        if (parameter === "oneRm" && set.weight) return getOneRm(set.weight || 0, set.reps || 0, oneRm)
        if (parameter === "volume") return (set.weight || 1) * (set.reps || 1);
        return set.weight;
    }

    const getUnit = () => {
        if (parameter === "weight" || parameter === "oneRm") return useLbs ? " lbs" : " kg";
        return "";
    }

    const onSelectPeriod = (period: string) => {
        switch (period) {
            case "allTime":
                setStartDate(undefined);
                setEndDate(undefined);
                setPeriod(period);
                break;
            case "lastWeek":
                setStartDate(dayjs(new Date()).endOf('day').subtract(7, 'day').toDate());
                setEndDate(dayjs(new Date()).endOf('day').toDate());
                setPeriod(period);
                break;
            case "lastMonth":
                setStartDate(dayjs(new Date()).endOf('day').subtract(1, 'month').toDate());
                setEndDate(dayjs(new Date()).endOf('day').toDate());
                setPeriod(period);
                break;
            case "lastTrimester":
                setStartDate(dayjs(new Date()).endOf('day').subtract(3, 'month').toDate());
                setEndDate(dayjs(new Date()).endOf('day').toDate());
                setPeriod(period);
                break;
            case "lastSemester":
                setStartDate(dayjs(new Date()).endOf('day').subtract(6, 'month').toDate());
                setEndDate(dayjs(new Date()).endOf('day').toDate());
                setPeriod(period);
                break;
            case "lastYear":
                setStartDate(dayjs(new Date()).endOf('day').subtract(12, 'month').toDate());
                setEndDate(dayjs(new Date()).endOf('day').toDate());
                setPeriod(period);
                break;
            case "custom":
            case "custom2":
                setStartDate(undefined);
                setEndDate(undefined);
                setPickerOpen(true);
                break;
        }
    }

    useEffect(() => {(async () => {
        if (!db || !exercise) return;
        if (!db || !exercise) return;
        const allEntries = (await db.exerciseSet
            .where("exerciseId")
            .equals(exercise.id).toArray())
            .sort(compareSetHistoryEntries)
            .reverse();
        const dataset = allEntries
            .filter((set) => (!startDate || !endDate) || (!!set.date &&
                (set.date.getTime() >= startDate.getTime() && set.date.getTime() < endDate.getTime())))
            .map((set) => ({
                    x: set.date || new Date(),
                    y: getEntry(set) || 0
                })
            );
        setDataset(dataset);
        setMaxVal(Math.max(...dataset.map((it) => it.y)));
    })()}, [exercise, db, parameter, period, startDate, endDate])

    return <Layout hideNav title={`${exercise?.name}`} sx={{padding: "20px"}} toolItems={<><IconButton onClick={() => setExercise(undefined)}><SwapHoriz /></IconButton></>}>
        <NativeSelect
            value={parameter}
            onChange={(e) => setParameter(e.target.value)}
            sx={{ overflowX: "scroll", width: "calc(100vw - 40px)", marginBottom: "20px" }}
        >
            <option value="weight">{t("weight")}</option>
            <option value="oneRm">{t("oneRm")}</option>
            <option value="volume">{t("volume")}</option>
        </NativeSelect>
        <NativeSelect
            value={period}
            onChange={(e) => onSelectPeriod(e.target.value)}
            sx={{ overflowX: "scroll", width: "calc(100vw - 40px)", marginBottom: "20px" }}
        >
            <option value="allTime">{startDate && endDate && period === "allTime" ? `${t("period.from")} ${dayjs(startDate).format("DD/MM/YY")} ${t("period.to")} ${dayjs(endDate).format("DD/MM/YY")}` : t("period.allTime")}</option>
            <option value="lastWeek">{startDate && endDate && period === "lastWeek"  ? `${t("period.from")} ${dayjs(startDate).format("DD/MM/YY")} ${t("period.to")} ${dayjs(endDate).format("DD/MM/YY")}` : t("period.lastWeek")}</option>
            <option value="lastMonth">{startDate && endDate && period === "lastMonth"  ? `${t("period.from")} ${dayjs(startDate).format("DD/MM/YY")} ${t("period.to")} ${dayjs(endDate).format("DD/MM/YY")}` : t("period.lastMonth")}</option>
            <option value="lastTrimester">{startDate && endDate && period === "lastTrimester"  ? `${t("period.from")} ${dayjs(startDate).format("DD/MM/YY")} ${t("period.to")} ${dayjs(endDate).format("DD/MM/YY")}` : t("period.lastTrimester")}</option>
            <option value="lastSemester">{startDate && endDate && period === "lastSemester"  ? `${t("period.from")} ${dayjs(startDate).format("DD/MM/YY")} ${t("period.to")} ${dayjs(endDate).format("DD/MM/YY")}` : t("period.lastSemester")}</option>
            <option value="lastYear">{startDate && endDate && period === "lastYear"  ? `${t("period.from")} ${dayjs(startDate).format("DD/MM/YY")} ${t("period.to")} ${dayjs(endDate).format("DD/MM/YY")}` : t("period.lastYear")}</option>
            <option value="custom">{startDate && endDate && period === "custom"  ? `${t("period.from")} ${dayjs(startDate).format("DD/MM/YY")} ${t("period.to")} ${dayjs(endDate).format("DD/MM/YY")}` : t("period.custom")}</option>
            {period === "custom" && <option value="custom2">{t("period.custom")}</option>}
        </NativeSelect>
        <Typography>{t("period.maximum")}: {maxVal}{getUnit()}</Typography>
        {!exercise && <ExercisePicker open onBack={() => { navigate(-1)}} onSelectExercise={(ex) => setExercise(ex)} />}
        {dataset.filter((it) => !!it.y).length > 0 ? <Box sx={{width: "100vw", height: "calc(100vh - 180px)"}}><LineChart
            xAxis={[{dataKey: 'x', scaleType: 'band', valueFormatter: (v) => dayjs(v).format("DD/MM/YY")}]}
            series={[{dataKey: 'y', curve: 'stepAfter', valueFormatter: (v) => `${v}${getUnit()}`, showMark: false, label: t(parameter)}]}
            axisHighlight={{x: 'line', y: 'line'}}
            slotProps={{ legend: { hidden: true } }}
            dataset={dataset}
        /></Box> : <Typography>{t("notApplicableForThis")}</Typography>}
        {pickerOpen && <Dialog open>
            <DialogTitle>{startDate ? t("period.selectEndDate") : t("period.selectStartDate")}</DialogTitle>
            <DateCalendar autoFocus minDate={startDate ? dayjs(startDate) : undefined} maxDate={dayjs()} onChange={(value) => {
                if (startDate) {
                    setEndDate(dayjs(value).toDate());
                    setPickerOpen(false);
                    setPeriod("custom");
                } else {
                    setStartDate(dayjs(value).toDate());
                }
            }}/>
            <DialogActions>
                <Button onClick={() => setPickerOpen(false)}>{t("cancel")}</Button>
            </DialogActions>
        </Dialog>}
    </Layout>

}

export default StatsPage
