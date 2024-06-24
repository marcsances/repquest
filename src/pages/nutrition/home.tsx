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
// @ts-ignore
import Quagga from 'quagga';
import defer from "../../utils/defer";

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

    const {db} = useContext(DBContext);
    const {useLbs} = useContext(SettingsContext);
    const [showCalendar, setShowCalendar] = useState(false);
    const [ date, setDate ] = useState(dayjs(new Date()));
    const [ history, setHistory ] = useState<HistoryEntry[]>([]);
    const [ daysWithEntries, setDaysWithEntries ] = useState<number[]>([]);
    const [ barcodeScannerOpen, setBarcodeScannerOpen ] = useState(false);
    const [ barcodeDetections, setBarcodeDetections] = useState<Record<string, number>>({});
    const [ snackbar, setSnackbar] = useState<string>("");
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
        setBarcodeScannerOpen(true);
        defer(() => {
            Quagga.init({
                inputStream : {
                    name : "Live",
                    type : "LiveStream",
                    target: '#stream'
                } as any,
                constraints: {
                    width: 200,
                    height: 200,
                    facingMode: "environment"
                },
                decoder : {
                    readers : ["ean_reader", "upc_reader"]
                },
            }, (err: Error) => {
                if (err) {
                    setSnackbar("nutrition.cameraError")
                    return
                }
                setBarcodeDetections({});
                Quagga.onDetected((data: any) => {
                    const code = data.codeResult.code;
                    setBarcodeDetections((prevDetections) => {
                        if (code in prevDetections && prevDetections[code] >= 5) {
                            setBarcodeScannerOpen(false);
                            Quagga.stop();
                            return {};
                        }
                        prevDetections[code] = code in prevDetections ? prevDetections[code] + 1 : 1;
                        return prevDetections;
                    })
                });
                Quagga.start();
            });
        })
    }

    return <Layout showAccountMenu title={t("nutrition.title")} hideBack
                   sx={{paddingTop: "8px", paddingLeft: "8px", paddingRight: "8px"}}
                   toolItems={<IconButton color="inherit"
                                          onClick={() => setDate(dayjs(new Date()))}><Today/></IconButton>}>
        <Slide direction="down" in={showCalendar} mountOnEnter unmountOnExit style={{flexGrow: 1}}>
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
        <ButtonGroup sx={{width: "calc(100% - 16px)", height: "32px", display: "flex", flexShrink: 1}}
                     variant="contained" aria-label="Basic button group">
            <Button sx={{flexShrink: 1, height: "32px"}} onClick={() => prevDay()}><ArrowBack/></Button>
            <Button sx={{flexGrow: 1, height: "32px"}} variant={showCalendar ? "outlined" : "contained"}
                    onClick={() => setShowCalendar((prev) => !prev)}>{date.format("L")}</Button>
            <Button sx={{flexShrink: 1, height: "32px"}} onClick={() => nextDay()}><ArrowForward/></Button>
        </ButtonGroup>

        <Box sx={{
            width: '100%',
            height: 'calc(100% - 64px)',
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
                <div id="stream" style={{display: "block", overflow: "hidden"}}>
                    <video src="" style={{height: "100%", width: "100%"}}></video>
                    <canvas className="drawingBuffer" style={{ display: "none"}}></canvas>
                </div>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {
                    setBarcodeScannerOpen(false);
                    Quagga.stop();
                }}>{t("cancel")}</Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            open={snackbar !== ""}
            autoHideDuration={2000}
            onClose={() => setSnackbar("")}
            message={snackbar}
        />
    </Layout>
}

export default NutritionHome
