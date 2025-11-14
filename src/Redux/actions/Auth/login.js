export const LoginUser = (credentials) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const { data } = await api.post(`/user/login`, credentials);

        if (data.userdata && data.userdata.id) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.userdata));

            dispatch({
                type: LOGIN_SUCCESS,
                payload: { token: data.token, user: data.userdata },
            });
        } else {
            throw new Error("Usuario no tiene ID");
        }

    } catch (error) {
        // 👇 Aquí capturamos el mensaje real del backend
        const errorMessage =
            error.response?.data?.message || // mensaje enviado por tu backend
            error.response?.statusText ||    // texto del status (ej. Unauthorized)
            error.message;                   // fallback genérico

        // 🔑 Si el token es inválido o expiró, hacemos logout automático
        if (
            errorMessage === "El token ha expirado" ||
            errorMessage === "Token inválido"
        ) {
            dispatch(logout());
        }

        dispatch({
            type: LOGIN_FAILURE,
            payload: errorMessage,
        });
    }
};
