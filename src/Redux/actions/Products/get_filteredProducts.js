import { api } from "../../api";

export const GET_FILTERED_PRODUCTS_REQUEST = "GET_FILTERED_PRODUCTS_REQUEST";
export const GET_FILTERED_PRODUCTS_SUCCESS = "GET_FILTERED_PRODUCTS_SUCCESS";
export const GET_FILTERED_PRODUCTS_FAILURE = "GET_FILTERED_PRODUCTS_FAILURE";

export const getFilteredProducts = (filters) => async (dispatch) => {
  dispatch({ type: GET_FILTERED_PRODUCTS_REQUEST });

  try {
    const response = await api.get("/products/filter", { params: filters });
    dispatch({ type: GET_FILTERED_PRODUCTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_FILTERED_PRODUCTS_FAILURE, payload: error.message });
  }
};
