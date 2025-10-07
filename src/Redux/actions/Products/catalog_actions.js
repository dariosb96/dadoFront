import { api } from "../../api";

export const fetchCatalogByUser = (userId, category = null) => async (dispatch) => {
  try {
    dispatch({ type: "CATALOG_REQUEST" });
    const url = category
      ? `/products/catalogs/${userId}?category=${category}`
      : `/products/catalogs/${userId}`;
    const { data } = await api.get(url);

    dispatch({
      type: "CATALOG_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "CATALOG_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
  }
};
