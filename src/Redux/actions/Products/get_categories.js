import { api } from "../../api";
export const GET_CATEGORIES = "GET_CATEGORIES"

export const getCategories = (token) => async (dispatch) =>{
    dispatch({type: 'GET_TYPE_REQUEST'});

    try{
        const response = await api.get("/category");
        dispatch({type: 'GET_CAT_SUCCESS', payload: response.data});
    }catch(error){
        dispatch({type: 'GET_CAT_FAILURE', payload: error.message})
    }
}