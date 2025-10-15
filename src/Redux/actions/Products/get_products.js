import { api } from "../../api";

export const GET_PRODUCTS = "GET_PRODUCTS";
export const getProducts = (token) => async (dispatch) => {
  dispatch({ type: 'GET_PROD_REQUEST' });

  try {
    const response = await api.get(`/products`,);
    dispatch({ type: 'GET_PROD_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'GET_PROD_FAILURE', payload: error.message });
  }
};