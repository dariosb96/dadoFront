// src/Redux/actions/Dash/getDash.js
import { api } from "../../api";

export const fetchDashboardData = () => async (dispatch) => {
  dispatch({ type: "DASHBOARD_REQUEST" });

  try {
    const noCacheHeaders = { "Cache-Control": "no-cache" };

    const [
      summaryRes,
      salesByDayRes,
      salesByMonthRes,
      topProductsRes,
      salesByUserRes,
    ] = await Promise.all([
      api.get("/dash/", { headers: noCacheHeaders }),
      api.get("/dash/sales/day", { headers: noCacheHeaders }),
      api.get("/dash/sales/month", { headers: noCacheHeaders }),
      api.get("/dash/top-products", { headers: noCacheHeaders }),
      api.get("/dash/sales/user", { headers: noCacheHeaders }),
    ]);

    // logs para debug
    console.log("API -> salesByDay:", salesByDayRes.data);
    console.log("API -> salesByMonth:", salesByMonthRes.data);
    console.log("API -> topProducts:", topProductsRes.data);
    console.log("API -> salesByUser:", salesByUserRes.data);
    console.log("API -> summary:", summaryRes.data);

    dispatch({
      type: "DASHBOARD_SUCCESS",
      payload: {
        summary: summaryRes.data || {},
        salesByDay: salesByDayRes.data || [],
        salesByMonth: salesByMonthRes.data || [],
        topProducts: topProductsRes.data || [],
        salesByUser: salesByUserRes.data || [],
      },
    });
  } catch (error) {
    console.error("fetchDashboardData error:", error);
    dispatch({
      type: "DASHBOARD_FAILURE",
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const fetchProfitByRange = (startDate, endDate) => async (dispatch) => {
  dispatch({ type: "PROFIT_REQUEST" });

  try {
    const { data } = await api.get("/dash/profit-r", {
      params: { startDate, endDate },
      headers: { "Cache-Control": "no-cache" },
    });

    dispatch({ type: "PROFIT_SUCCESS", payload: data });
  } catch (error) {
    console.error("fetchProfitByRange error:", error);
    dispatch({
      type: "PROFIT_FAILURE",
      payload: error.response?.data?.error || error.message,
    });
  }
};
