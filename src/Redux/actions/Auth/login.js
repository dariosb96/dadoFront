
import { api } from "../../api";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

const LOCAL = import.meta.env.VITE_URL1;

export const LoginUser = (credentials) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const { data } = await api.post(`/user/login`, credentials, );

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
        dispatch({
            type: LOGIN_FAILURE,
            payload: error.response?.data.message || error.message,
        });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: LOGOUT });
};
