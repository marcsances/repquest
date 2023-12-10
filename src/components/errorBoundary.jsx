import React from "react";
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
        console.error(error);
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <CssBaseline><Stack direction="column"><Container><Typography variant="h5" component="h5"
                                                                                 sx={{color: "white"}}>Something went
                wrong.</Typography><Typography
                sx={{color: "white"}}>{this.state.error ? this.state.error.toString() : ""}</Typography> <Button
                onClick={() => window.location.href = window.location.origin} type="button">Reload</Button></Container></Stack></CssBaseline>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
