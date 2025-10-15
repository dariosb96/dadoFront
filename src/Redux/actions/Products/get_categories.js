import { api } from "../../api";

export const GET_CAT_REQUEST = "GET_CAT_REQUEST";
export const GET_CAT_SUCCESS = "GET_CAT_SUCCESS";
export const GET_CAT_FAILURE = "GET_CAT_FAILURE";

export const getCategories = (token) => async (dispatch) => {
  dispatch({ type: GET_CAT_REQUEST });

  try {
    const response = await api.get("/category/all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: GET_CAT_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    dispatch({ type: GET_CAT_FAILURE, payload: error.message });
  }
};
