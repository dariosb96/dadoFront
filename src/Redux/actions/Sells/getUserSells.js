import { api } from "../../api";

export const GET_SELLS_REQUEST = "SELLS_REQUEST";
export const GET_SELLS_SUCCESS = "SELLS_SUCCESS";
export const GET_SELLS_FAILURE = "SELLS_FAILURE";

export const getUserSells = () => async (dispatch) => {
  dispatch({ type: GET_SELLS_REQUEST });

  try {
    const response = await api.get("/sells"); 
    dispatch({
      type: GET_SELLS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_SELLS_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};
