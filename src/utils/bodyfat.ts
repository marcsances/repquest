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

export const UsNavy = (useLbs: boolean, gender: string, height: number, neck: number, waist: number, hip: number) => {
    let result = 0;
    if (useLbs) {
        if (gender === "male") {
            result = (86.010 * Math.log10(waist - neck)) - (70.041 * Math.log10(height)) + 36.76;
        } else result = (163.205 * Math.log10(waist + hip - neck)) - (97.684 * Math.log10(height)) + 78.387;
    } else if (gender === "male") {
        result = (495 / (1.0324 - (0.19077 * Math.log10(waist - neck)) + (0.15456 * Math.log10(height)))) - 450;
    } else {
        result = (495 / (1.29579 - (0.35004 * Math.log10(waist + hip - neck)) + (0.22100 * Math.log10(height)))) - 450;
    }
    return Math.floor(result * 100) / 100;
}

export const BMI = (useLbs: boolean, height: number, weight: number) => {
    const result = useLbs ? (703 * (weight / Math.pow(height / 100, 2))) : (weight / Math.pow(height / 100, 2));
    return Math.floor(result * 100) / 100;
}

export const BMIBodyFat = (useLbs: boolean, gender: string, age: number, height: number, weight: number) => {
    if (gender === "male" && age > 18) {
        const result = age > 18 ? (1.2 * BMI(useLbs, height, weight)) + (0.23 * age) - 16.2 : (1.51 * BMI(useLbs, height, weight)) + (0.7 * age) - 2.2;
        return Math.floor(result*100)/100;
    }
    const result = age > 18 ? (1.2 * BMI(useLbs, height, weight)) + (0.23 * age) - 5.4 : (1.51 * BMI(useLbs, height, weight)) + (0.7 * age) + 1.4;
    return Math.floor(result*100)/100;
}
