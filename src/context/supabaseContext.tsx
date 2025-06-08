import {createClient, SupabaseClient} from "@supabase/supabase-js";
import React, {createContext, ReactElement, useEffect, useState} from "react";


export interface ISupabaseContext {
    supabase?: SupabaseClient;
    hasSupabase: boolean;
}

export const SupabaseContext = createContext({hasSupabase: false} as ISupabaseContext);

export const SupabaseContextProvider = ({children}: {children: ReactElement}) => {
    const [supabase, setSupabase] = useState<SupabaseClient | undefined>(undefined);

    useEffect(() => {
        if (import.meta.env.VITE_SUPABASE_ENABLED === "true") {
            setSupabase(createClient(import.meta.env.VITE_SUPABASE_CLIENT_ID, import.meta.env.VITE_SUPABASE_CLIENT_KEY));
        }
    }, []);

    return <SupabaseContext.Provider value={{supabase, hasSupabase: supabase !== undefined}}>{children}</SupabaseContext.Provider>;
}
