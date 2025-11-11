import { api } from "../../api";
export const CREATE_SELL_REQUEST = "CREATE_SELL_REQUEST";
export const CREATE_SELL_SUCCESS = "CREATE_SELL_SUCCESS";
export const CREATE_SELL_FAILURE = "CREATE_SELL_FAILURE";

export const createSell = (products) => async (dispatch) => {
  dispatch({ type: CREATE_SELL_REQUEST });

  try {
    const response = await api.post("/sells", { products });

    dispatch({ type: CREATE_SELL_SUCCESS, payload: response.data });
    return response.data; 

  } catch (error) {
    dispatch({
      type: CREATE_SELL_FAILURE,
      payload: error.response?.data?.error || "Error al crear venta",
    });

    throw error; 
  }
};
