import { api } from "../../api";
export const DELETE_PRODUCT = "DELETE_PRODUCT";

export const deleteProduct = (id_product, token) => {
    return async (dispatch) => {
        dispatch({type: DELETE_PRODUCT});

        try{            
            await api.delete(`$/products/${id_product}`);
            dispatch({type: DELETE_PRODUCT, payload: id_product});
        }catch(error){
            return ({error: error.message});
        }
    }
}