// src/Redux/reducers/authReducer.js
const token = localStorage.getItem("token");

const initialState = {
  token: token ?? null,
  user: token ? JSON.parse(localStorage.getItem("user")) : null,
  loading: false,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true };
case "LOGIN_SUCCESS":
  localStorage.setItem("token", action.payload.token);
  localStorage.setItem("user", JSON.stringify(action.payload.user));
  return {
    ...state,
    user: action.payload.user,
    token: action.payload.token,
    loading: false,
  };


      
    case "LOGIN_FAILURE":
      return { ...state, error: action.payload, loading: false };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        token: null,
        user: null,
        loading: false,
        error: null,
      };
    case "UPDATE_USER_REQUEST":
      return { ...state, loading: true };
  case "UPDATE_USER_SUCCESS":
  localStorage.setItem("user", JSON.stringify(action.payload));
  return { ...state, user: action.payload, loading: false };


    case "UPDATE_USER_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}
