import { combineReducers } from "redux";
import authReducer from "./authReducer";
import productReducer from "./productReducer";
import { catalogReducer } from "./catalogReducer";
import { sellsReducer } from "./sellsReducer";
import { categoriesReducer } from "./categoriesReducer";
import { filteredProductsReducer } from "./filteredProdReducer";
import {dashboardReducer}  from "./dashReducer";

const rootReducer = combineReducers ({
    auth: authReducer,
    products: productReducer,
    catalog: catalogReducer,
    sells: sellsReducer,
    categories: categoriesReducer,
    filteredProducts: filteredProductsReducer,
    dashboard: dashboardReducer

});

export default rootReducer;

