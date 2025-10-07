const initialState = {
    catalog: [],
    catalogs: [],
    loading: false,
    error: null,
    businessName: null
};

export const catalogReducer = (state = initialState, action) =>{
    switch(action.type){
        case 'CATALOG_REQUEST':
         return {...state, loading: true};

        case 'CATALOG_SUCCESS':
         return {...state, loading: false, catalog: action.payload.products, businessName: action.payload.businessName};

        case 'CATALOG_FAILURE':
         return {...state, loading:false, error: action.payload};
        
        
         case 'CATALOGS_REQUEST': 
         return {...state, loading: true};

        case 'CATALOGS_SUCCESS':
         return {...state, loading: false,  catalogs: action.payload,businessName: action.payload.businessName

         };

        case 'CATALOGS_FAILURE':
         return {...state, loading:false, error: action.payload};

         default:
            return state;
    }
}