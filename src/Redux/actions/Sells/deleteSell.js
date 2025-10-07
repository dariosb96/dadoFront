import { api } from "../../api";

export const DELETE_SELL_REQUEST = "DELETE_SELL_REQUEST";
export const DELETE_SELL_SUCCESS = "DELETE_SELL_SUCCESS";
export const DELETE_SELL_FAILURE = "DELETE_SELL_FAILURE";

export const deleteSell = (id_sell) => async (dispatch) => {
  dispatch({ type: DELETE_SELL_REQUEST });

  try {
    const response = await api.delete(`/sells/${id_sell}`);

    dispatch({
      type: DELETE_SELL_SUCCESS,
      payload: id_sell, 
    });

    return response.data;

  } catch (error) {
    dispatch({
      type: DELETE_SELL_FAILURE,
      payload: error.response?.data?.error || "Error al eliminar venta",
    });

    throw error;
  }
};
