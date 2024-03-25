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
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
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

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    // @ts-ignore
    document.body.style.zoom = 0.99;
});

document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    // @ts-ignore
    document.body.style.zoom = 0.99;
});

document.addEventListener('gestureend', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    // @ts-ignore
    document.body.style.zoom = 0.99;
});
