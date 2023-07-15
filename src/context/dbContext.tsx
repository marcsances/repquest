import {DexieDB} from "../db/db";
import React from "react";

export const DBContext = React.createContext({} as { db?: DexieDB});
