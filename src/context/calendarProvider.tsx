/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
import 'dayjs/locale/ca';
import 'dayjs/locale/es';
import 'dayjs/locale/en';
import {ReactElement, useEffect} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import i18n from "i18next";
import dayjs from "dayjs";

import localizedFormat from "dayjs/plugin/localizedFormat";
import duration from "dayjs/plugin/duration";

dayjs.extend(localizedFormat);
dayjs.extend(duration);

const CalendarProvider = ({children}: {children: ReactElement}) => {
    useEffect(() => { dayjs.locale(i18n.language) }, [i18n.language]);
    return <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language || "en"}>
        {children}
    </LocalizationProvider>
}

export default CalendarProvider;
