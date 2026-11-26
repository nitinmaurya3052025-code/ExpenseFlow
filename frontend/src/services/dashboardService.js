import api from "./api";

// Get financial summary
export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

// Get category-wise expenses
export const getCategoryStatistics = async () => {
  const response = await api.get("/dashboard/categories");
  return response.data;
};

// Get monthly financial statistics
export const getMonthlyStatistics = async () => {
  const response = await api.get("/dashboard/monthly");
  return response.data;
};

// Get recent transactions
export const getRecentTransactions = async () => {
  const response = await api.get("/expenses/", {
    params: {
      page: 1,
      limit: 5,
    },
  });

  return response.data;
};
