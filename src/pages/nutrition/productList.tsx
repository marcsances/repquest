import {useParams} from "react-router-dom";
import Layout from "../../components/layout";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Box, InputAdornment, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Clear} from "@mui/icons-material";

const ProductList = () => {
    const { mealId, search: searchParam } = useParams();
    const {t} = useTranslation();
    const [search, setSearch] = useState(searchParam || "");
    return <Layout title={t("nutrition.times.breakfast")} hideNav><Box sx={{ padding: "16px"}}>
        <TextField sx={{ width: "100%"}} variant="standard" value={search} onChange={() => setSearch(search)} InputProps={{
            endAdornment: <InputAdornment position="end"><IconButton
                onClick={() => setSearch("")}><Clear/></IconButton></InputAdornment>
        }}/>
    </Box></Layout>
}

export default ProductList;
