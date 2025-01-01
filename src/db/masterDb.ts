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
import Dexie, {Table} from 'dexie';
import {User} from "../models/user";

export class MasterDB extends Dexie {
    user!: Table<User>;
    constructor() {
        super('system');
        this.version(1).stores({
            user: "++name"
        });
    }
}

export const masterDb = new MasterDB();
