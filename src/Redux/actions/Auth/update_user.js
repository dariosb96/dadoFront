import { api } from "../../api";

export const UPDATE_USER = "UPDATE_USER";

export const updateUser = (userId, formData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_USER + "_REQUEST" });

    try {
      const response = await api.put(`/user/${userId}`, formData);

      const user = response.data.user ?? response.data; 
      dispatch({ type: UPDATE_USER + "_SUCCESS", payload: user });
      return user;
    } catch (error) {
      const payload = error.response?.data?.message || error.message;
      dispatch({
        type: UPDATE_USER + "_FAIL",
        payload,
      });
      throw new Error(payload);
    }
  };
};
