import { api } from "../../api";

export const UPDATE_PROD_REQUEST = "UPDATE_PROD_REQUEST";
export const UPDATE_PROD_SUCCESS = "UPDATE_PROD_SUCCESS";
export const UPDATE_PROD_FAILURE = "UPDATE_PROD_FAILURE";


export const updateProduct = (id_product, updatedData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PROD_REQUEST });

    try {
      const response = await api.put(
        `/products/${id_product}`,
        updatedData,        
      );

      dispatch({ type: UPDATE_PROD_SUCCESS, payload: response.data });
    } catch (error) {
  
      dispatch({
        type: UPDATE_PROD_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};
