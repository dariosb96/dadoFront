const initialState = {
        products:[], 
        total: 0,
        page: 1,
        totalPages: 1,
        loading: false,
        error: null
    };

export const filteredProductsReducer = (state= initialState, action) => {
switch (action.type) {
    case "GET_FILTERED_PRODUCTS_REQUEST":
      return { ...state, loading: true };
    case "GET_FILTERED_PRODUCTS_SUCCESS":
      return {
        ...state,
        products: action.payload.results,
        total: action.payload.total,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        loading: false,
      };
    case "GET_FILTERED_PRODUCTS_FAILURE":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

     