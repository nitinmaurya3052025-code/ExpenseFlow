import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsService";
import "./Analytics.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => setError("Unable to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="analytics-page">Loading analytics...</div>;
  if (error) return <div className="analytics-page">{error}</div>;

  const total = Number(data.summary.total_spent || 0);
  const count = Number(data.summary.expense_count || 0);

  const categories = data.categories || [];
  const monthly = data.monthly || [];

  const highestCategory = [...categories].sort(
    (a, b) => Number(b.total) - Number(a.total),
  )[0];

  const highestMonth = Math.max(
    ...monthly.map((item) => Number(item.total)),
    1,
  );

  const highestCategoryTotal = Math.max(
    ...categories.map((item) => Number(item.total)),
    1,
  );

  const average = count ? total / count : 0;

  const monthName = (month) => {
    const [year, m] = month.split("-");
    return new Date(Number(year), Number(m) - 1).toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>Understand where your money goes.</p>
        </div>
      </div>

      <div className="analytics-stats">
        <div className="analytics-card">
          <span>Total Spending</span>
          <h2>{formatCurrency(total)}</h2>
          <small>All recorded expenses</small>
        </div>

        <div className="analytics-card">
          <span>Total Transactions</span>
          <h2>{count}</h2>
          <small>Recorded transactions</small>
        </div>

        <div className="analytics-card">
          <span>Average Transaction</span>
          <h2>{formatCurrency(average)}</h2>
          <small>Average expense amount</small>
        </div>

        <div className="analytics-card">
          <span>Top Spending Category</span>
          <h2>{highestCategory?.category || "N/A"}</h2>
          <small>
            {highestCategory
              ? formatCurrency(highestCategory.total)
              : "No expenses yet"}
          </small>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="analytics-panel">
          <h3>Monthly Spending Trend</h3>
          <p>Your monthly expense history</p>

          {monthly.length === 0 ? (
            <div className="analytics-empty">No monthly data available.</div>
          ) : (
            <div className="monthly-chart">
              {monthly.map((item) => (
                <div className="month-column" key={item.month}>
                  <span className="bar-value">
                    {formatCurrency(item.total)}
                  </span>

                  <div className="bar-track">
                    <div
                      className="month-bar"
                      style={{
                        height: `${Math.max(
                          (Number(item.total) / highestMonth) * 100,
                          3,
                        )}%`,
                      }}
                    />
                  </div>

                  <span className="month-label">{monthName(item.month)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="analytics-panel">
          <h3>Category Breakdown</h3>
          <p>Spending distribution</p>

          {categories.length === 0 ? (
            <div className="analytics-empty">No category data available.</div>
          ) : (
            <div className="category-chart">
              {categories
                .slice()
                .sort((a, b) => Number(b.total) - Number(a.total))
                .map((item) => (
                  <div className="category-chart-item" key={item.category}>
                    <div className="category-chart-info">
                      <strong>{item.category}</strong>
                      <span>{formatCurrency(item.total)}</span>
                    </div>

                    <div className="category-track">
                      <div
                        className="category-fill"
                        style={{
                          width: `${(Number(item.total) / highestCategoryTotal) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>

      <section className="analytics-panel analytics-table-panel">
        <h3>Category Spending Details</h3>

        <div className="analytics-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.total)}</td>
                  <td>
                    {total
                      ? `${((Number(item.total) / total) * 100).toFixed(1)}%`
                      : "0%"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
