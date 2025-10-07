import axios from "axios";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
const LOCAL_URL= import.meta.env.VITE_URL1;

export const deleteProduct = (id_product, token) => {
    return async (dispatch) => {
        dispatch({type: DELETE_PRODUCT});

        try{
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            };
            await axios.delete(`${LOCAL_URL}/products/${id_product}`, config);
            dispatch({type: DELETE_PRODUCT, payload: id_product});
        }catch(error){
            console.error("Error eliminando producto", error.response?.data || error);
                }
    }
}