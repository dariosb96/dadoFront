import axios from "axios";
export const GET_AVPROD = "GET_AVPROD";
const LOCAL = import.meta.env.VITE_URL1;

export const getAvProducts = () => async (dispatch) => {
    dispatch({type: "GET_AV_REQUEST"});

    try{
           const response = await axios.get(`${LOCAL}/products/stock`);
             console.log('Respuesta del backend:', response.data); 
    dispatch({ type: 'GET_AV_SUCCESS', payload: response.data });
    }catch(error){
        dispatch({type: 'GET_AV_FAILURE', payload: error.message});
    }
}
