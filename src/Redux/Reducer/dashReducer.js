// const initialState = {
//   summary: {},        
//   salesByDay: [],     
//   salesByMonth: [],     
//   topProducts: [],      
//   salesByUser: [],     
//   profitByRange: null,
//   loading: false,
//   error: null,
// };

// export function dashboardReducer(state = initialState, action) {
//   switch (action.type) {
//     case "DASHBOARD_REQUEST":
//     case "PROFIT_REQUEST":
//       return { ...state, loading: true, error: null };

//     case "DASHBOARD_SUCCESS":
//       return {
//         ...state,
//         loading: false,
//         summary: action.payload.summary ?? {},
//         salesByDay: action.payload.salesByDay ?? [],
//         salesByMonth: action.payload.salesByMonth ?? [],
//         topProducts: action.payload.topProducts ?? [],
//         salesByUser: action.payload.salesByUser ?? [],
//       };

//     case "PROFIT_SUCCESS":
//       return { ...state, loading: false, profitByRange: action.payload };

//     case "DASHBOARD_FAILURE":
//     case "PROFIT_FAILURE":
//       return { ...state, loading: false, error: action.payload };

//     default:
//       return state;
//   }
// }

// export default dashboardReducer;

const initialState = {
  loading: false,
  salesByDay: [],
  salesByMonth: [],
  topProducts: [],
  salesByUser: [],
  error: null,
};

export function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case "DASHBOARD_REQUEST":
      return { ...state, loading: true, error: null };
    case "DASHBOARD_SUCCESS":
      return { ...state, loading: false, ...action.payload };
    case "DASHBOARD_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default dashboardReducer;
