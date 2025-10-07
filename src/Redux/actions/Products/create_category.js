import { api } from "../../api";

export const CREATE_CATEGORY_REQUEST = "CREATE_CATEGORY_REQUEST";
export const CREATE_CATEGORY_SUCCESS = "CREATE_CATEGORY_SUCCESS";
export const CREATE_CATEGORY_FAILURE = "CREATE_CATEGORY_FAILURE";

export const createCategory = (name, token) => async (dispatch) => {
  dispatch({ type: CREATE_CATEGORY_REQUEST });

  try {
    const response = await api.post(
      "/category",
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: response.data });
    return response.data; // para obtener el ID en el componente
  } catch (error) {
    dispatch({ type: CREATE_CATEGORY_FAILURE, payload: error.message });
    throw error;
  }
};
