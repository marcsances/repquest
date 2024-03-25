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
import * as Sentry from "@sentry/react";
import {Button, Container, createTheme, CssBaseline, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({hasError: true, error, errorInfo});
        if (localStorage.getItem("disable_telemetry") !== "true") {
            Sentry.captureException(error);
        }
        console.error(error);
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <CssBaseline><Stack direction="column"><Container><Typography variant="h5" component="h5"
                                                                                 sx={{color: "white"}}>Something went
                wrong.</Typography><br/><Typography
                sx={{color: "white"}}>{this.state.error ? this.state.error.toString() : ""}</Typography>
                {localStorage.getItem("disable_telemetry") !== "true" ? <Typography sx={{color: "white"}}>This error has been logged. If you are offline it will be sent to us when you go back online.</Typography> : <Typography>You have telemetry disabled and this error will not be reported. We encourage you to enable telemetry if this error keeps happening to you so we are reported. You can enable telemetry in the app settings.</Typography>} <Button
                onClick={() => window.location.href = window.location.origin} type="button">Reload</Button></Container></Stack></CssBaseline>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
