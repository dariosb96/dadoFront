import axios from "axios";
const URL_LOCAL = import.meta.env.VITE_URL1;

export const getSellById = (id, token) => async (dispatch )=>{
    dispatch({type: "SELLS_REQUEST"});

    try{
        const res = await axios.get(`${URL_LOCAL}/sells`, {
            headers: {Authorization: `Bearer ${token}`},
        });

        dispatch({
            type: "SELLS_DETAILS_SUCCESS",
            payload: res.data
        });
    }catch(error){
        dispatch({
            type: "SELLS_FAILURE",
            payload:  error.response?.data?.message || error.message,
        })
    }
}