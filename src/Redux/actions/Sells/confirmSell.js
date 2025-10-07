import axios from "axios";
const URL_LOCAL = import.meta.env.VITE_URL1;

export const confirmSell = (sellId, token) => async (dispatch) => {
  dispatch({ type: "SELLS_REQUEST" }); // coincide con tu reducer

  try {
    const res = await axios.put(
      `${URL_LOCAL}/sells/confirm/${sellId}`,
      {}, // aunque tu backend no necesita body
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch({
      type: "SELL_CONFIRM_SUCCESS",
      payload: res.data,
    });

    return res.data; // importante: permite manejar éxito en el componente
  } catch (error) {
    dispatch({
      type: "SELLS_FAILURE",
      payload: error.response?.data?.message || error.message,
    });
    throw error; // importante: para que handleConfirm pueda atraparlo
  }
};
