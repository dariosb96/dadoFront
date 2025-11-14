import { api } from "../../api";
import { toast } from "react-toastify";

export const verifyResetToken = (token) => async () => {
  try {
    const { data } = await api.get(`/user/reset/${token}`);
    return data.valid;
  } catch (error) {
    toast.error("Token inválido o expirado");
    return false;
  }
};
