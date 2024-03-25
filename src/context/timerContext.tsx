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
import React, {ReactElement, useEffect, useState} from "react";

export const TimerContext = React.createContext({
    time: new Date()
} as { time: Date });


export const TimerContextProvider = (props: { children: ReactElement }) => {
    const {children} = props;
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 200);

        return () => clearInterval(interval);
    }, [setTime]);
    return <TimerContext.Provider value={{time}}>
        {children}
    </TimerContext.Provider>
}
