import {AudioContext} from "standardized-audio-context";

const playBeep = (audioContext: AudioContext, frequency: number, time: number) => {
    try {
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.value = frequency;
        oscillator.connect(audioContext.destination);
        oscillator.start();
        setTimeout(function () {
            oscillator.stop();
        }, time);
    } finally {}
}

export default playBeep;
