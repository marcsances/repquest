import Layout from "../../components/layout";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Metric, UserMetric} from "../../models/user";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogTitle,
    Fab,
    FormControlLabel,
    NativeSelect,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import Parameter from "../../components/parameter";
import {Calculate, Man, Save, Woman} from "@mui/icons-material";
import {DBContext} from "../../context/dbContext";
import {compareWithDate} from "../../utils/comparators";
import dayjs from "dayjs";
import {LineChart} from "@mui/x-charts";
import {SettingsContext} from "../../context/settingsContext";
import Typography from "@mui/material/Typography";
import getId from "../../utils/id";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {DateCalendar} from "@mui/x-date-pickers";
import {BMI, BMIBodyFat, UsNavy} from "../../utils/bodyfat";
import defer from "../../utils/defer";

const MetricsPage = () => {
    const {t} = useTranslation();
    const {db} = useContext(DBContext);
    const [ metric, setMetric ] = useState<Metric>(Metric.BODYWEIGHT);
    const [ metricHistory, setMetricHistory ] = useState<UserMetric[]>([]);
    const [currentSlice, setCurrentSlice] = useState(20);
    const { useLbs } = useContext(SettingsContext);
    const [newVal, setNewVal] = useState(metricHistory.length > 0 ? metricHistory[0].value : 0);
    const [newHeight, setNewHeight] = useState(0);
    const [newWeight, setNewWeight] = useState(0);
    const [newNeck, setNewNeck] = useState(0);
    const [newWaist, setNewWaist] = useState(0);
    const [newHip, setNewHip] = useState(0);
    const [age, setAge] = useState<number>(20);
    const [refetch, setRefetch] = useState<Date>(new Date());
    const [snackbar, setSnackbar] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [period, setPeriod] = useState<string>("allTime");
    const [pickerOpen, setPickerOpen] = useState(false);
    const [calculatorOpen, setCalculatorOpen] = useState(false);
    const [gender, setGender] = useState("male");
    const [result, setResult] = useState<number | undefined>(undefined);
    const [saveOnQuit, setSaveOnQuit ] = useState(true);
    const [bodyFatMethod, setBodyFatMethod] = useState<"usnavy" | "bmi">("usnavy");
    useEffect(() => {(async () => {
        if (!db) return;
        setMetricHistory((await db.userMetric
            .where("metric").equals(metric).toArray()
        ).filter((it) => !startDate || !endDate || it.date.getTime() >= startDate.getTime() && it.date.getTime() < endDate.getTime()).sort(compareWithDate).reverse());
        if (metric === "body_fat" || metric === "bmi") {
            setNewHeight((await db.userMetric.where("metric").equals("height").toArray()).sort(compareWithDate).reverse()[0]?.value || 0);
            setNewWeight((await db.userMetric.where("metric").equals("body_weight").toArray()).sort(compareWithDate).reverse()[0]?.value || 0);
            setNewNeck((await db.userMetric.where("metric").equals("neck").toArray()).sort(compareWithDate).reverse()[0]?.value || 0);
            setNewWaist((await db.userMetric.where("metric").equals("waist").toArray()).sort(compareWithDate).reverse()[0]?.value || 0);
            setNewHip((await db.userMetric.where("metric").equals("hip").toArray()).sort(compareWithDate).reverse()[0]?.value || 0);
        }
    })()}, [metric, refetch, period, startDate, endDate]);

    useEffect(() => {
        setCurrentSlice(20);
        setNewVal(metricHistory.length > 0 ? metricHistory[0].value : 0);
    }, [metricHistory, setCurrentSlice]);

    const save = () => {
        db?.userMetric.put({
            id: getId(),
            metric,
            value: newVal,
            date: new Date()
        }).then(() => {
            setRefetch(new Date());
            setSnackbar(t("saved"));
        })
    }

    const units: Record<Metric, string | undefined> = {
        [Metric.BODYWEIGHT]: useLbs ? "lbs" : "kg",
        [Metric.HEIGHT]: useLbs ? "in" : "cm",
        [Metric.BODYFAT]: "%",
        [Metric.CHEST]: useLbs ? "in" : "cm",
        [Metric.LEFT_ARM]: useLbs ? "in" : "cm",
        [Metric.RIGHT_ARM]: useLbs ? "in" : "cm",
        [Metric.LEFT_THIGH]: useLbs ? "in" : "cm",
        [Metric.RIGHT_THIGH]: useLbs ? "in" : "cm",
        [Metric.WAIST]: useLbs ? "in" : "cm",
        [Metric.NECK]: useLbs ? "in" : "cm",
        [Metric.HIP]: useLbs ? "in" : "cm",
        [Metric.BMI]: undefined,
    }

    const increments: Record<Metric, number[]> = {
        [Metric.BODYWEIGHT]: [1, 2.5, 5, 10, 0.5],
        [Metric.HEIGHT]: [0.1, 0.5, 1, 5, 10],
        [Metric.BODYFAT]: [0.1, 0.5, 1],
        [Metric.CHEST]: [0.1, 0.5, 1],
        [Metric.LEFT_ARM]: [0.1, 0.5, 1],
        [Metric.RIGHT_ARM]: [0.1, 0.5, 1],
        [Metric.LEFT_THIGH]: [0.1, 0.5, 1],
        [Metric.RIGHT_THIGH]: [0.1, 0.5, 1],
        [Metric.WAIST]: [1, 0.5, 0.1, 5],
        [Metric.HIP]: [1, 0.5, 0.1, 5],
        [Metric.NECK]: [0.1, 0.5, 1],
        [Metric.BMI]: [0.1, 0.5, 1]
    }

    useEffect(() => {
        if (metric == "body_fat" && bodyFatMethod === "usnavy" && newWaist && newNeck && newWeight && newHeight && (gender === "male" || newHip)) {
            setResult(UsNavy(useLbs, gender, newHeight, newNeck, newWaist, newHip));
        } else if (metric === "body_fat" && bodyFatMethod === "bmi" && newWeight && newHeight && age) {
            setResult(BMIBodyFat(useLbs, gender, age, newHeight, newWeight));
        } else if (metric === "bmi" && newHeight && newWeight) {
            setResult(BMI(useLbs, newHeight, newWeight))
        } else {
            setResult(undefined);
        }
    }, [metric, age, bodyFatMethod, newWeight, newHeight, newNeck, newWaist, newHip, gender]);

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

    const calculate = async () => {
        if (!result) return;
        setCalculatorOpen(false);
        setNewVal(result);
        if (saveOnQuit && db) {
            if (newHeight) {
                await db.userMetric.put({
                    id: getId(),
                    metric: Metric.HEIGHT,
                    value: newHeight,
                    date: new Date()
                });
            }
            if (newWeight) {
                await db.userMetric.put({
                    id: getId(),
                    metric: Metric.BODYWEIGHT,
                    value: newWeight,
                    date: new Date()
                });
            }
            if (newWaist) {
                await db.userMetric.put({
                    id: getId(),
                    metric: Metric.WAIST,
                    value: newWaist,
                    date: new Date()
                });
            }
            if (newNeck) {
                await db.userMetric.put({
                    id: getId(),
                    metric: Metric.NECK,
                    value: newNeck,
                    date: new Date()
                });
            }
            if (newHip) {
                await db.userMetric.put({
                    id: getId(),
                    metric: Metric.HIP,
                    value: newHeight,
                    date: new Date()
                });
            }
            defer(() => { save() });
        }
    }

    return <Layout hideNav title={t('metrics.title')} sx={{padding: "20px", width: "calc(100vw - 30px)", height: "calc(100vh - 30px)"}}>
        <Box sx={{height: "calc(100% - 16px)", display: "flex", flexDirection: "column"}}>
        <NativeSelect
            value={metric}
            onChange={(e) => setMetric(e.target.value as unknown as Metric)}
            sx={{ width: "calc(100vw - 40px)", marginBottom: "20px" }}
        >
            {Object.values(Metric).map((k, idx) => <option key={k} value={k}>
                {t(`metrics.${k}`)}
            </option>)}
        </NativeSelect>
        <NativeSelect
            value={period}
            onChange={(e) => onSelectPeriod(e.target.value)}
            sx={{  width: "calc(100vw - 40px)", marginBottom: "20px" }}
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
        <Paper variant="outlined">
            <TableContainer component={Paper} sx={{flexGrow: 1, maxHeight: "20vh"}}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{width: "16px", padding: "4px"}}>{t("date")}</TableCell>
                            <TableCell align="center" sx={{padding: "4px"}}>{t("metrics.value")}</TableCell>
                            <TableCell align="right" sx={{width: "16px", padding: "4px"}}>&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {metricHistory.slice(0, currentSlice).map((metric: UserMetric) =>
                            <TableRow
                                key={metric.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell sx={{padding: "4px"}} component="th" scope="row">
                                    {metric.date ? metric.date.getDate().toString(10).padStart(2, "0") + "/" + (metric.date.getMonth() + 1).toString(10).padStart(2, "0") : ""}
                                </TableCell>
                                <TableCell
                                    sx={{padding: "4px"}} align="center">{metric.value}</TableCell>
                                <TableCell align="center"  sx={{whiteSpace: "nowrap", padding: "4px"}} >
                                    <IconButton size="small" sx={{padding: "1px"}} onClick={(e) => {
                                        e.stopPropagation();
                                        db?.userMetric.delete(metric.id).then(() => {
                                            setSnackbar("OK");
                                            setRefetch(new Date());
                                        })
                                    }}><DeleteIcon fontSize="small"/></IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                        {metricHistory && metricHistory.length > currentSlice && <TableRow onClick={() => setCurrentSlice((prevSlice) => prevSlice + 20)}><TableCell  sx={{textAlign: "center"}} colSpan={7}>{t("loadMore")}</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>

        </Paper>
            <Snackbar
                open={snackbar !== ""}
                autoHideDuration={2000}
                onClose={() => setSnackbar("")}
                message={snackbar}
            />
            <Box sx={{overflow: "auto", flexShrink: 1, position: "relative", width: "100vw", height: "100%"}}>
                {metricHistory.length > 0 ? <LineChart
                    xAxis={[{dataKey: 'date', scaleType: 'band', valueFormatter: (v) => dayjs(v).format("DD/MM/YY")}]}
                    series={[{dataKey: 'value', showMark: false}]}
                    dataset={metricHistory as {date: Date, value: number}[]}
                /> : <Typography>{t("noHistoryEntries")}</Typography>}
            </Box>
            <Box sx={{flexGrow: 1}}/>
            <Parameter name={t(`metrics.${metric}`)} unit={units[metric]} value={newVal} increments={increments[metric]} min={0} allowDecimals onChange={(val) => setNewVal(val)} />

            <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}} sx={{alignSelf: "center", marginTop: "10px"}}>

            <Fab color="success" size="large" aria-label="add" onClick={save}>
                <Save/>
            </Fab>
                {["body_fat", "bmi"].includes(metric) && <Fab color="primary" size="large" aria-label="add" onClick={() => { setCalculatorOpen(true)}}>
                    <Calculate/>
                </Fab>}
            </Stack>
        </Box>
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
        {calculatorOpen && <Dialog open>
            <DialogTitle>{t("metrics.calculator", {metric: t(`metrics.${metric}`)})}</DialogTitle>
            {metric === "body_fat" && <><Stack direction="row" sx={{marginBottom: '16px'}}>
                <Typography sx={{ placeSelf: 'center', marginLeft: '8px', marginRight: '16px'}}>{t("metrics.formula")}</Typography>
                <NativeSelect sx={{flexGrow: 1, marginRight: '16px'}} value={bodyFatMethod} onChange={(e) => setBodyFatMethod(e.target.value as "usnavy" | "bmi")}><option value="usnavy">US Navy</option><option value="bmi">{t("metrics.bmiEstimation")}</option></NativeSelect>
            </Stack>
            <ToggleButtonGroup sx={{placeSelf: 'center'}} exclusive value={gender} onChange={(ev, newVal) => setGender(newVal)}>
                <ToggleButton value="male"><Man/></ToggleButton>
                <ToggleButton value="female"><Woman/></ToggleButton>
            </ToggleButtonGroup>
            </>}
            <Parameter name={t(`metrics.height`)} unit={units["height"]} value={newHeight || 0} increments={increments["height"]} min={0} allowDecimals onChange={(val) => setNewHeight(val)} />
            {(metric === "bmi" || bodyFatMethod === "bmi") && <Parameter name={t(`metrics.body_weight`)} unit={units["body_weight"]} value={newWeight || 0} increments={increments["body_weight"]} min={0} allowDecimals onChange={(val) => setNewWeight(val)} />}
            { metric === "body_fat" && bodyFatMethod === "usnavy" && <>
                <Parameter name={t(`metrics.neck`)} unit={units["neck"]} value={newNeck || 0} increments={increments["neck"]} min={0} allowDecimals onChange={(val) => setNewNeck(val)} />
                <Parameter error={newWaist && newNeck && newWaist < newNeck ? t("metrics.waistSmaller") : undefined} name={t(`metrics.waist`)} unit={units["waist"]} value={newWaist || 0} increments={increments["waist"]} min={0} allowDecimals onChange={(val) => setNewWaist(val)} />
                {gender === "female" && <Parameter name={t(`metrics.hip`)} unit={units["hip"]} value={newHip || 0} increments={increments["hip"]} min={0} allowDecimals onChange={(val) => setNewHip(val)} />}
            </>}
            { metric === "body_fat" && bodyFatMethod === "bmi" && <>
                <Parameter name={t(`metrics.age`)} unit={t("years")} value={age} min={0} allowDecimals onChange={(val) => setAge(val)} />
            </>}
            {!!result && <Typography sx={{margin: "8px"}}>{`${t("result")}: ${result}${metric === "body_fat" ? "%" : ""}`}</Typography>}
            <FormControlLabel sx={{margin: "8px"}} control={<Checkbox checked={saveOnQuit} onClick={() => setSaveOnQuit((v) => !v)} />} label={t("metrics.saveNewValues")} />
            <DialogActions>
                <Button onClick={() => setCalculatorOpen(false)}>{t("cancel")}</Button>
                <Button onClick={() => calculate()} disabled={!result}>{t("ok")}</Button>
            </DialogActions>
        </Dialog>}
    </Layout>;

}

export default MetricsPage;
