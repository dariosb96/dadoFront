const initialState = {
  products: [],
  loading: false,
  error: null,
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    // 🔹 Cargando productos
    case "GET_PROD_REQUEST":
    case "GET_AV_REQUEST":
    case "UPDATE_PROD_REQUEST":
      return { ...state, loading: true, error: null };

    // 🔹 Productos obtenidos correctamente
    case "GET_PROD_SUCCESS":
    case "GET_AV_SUCCESS":
      return { ...state, products: action.payload, loading: false, error: null };

    // 🔹 Error al obtener o actualizar
    case "GET_PROD_FAILURE":
    case "GET_AV_FAILURE":
    case "UPDATE_PROD_FAILURE":
      return { ...state, loading: false, error: action.payload };

    // 🔹 Actualizar producto en el array
    case "UPDATE_PROD_SUCCESS":
      return {
        ...state,
        loading: false,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        error: null,
      };

    // 🔹 Eliminar producto del array
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
        error: null,
      };

    default:
      return state;
  }
}
