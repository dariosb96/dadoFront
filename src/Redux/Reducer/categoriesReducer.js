const initialState = {
    categories : [],
    loading:false,
    error:null
};

export const categoriesReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'GET_CAT_REQUEST':
      return { ...state, loading: true };

    case 'GET_CAT_SUCCESS':
      return { ...state, categories: action.payload, loading: false };

    case 'GET_CAT_FAILURE':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}