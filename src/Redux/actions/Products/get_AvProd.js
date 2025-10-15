import { api } from "../../api";

export const GET_AVPROD = "GET_AVPROD";

export const getAvProducts = () => async (dispatch) => {
    dispatch({type: "GET_AV_REQUEST"});

    try{
           const response = await api.get(`/products/stock`);
    dispatch({ type: 'GET_AV_SUCCESS', payload: response.data });
    }catch(error){
        dispatch({type: 'GET_AV_FAILURE', payload: error.message});
    }
}
