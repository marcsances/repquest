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
export enum OneRm {
    EPLEY,
    BRZYCKI
}

export const getOneRm = (weight: number, reps: number, formula: OneRm, targetReps?: number) => {
    let oneRm = (formula === OneRm.EPLEY) ? (weight * (1 + reps / 30)) : (weight * (36 / (37 - reps)));
    if (reps === 1) oneRm = weight;
    if (!targetReps || targetReps === 1) return Math.round(oneRm);
    if (formula === OneRm.EPLEY) {
        return Math.round(oneRm / (1 + targetReps / 30));
    } else return Math.round(oneRm / (36 / (37 - targetReps)));
}
