import axios from "axios";

export const GET_PRODUCTS = "GET_PRODUCTS";
const LOCAL = import.meta.env.VITE_URL1;

export const getProducts = (token) => async (dispatch) => {
  dispatch({ type: 'GET_PROD_REQUEST' });

  try {
    const response = await axios.get(`${LOCAL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
       });
    dispatch({ type: 'GET_PROD_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'GET_PROD_FAILURE', payload: error.message });
  }
};