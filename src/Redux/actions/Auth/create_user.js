export const CREATE_USER = "CREATE_USER";
import { api } from "../../api";

export const createUser = (userData) => {
    return async dispatch => {
        dispatch ({type: CREATE_USER});

        try{
            const response = await api.post("/user", userData);
            
            dispatch({type: CREATE_USER, payload: response.data});
        }catch(error){
            return ({error: error.message});
        }
    }
}
