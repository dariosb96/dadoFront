import { api } from "../../api";

// Acción principal: carga dashboard + productos con filtro opcional
export const fetchDashboardData =
  (startDate = null, endDate = null) =>
  async (dispatch) => {
    dispatch({ type: "DASHBOARD_REQUEST" });

    try {
      const noCacheHeaders = { "Cache-Control": "no-cache" };

      // Si hay fechas, las incluimos en la query
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
