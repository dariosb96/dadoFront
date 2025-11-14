import { api } from "../../api";
import { toast } from "react-toastify";

export const requestPasswordReset = (email) => async () => {
  try {
    const { data } = await api.post("/user/request-reset", { email });
    toast.success(data.message || "Correo enviado con instrucciones");
  } catch (error) {
    toast.error(error?.response?.data?.error || "No se pudo enviar el correo");
  }
};
