import React, {useState} from "react";
import Layout from "../../components/layout";
import {
    Box,
    CardActionArea,
    CardContent,
    CardMedia,
    Fab,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import YouTubeIcon from '@mui/icons-material/YouTube';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import Parameter from "../../components/parameter";
import SetParameter from "../../components/setParameter";
import {useTranslation} from "react-i18next";

export const Workout = () => {
    const [viewHistory, setViewHistory] = useState(false);
    const {t} = useTranslation();

    function createData(
        delta: string,
        set: number,
        weight: number,
        reps: number,
        rpe: number,
        rir: number,
    ) {
        return {delta, set, weight, reps, rpe, rir};
    }

    const rows = [
        createData("-3D", 1, 60, 12, 8, 2),
        createData("-3D", 2, 60, 12, 8, 2),
        createData("-3D", 3, 60, 12, 8, 2),
        createData("-6D", 1, 55, 12, 8, 2),
        createData("-6D", 2, 55, 12, 8, 2),
        createData("-6D", 3, 55, 12, 8, 2),
        createData("-9D", 1, 55, 12, 8, 2),
        createData("-9D", 2, 55, 12, 8, 2),
        createData("-9D", 3, 55, 12, 8, 2)
    ];

    return <Layout title={"Upper Body 1"} hideNav toolItems={<IconButton
        color="inherit"
        aria-label="menu"
        sx={{mr: 2}}
        href="/youtube"
    >
        <YouTubeIcon/>
    </IconButton>}>
        <Box sx={{height: "100%", display: "flex", flexDirection: "column"}}>
            <Paper variant="outlined">
                <CardActionArea onClick={() => setViewHistory(!viewHistory)}>
                    {!viewHistory && <Box sx={{maxHeight: "235px"}}><CardMedia
                        sx={{height: 140}}
                        image="https://www.inspireusafoundation.org/wp-content/uploads/2022/06/barbell-bench-press-benefits.jpg"
                        title="green iguana"
                    />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Press banca con barra
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Notas del ejercicio
                            </Typography>
                        </CardContent></Box>}
                    {viewHistory &&
                        <TableContainer component={Paper} sx={{flexGrow: 1, maxHeight: "235px"}}>
                            <Table size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>&nbsp;</TableCell>
                                        <TableCell align="right">{t("set")}</TableCell>
                                        <TableCell align="right">{t("weight")}</TableCell>
                                        <TableCell align="right">{t("reps")}</TableCell>
                                        <TableCell align="right">{t("rpe")}</TableCell>
                                        <TableCell align="right">{t("rir")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.delta + "@" + row.set.toString(10)}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.delta}
                                            </TableCell>
                                            <TableCell align="right">{row.set}</TableCell>
                                            <TableCell align="right">{row.weight}</TableCell>
                                            <TableCell align="right">{row.reps}</TableCell>
                                            <TableCell align="right">{row.rpe}</TableCell>
                                            <TableCell align="right">{row.rir}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>}
                </CardActionArea>
            </Paper>
            <SetParameter name={t("set")} value={1} min={1} incrementBy={1}/>
            <Parameter name={t("weight")} unit="kg" value={60} min={0} incrementBy={2.5} allowDecimals/>
            <Parameter name={t("reps")} value={12} min={1} incrementBy={1}/>
            <Parameter name={t("rpe")} value={7} min={0} max={10} incrementBy={1}/>
            <Parameter name={t("rir")} value={2} min={0} incrementBy={1}/>
            <Parameter name={t("rest")} unit="s" value={120} min={0} incrementBy={10}/>
            <Box sx={{flexGrow: 1}}/>
            <Stack direction="row" spacing={{xs: 1, sm: 2, md: 4}} sx={{alignSelf: "center", marginBottom: "24px"}}>
                <Fab color="primary" aria-label="add">
                    <DoneIcon/>
                </Fab>
                <IconButton>
                    <AddIcon/>
                </IconButton>
            </Stack>
        </Box>
    </Layout>;
}