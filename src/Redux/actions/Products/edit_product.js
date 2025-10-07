import axios from "axios";

export const UPDATE_PROD_REQUEST = "UPDATE_PROD_REQUEST";
export const UPDATE_PROD_SUCCESS = "UPDATE_PROD_SUCCESS";
export const UPDATE_PROD_FAILURE = "UPDATE_PROD_FAILURE";

const LOCAL_URL = import.meta.env.VITE_URL1;

export const updateProduct = (id_product, updatedData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PROD_REQUEST });

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${LOCAL_URL}/products/${id_product}`,
        updatedData,
        config
      );

      dispatch({ type: UPDATE_PROD_SUCCESS, payload: response.data });
    } catch (error) {
      console.error("Error actualizando producto", error.response?.data || error);
      dispatch({
        type: UPDATE_PROD_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};
