import api from "./api";

export const getAnalytics = async () => {
  const [summary, categories, monthly, transactions] = await Promise.all([
    api.get("/dashboard/summary"),
    api.get("/dashboard/categories"),
    api.get("/dashboard/monthly"),
    api.get("/expenses/", {
      params: { page: 1, limit: 100 },
    }),
  ]);

  return {
    summary: summary.data,
    categories: categories.data,
    monthly: monthly.data,
    transactions: transactions.data,
  };
};
