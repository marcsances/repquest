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
const contrastColor = (hex: string) => {
    function cutHex(h: string) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

    const getR = (h: string) => {return parseInt((cutHex(h)).substring(0,2),16)}
    const getG = (h: string) => {return parseInt((cutHex(h)).substring(2,4),16)}
    const getB = (h: string) => {return parseInt((cutHex(h)).substring(4,6),16)}

    const threshold = 130;
    const r = getR(hex);
    const g = getG(hex);
    const b = getB(hex);

    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > threshold ? "#000000" : "#ffffff";
}

export default contrastColor;
