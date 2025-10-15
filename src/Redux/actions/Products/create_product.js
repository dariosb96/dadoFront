import { api } from "../../api";
export const CREATE_PRODUCT = "CREATE_PRODUCT";


export const createProduct = (productData, token) => {
return async dispatch => {
    try{
        const formData = new FormData();

        for (const key in productData) {
             if (key === "images") {
             productData.images.forEach((file) => formData.append("images", file));
             } else {
                 formData.append(key, productData[key]);
             }
        }

        const response  = await api.post("/products", formData);

        dispatch({type: CREATE_PRODUCT, payload: response.data});
    }catch(error){
        console.error("error creating product", error);
        return ({error: error.message});
    }
}
}