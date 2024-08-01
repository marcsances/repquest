import {useTranslation} from "react-i18next";
import Layout from "../../components/layout";
import React, {useContext, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Paper,
    Slide,
    Snackbar,
    useMediaQuery
} from "@mui/material";
import {DateCalendar, PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import {Add, ArrowBack, ArrowForward, ExpandMore, QrCodeScanner, Today} from "@mui/icons-material";
import dayjs, {Dayjs} from "dayjs";
import {DBContext} from "../../context/dbContext";
import {SettingsContext} from "../../context/settingsContext";
import {HistoryEntry} from "../../models/history";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import BarcodeScanner from "../../components/barcodeScanner";

function ServerDay(props: PickersDayProps<Dayjs> & { daysWithEntries?: number[] }) {
    const { daysWithEntries = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
        !props.outsideCurrentMonth && daysWithEntries.includes(props.day.startOf("day").toDate().getTime());

    return (
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} sx={{backgroundColor: (theme) => isSelected ? theme.palette.success.main : undefined, color: isSelected ? "black" : undefined}} />
    );
}

const NutritionHome = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {db} = useContext(DBContext);
    const {useLbs} = useContext(SettingsContext);
    const [showCalendar, setShowCalendar] = useState(false);
    const [ date, setDate ] = useState(dayjs(new Date()));
    const [ history, setHistory ] = useState<HistoryEntry[]>([]);
    const [ daysWithEntries, setDaysWithEntries ] = useState<number[]>([]);
    const [ barcodeScannerOpen, setBarcodeScannerOpen ] = useState(false);
    const [ snackbar, setSnackbar] = useState<string>("");
    const [ mealId, setMealId ] = useState("");
    const [loading, setLoading ] = useState(false);
    const portrait = (window.screen.orientation.angle % 180 === 0);
    const isMini = portrait ?  useMediaQuery('(max-height:600px)') : useMediaQuery('(max-width:600px)');
    const meals = [{
        id: "breakfast",
        name: t("nutrition.times.breakfast"),
        time: "07:00"
    }, {
        id: "morning",
        name: t("nutrition.times.morning"),
        time: "11:00"
    }, {
        id: "lunch",
        name: t("nutrition.times.lunch"),
        time: "13:00"
    }, {
        id: "afternoon",
        name: t("nutrition.times.afternoon"),
        time: "17:00"
    }, {
        id: "dinner",
        name: t("nutrition.times.dinner"),
        time: "21:00"
    }, {
        id: "snack",
        name: t("nutrition.times.snack")
    }
    ];

    const prevDay = () => {
        setDate(dayjs(date).startOf("day").subtract(1, 'days'));
    }

    const nextDay = () => {
        setDate(dayjs(date).startOf("day").add(1, 'days'));
    }

    const scanCode = (mealId: string) => {
        setMealId(mealId);
        setBarcodeScannerOpen(true);
    }

    return <Layout showAccountMenu title={t("nutrition.title")} hideBack
                   toolItems={<IconButton color="inherit"
                                          onClick={() => setDate(dayjs(new Date()))}><Today/></IconButton>}>
        <Box sx={{display: "flex", flexDirection: "column", paddingTop: "8px", paddingLeft: "8px", paddingRight: "8px", width: "100%", height: "calc(100% - 64px)"}}>
        <Slide direction="down" in={showCalendar} mountOnEnter unmountOnExit style={{height: "100%", minHeight: "340px", overflowY: "auto"}}>
            <DateCalendar views={["day"]} value={date} onChange={(d) => {
                setDate(d);
                setShowCalendar(false)
            }}
                          slots={{
                              day: ServerDay,
                          }}
                          slotProps={{
                              day: {
                                  daysWithEntries,
                              } as any,
                          }}/>
        </Slide>
        <ButtonGroup sx={{width: "calc(100% - 16px)", height: "32px", display: "flex", flex: "0 1 auto"}}
                     variant="contained" aria-label="Basic button group">
            <Button sx={{flexShrink: 1, height: "32px"}} onClick={() => prevDay()}><ArrowBack/></Button>
            <Button sx={{flexGrow: 1, height: "32px"}} variant={showCalendar ? "outlined" : "contained"}
                    onClick={() => setShowCalendar((prev) => !prev)}>{date.format("L")}</Button>
            <Button sx={{flexShrink: 1, height: "32px"}} onClick={() => nextDay()}><ArrowForward/></Button>
        </ButtonGroup>

        <Box sx={{
            width: 'calc(100% - 16px)',
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden"
        }}>
            {meals.map((meal) => <Box key={meal.id} sx={{width: "100%", flexShrink: 1}}>
                <Accordion square defaultExpanded disableGutters sx={{width: "100%"}}>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <Box sx={{display: "flex", flexGrow: 1, flexDirection: "column"}}>
                            <Typography sx={{
                                flexGrow: 1,
                                placeSelf: "center",
                                alignSelf: "start",
                                alignContent: "center",
                                fontWeight: 600
                            }}>{meal.name}</Typography>
                            {meal.time && <Typography
                                sx={{flexGrow: 1, placeSelf: "center", alignSelf: "start"}}>{meal.time}</Typography>}
                        </Box>
                        <IconButton onClick={() => scanCode(meal.id)}><QrCodeScanner/></IconButton>
                        <IconButton><Add/></IconButton>
                    </AccordionSummary>
                    <AccordionDetails>
                        Test
                    </AccordionDetails>
                </Accordion>
            </Box>)}
        </Box>
        <Dialog
            open={barcodeScannerOpen}
            onClose={() => setBarcodeScannerOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {t("nutrition.scanCode")}
            </DialogTitle>
            <DialogContent>
                <BarcodeScanner onScan={(code: string) => {
                    navigate("/nutrition/add/ " + mealId + "/" + code);
                    setBarcodeScannerOpen(false);
                }} onError={() => {
                    setSnackbar(t("nutrition.cameraError"));
                    setBarcodeScannerOpen(false);
                }} />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {
                    setBarcodeScannerOpen(false);
                }}>{t("cancel")}</Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
            <Paper variant="outlined" sx={{ flex: "0 1 auto", width: "calc(100% - 24px)", gap: "8px", marginBottom: "8px", padding: "4px", display: "flex", overflowX: "auto", flexDirection: "row"}}>
                <Box sx={{ display: "flex", flex: "1 1 0", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                    <Typography>{t("nutrition.macros.calories")}</Typography>
                    <LinearProgress variant="determinate" color="info" value={40} sx={{ width: "100%"}}/>
                    <Typography>400 / 2400</Typography>
                </Box>
                <Box sx={{ display: "flex", flex: "1 1 0", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                    <Typography>{t("nutrition.macros.fats")}</Typography>
                    <LinearProgress variant="determinate" color="warning" value={40} sx={{ width: "100%"}}/>
                    <Typography>40 / 80</Typography>
                </Box>
                <Box sx={{ display: "flex", flex: "1 1 0", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                    <Typography>{t("nutrition.macros.protein")}</Typography>
                    <LinearProgress variant="determinate" color="error" value={40} sx={{ width: "100%"}}/>
                    <Typography>40 / 120</Typography>
                </Box>
                <Box sx={{ display: "flex", flex: "1 1 0", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                    <Typography>{t("nutrition.macros.carbs")}</Typography>
                    <LinearProgress variant="determinate" color="success" value={40} sx={{ width: "100%"}}/>
                    <Typography>220 / 300</Typography>
                </Box>
            </Paper>
        </Box>
    </Layout>
}

export default NutritionHome
