import axios from "axios";
import { api } from "../../api";

export const getAllCatalogs = () => async(dispatch) =>{
    try{
        dispatch({type: "CATALOGS_REQUEST"});
        const {data}  = await api.get("/products/catalogs");
        dispatch({type: "CATALOGS_SUCCESS",
            payload: data,
        });
    }catch(error){
        dispatch({

            type: "CATALOGS_FAILURE",
            payload: error.response?.data?.message || error.message,
        })
    }
}