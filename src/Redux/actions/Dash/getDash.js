import { api } from "../../api";

export const fetchDashboardData =
  (startDate = null, endDate = null) =>
  async (dispatch) => {
    dispatch({ type: "DASHBOARD_REQUEST" });

    try {
      const noCacheHeaders = { "Cache-Control": "no-cache" };

      const query =
        startDate && endDate
          ? `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
          : "";

      const [salesByDayRes, salesByMonthRes, topProductsRes, salesByUserRes] =
        await Promise.all([
          api.get("/dash/sales/day", { headers: noCacheHeaders }),
          api.get("/dash/sales/month", { headers: noCacheHeaders }),
          api.get(`/dash/top-products${query}`, { headers: noCacheHeaders }),
          api.get("/dash/sales/user", { headers: noCacheHeaders }),
          api.get("/dash/sales/week", { headers: noCacheHeaders }),
        api.get("/dash/product-profit", { headers: noCacheHeaders }),
        ]);

      dispatch({
        type: "DASHBOARD_SUCCESS",
        payload: {
          salesByDay: salesByDayRes.data || [],
          salesByMonth: salesByMonthRes.data || [],
          topProducts: topProductsRes.data || [],
          salesByUser: salesByUserRes.data || [],
        },
      });
    } catch (error) {
      dispatch({
        type: "DASHBOARD_FAILURE",
        payload: error.response?.data?.error || error.message,
      });
    }
  };
