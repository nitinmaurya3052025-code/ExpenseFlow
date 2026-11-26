import { useEffect, useState } from "react";

import {
  Wallet,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  CalendarDays,
  Receipt,
} from "lucide-react";

import {
  getDashboardSummary,
  getCategoryStatistics,
  getMonthlyStatistics,
  getRecentTransactions,
} from "../services/dashboardService";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "./Dashboard.css";

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [summaryData, categoryData, monthlyData, transactionData] =
          await Promise.all([
            getDashboardSummary(),
            getCategoryStatistics(),
            getMonthlyStatistics(),
            getRecentTransactions(),
          ]);

        setSummary(summaryData);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setMonthlyStats(Array.isArray(monthlyData) ? monthlyData : []);

        setTransactions(
          Array.isArray(transactionData)
            ? transactionData
            : transactionData.expenses || [],
        );
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  const formatMonth = (month) => {
    const [year, monthNumber] = month.split("-");

    return new Date(Number(year), Number(monthNumber) - 1).toLocaleDateString(
      "en-IN",
      {
        month: "short",
        year: "numeric",
      },
    );
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <h2>{error}</h2>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Expenses",
      value: formatCurrency(summary?.total_spent),
      description: "Total money spent",
      icon: TrendingDown,
      color: "red",
    },
    {
      title: "Transactions",
      value: summary?.expense_count ?? 0,
      description: "Total transactions",
      icon: Receipt,
      color: "purple",
    },
    {
      title: "Total Categories",
      value: categories.length,
      description: "Expense categories",
      icon: Wallet,
      color: "green",
    },
    {
      title: "Average Expense",
      value: formatCurrency(
        summary?.expense_count
          ? summary.total_spent / summary.expense_count
          : 0,
      ),
      description: "Average per transaction",
      icon: PiggyBank,
      color: "blue",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}

      <div className="dashboard-welcome">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Here's what's happening with your finances.</p>
        </div>
      </div>

      {/* Statistics Cards */}

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <span>{stat.title}</span>

                <div className={`stat-icon ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>

              <h2>{stat.value}</h2>
              <p>{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}

      <div className="dashboard-charts">
        {/* Monthly Expenses */}

        <div className="dashboard-panel monthly-panel">
          <div className="panel-header">
            <div>
              <h3>Monthly Expenses</h3>
              <p>Your spending over time</p>
            </div>

            <button className="period-button">
              <CalendarDays size={16} />
              All Time
            </button>
          </div>

          {monthlyStats.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis dataKey="month" tickFormatter={formatMonth} />

                  <YAxis />

                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={formatMonth}
                  />

                  <Bar
                    dataKey="total"
                    name="Expenses"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-placeholder">
              <TrendingDown size={35} />
              <p>No monthly data available.</p>
            </div>
          )}
        </div>

        {/* Category Distribution */}

        <div className="dashboard-panel category-panel">
          <div className="panel-header">
            <div>
              <h3>Expense Categories</h3>
              <p>Where your money goes</p>
            </div>
          </div>

          {categories.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    innerRadius={55}
                    paddingAngle={4}
                  >
                    {categories.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-placeholder">
              <PiggyBank size={35} />
              <p>No category data available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}

      <div className="dashboard-panel transactions-panel">
        <div className="panel-header">
          <div>
            <h3>Recent Transactions</h3>
            <p>Your latest financial activities</p>
          </div>

          <button className="view-all-btn">
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-transactions">
            <div className="empty-icon">
              <Wallet size={27} />
            </div>

            <h3>No transactions to display</h3>
            <p>Your recent transactions will appear here.</p>
          </div>
        ) : (
          <div className="recent-transactions-list">
            {transactions.map((transaction) => (
              <div className="transaction-item" key={transaction.id}>
                <div className="transaction-info">
                  <div className="empty-icon">
                    <Receipt size={20} />
                  </div>

                  <div>
                    <h4>{transaction.description || transaction.category}</h4>

                    <p>
                      {transaction.category} · {transaction.date}
                    </p>
                  </div>
                </div>

                <strong>-{formatCurrency(transaction.amount)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
