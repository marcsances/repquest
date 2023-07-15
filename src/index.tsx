import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import enJson from "./i18n/en.json";
import caJson from "./i18n/ca.json";
import esJson from "./i18n/es.json";
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: {
                translation: enJson
            },
            ca: {
                translation: caJson
            },
            es: {
                translation: esJson
            }
        },
        fallbackLng: "en",

        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    });
i18n.changeLanguage("es");
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

declare let window: any;
window.addEventListener('beforeinstallprompt', (e: any) => {
    window.deferredPrompt = e;
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
