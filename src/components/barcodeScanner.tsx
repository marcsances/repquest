import React, {CSSProperties, useCallback, useEffect, useState} from "react";
// @ts-ignore
import Quagga from 'quagga';
import {debounce} from "@mui/material";

interface BarcodeScannerProps {
    onScan: (code: string) => void;
    onError?: (error: Error) => void;
    sx?: CSSProperties;
    threshold?: number;
}

const BarcodeScanner = ({onScan, onError, sx, threshold}: BarcodeScannerProps) => {
    const [ barcodeDetections, setBarcodeDetections] = useState<Record<string, number>>({});
    const onDetected = useCallback((data: any) => {
        const code = data.codeResult.code;
        setBarcodeDetections((prevDetections) => {
            if (code in prevDetections && prevDetections[code] >= (threshold || 5)) {
                onScan(code);
                return {};
            }
            prevDetections[code] = code in prevDetections ? prevDetections[code] + 1 : 1;
            return prevDetections;
        })
    },[setBarcodeDetections, threshold, onScan]);
    const startQuagga = debounce(() => {
        console.log("START");
        Quagga.init({
            inputStream : {
                name : "Live",
                type : "LiveStream",
                target: "#quagga"
            } as any,
            decoder : {
                readers : ["ean_reader", "upc_reader"]
            },
        }, (err: Error | undefined) => {
            if (err) {
                if (onError) onError(err);
                return;
            }
            Quagga.onDetected(onDetected);
            Quagga.start();
        });
    }, 500);
    const stopQuagga = debounce(() => {
        console.log("STOP");
        Quagga.stop();
    }, 500)
    useEffect(() => {
        startQuagga();
        return stopQuagga;
    }, []);
    return <div id="quagga" style={{display: "block", overflow: "hidden", ...sx}}>
        <video src="" style={{height: "100%", width: "100%"}}></video>
        <canvas className="drawingBuffer" style={{display: "none"}}></canvas>
    </div>
}

export default BarcodeScanner;
