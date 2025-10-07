const token = localStorage.getItem('token');

const initialState = {
   token: token ? token : null,
  user: token ? JSON.parse(localStorage.getItem('user')) : null,
  loading: false,
  error: null,
}
export default function authReducer (state= initialState, action ){
    switch(action.type){
        case 'LOGIN_REQUEST':
            return {...state, loading: true};
        case'LOGIN_SUCCESS':
            return {
                ...state, 
                user:action.payload.user,
                token:action.payload.token,
                loading:false
                     }
        case 'LOGIN_FAILURE':
            return {...state, error: action.payload, loading: false};
        case 'LOGOUT':
            return{
            token: null,
            user: null,
            loading: false,
            error: null,
                  };
        default:
            return state;        
    }
}