import { api } from "../../api";
export const CREATE_PRODUCT = "CREATE_PRODUCT";

export const createProduct = (formData, token) => {
  return async (dispatch) => {
    try {
      const response = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
                 },
      });

      dispatch({ type: CREATE_PRODUCT, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error creando producto:", error.response?.data || error.message);
      throw error;
    }
  };
};
