import { api } from "../../api";

export const confirmSell = (sellId, token) => async (dispatch) => {
  dispatch({ type: "SELLS_REQUEST" }); 
  try {
    const res = await api.put(
      `/sells/confirm/${sellId}`,
      {},
    );

    dispatch({
      type: "SELL_CONFIRM_SUCCESS",
      payload: res.data,
    });

    return res.data; 
  } catch (error) {
    dispatch({
      type: "SELLS_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
    throw error; 
  }
};
