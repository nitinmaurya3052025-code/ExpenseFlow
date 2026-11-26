import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Wallet,
} from "lucide-react";

import api from "../services/api";
import "./Transactions.css";

const PAGE_SIZE = 8;

const getToday = () => new Date().toISOString().split("T")[0];

const initialForm = {
  amount: "",
  category: "",
  description: "",
  date: getToday(),
};

const Transactions = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/expenses/");
      setExpenses(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Unique categories
  const categories = useMemo(() => {
    return [
      ...new Set(expenses.map((expense) => expense.category).filter(Boolean)),
    ].sort();
  }, [expenses]);

  // Search, filter and sort
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (expense) =>
          expense.description?.toLowerCase().includes(query) ||
          expense.category?.toLowerCase().includes(query),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((expense) => expense.category === categoryFilter);
    }

    if (startDate) {
      result = result.filter((expense) => expense.date >= startDate);
    }

    if (endDate) {
      result = result.filter((expense) => expense.date <= endDate);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date) - new Date(a.date);
      }

      if (sortBy === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }

      if (sortBy === "highest") {
        return Number(b.amount) - Number(a.amount);
      }

      if (sortBy === "lowest") {
        return Number(a.amount) - Number(b.amount);
      }

      return 0;
    });

    return result;
  }, [expenses, search, categoryFilter, startDate, endDate, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / PAGE_SIZE);

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, startDate, endDate, sortBy]);

  // Statistics
  const totalAmount = filteredExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

  // Open Add Modal
  const handleAdd = () => {
    setEditingExpense(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleEdit = (expense) => {
    setEditingExpense(expense);

    setFormData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description || "",
      date: expense.date,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // Close Modal
  const handleClose = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingExpense(null);
    setFormData(initialForm);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add or Update Expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please enter a category.");
      return;
    }

    if (!formData.date) {
      setError("Please select a date.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        amount: Number(formData.amount),
        category: formData.category.trim(),
        description: formData.description.trim() || null,
        date: formData.date,
      };

      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, payload);

        setSuccess("Expense updated successfully.");
      } else {
        await api.post("/expenses/", payload);

        setSuccess("Expense added successfully.");
      }

      setShowModal(false);
      setEditingExpense(null);
      setFormData(initialForm);

      await fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save expense.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Expense
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this expense?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(`/expenses/${id}`);

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));

      setSuccess("Expense deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setStartDate("");
    setEndDate("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <div>
          <h1>Transactions</h1>
          <p>Track and manage all your expenses.</p>
        </div>

        <button className="add-expense-btn" onClick={handleAdd}>
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {error && <div className="transaction-alert error">{error}</div>}

      {success && <div className="transaction-alert success">{success}</div>}

      <div className="transaction-summary">
        <div className="transaction-summary-card">
          <div className="summary-icon">
            <Wallet size={22} />
          </div>

          <div>
            <p>Total Filtered Spending</p>
            <h2>
              ₹
              {totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>

        <div className="transaction-summary-card">
          <div className="summary-icon">
            <ArrowUpDown size={22} />
          </div>

          <div>
            <p>Transactions Found</p>
            <h2>{filteredExpenses.length}</h2>
          </div>
        </div>
      </div>

      <div className="transaction-filters">
        <div className="transaction-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label="Start date"
        />

        <input
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(e) => setEndDate(e.target.value)}
          aria-label="End date"
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>

        <button className="reset-filter-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <div className="transactions-table-container">
        {loading ? (
          <div className="transaction-empty">Loading transactions...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="transaction-empty">
            <Wallet size={40} />
            <h3>No transactions found</h3>
            <p>Try changing your filters or add a new expense.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    {new Date(`${expense.date}T00:00:00`).toLocaleDateString(
                      "en-IN",
                    )}
                  </td>

                  <td>{expense.description || "-"}</td>

                  <td>
                    <span className="category-badge">{expense.category}</span>
                  </td>

                  <td className="expense-amount">
                    ₹
                    {Number(expense.amount).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(expense)}
                        title="Edit expense"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingId === expense.id}
                        title="Delete expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="transaction-pagination">
          <p>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}-
            {Math.min(currentPage * PAGE_SIZE, filteredExpenses.length)} of{" "}
            {filteredExpenses.length}
          </p>

          <div>
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="expense-modal">
            <div className="modal-header">
              <div>
                <h2>{editingExpense ? "Edit Expense" : "Add New Expense"}</h2>

                <p>
                  {editingExpense
                    ? "Update your transaction details."
                    : "Enter the details of your expense."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={handleClose}
                type="button"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Amount (₹)</label>

                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Food, Travel, Shopping"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  name="description"
                  placeholder="What did you spend on?"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-expense-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editingExpense
                    ? "Save Changes"
                    : "Add Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
