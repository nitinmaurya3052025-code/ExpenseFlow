import { useEffect, useState } from "react";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

import { Plus, Pencil, Trash2, X, Tags } from "lucide-react";

import "./Categories.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await updateCategory(editingId, name.trim());
      } else {
        await addCategory(name.trim());
      }

      setName("");
      setEditingId(null);

      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.detail || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setError("");
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;

    setError("");

    try {
      await deleteCategory(category.id);
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete category.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setError("");
  };

  if (loading) {
    return <div className="categories-page">Loading categories...</div>;
  }

  return (
    <div className="categories-page">
      <div className="categories-header">
        <div>
          <h1>Categories</h1>
          <p>Organize and manage your spending categories.</p>
        </div>

        <div className="category-count">
          <Tags size={20} />
          {categories.length} Categories
        </div>
      </div>

      <div className="category-management">
        <section className="category-form-panel">
          <h3>{editingId ? "Edit Category" : "Add New Category"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />

            <button type="submit" disabled={saving}>
              <Plus size={18} />
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Category"
                  : "Add Category"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-category"
                onClick={cancelEdit}
              >
                <X size={17} />
                Cancel
              </button>
            )}
          </form>

          {error && <p className="category-error">{error}</p>}
        </section>

        <section className="category-list-panel">
          <h3>Your Categories</h3>

          {categories.length === 0 ? (
            <div className="category-empty">
              <Tags size={35} />
              <p>No categories yet. Add your first category.</p>
            </div>
          ) : (
            <div className="category-list">
              {categories.map((category) => (
                <div className="category-item" key={category.id}>
                  <div className="category-icon">
                    <Tags size={20} />
                  </div>

                  <div className="category-details">
                    <h4>{category.name}</h4>

                    <p>{category.transaction_count} transactions</p>
                  </div>

                  <div className="category-total">
                    {formatCurrency(category.total_spent)}
                  </div>

                  <div className="category-actions">
                    <button title="Edit" onClick={() => handleEdit(category)}>
                      <Pencil size={17} />
                    </button>

                    <button
                      title="Delete"
                      onClick={() => handleDelete(category)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Categories;
