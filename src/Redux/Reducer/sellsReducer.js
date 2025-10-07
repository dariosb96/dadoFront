const token = localStorage.getItem('token');

const initialState = {
    sells: [],
    currentSell: null,
    loading: false,
    error: null
};

export const sellsReducer = (state = initialState, action) => {
switch(action.type) {
    case "SELLS_REQUEST" :
        return {...state, loading: true, error: null};

    case "SELLS_SUCCESS":
        return {...state, loading: false, sells: action.payload};

    case "SELLS_FAILURE":
        return {...state, loading: false, error: action.payload};
        
    case "SELLS_CREATE_SUCCESS":
        return {...state, 
            loading: false, 
            sells: [action.payload, ...state.sells]};

   case "SELL_CONFIRM_SUCCESS":
  return {
    ...state,
    sells: state.sells.map(s =>
      s.id === action.payload.id
        ? { ...s, status: "finalizado", finishDate: new Date() } // actualizar solo lo necesario
        : s
    ),
  };  
       case "SELL_DETAILS_SUCCESS":
      return { ...state, 
        loading: false, 
        currentSell: action.payload };
        case "DELETE_SELL_REQUEST":
  return { ...state, loading: true, error: null };

case "DELETE_SELL_SUCCESS":
  return {
    ...state,
    loading: false,
    sells: state.sells.filter((s) => s.id !== action.payload), // elimina venta del state
  };

case "DELETE_SELL_FAILURE":
  return { ...state, loading: false, error: action.payload };

    default:
      return state;
}
}