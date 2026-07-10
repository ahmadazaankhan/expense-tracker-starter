import { useState } from 'react'
import { CATEGORY_ICONS, formatCurrency, transactionsToCSV, downloadCSV } from './utils.js'

function EditRow({ transaction, categories, onSave, onCancel }) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount);
  const [type, setType] = useState(transaction.type);
  const [category, setCategory] = useState(transaction.category);

  const handleSave = () => {
    if (!description.trim() || !amount || Number(amount) <= 0) return;
    onSave({ description, amount, type, category });
  };

  return (
    <tr className="editing-row">
      <td>{transaction.date}</td>
      <td>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </td>
      <td>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{CATEGORY_ICONS[cat] || "📦"} {cat}</option>
          ))}
        </select>
      </td>
      <td>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </td>
      <td className="row-actions">
        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
      </td>
    </tr>
  );
}

function TransactionList({ transactions, categories, onDeleteTransaction, onEditTransaction }) {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const resetFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setSearchTerm("");
    setSortBy("date-desc");
    setDateRange("all");
  };

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }
  if (searchTerm.trim()) {
    const term = searchTerm.trim().toLowerCase();
    filteredTransactions = filteredTransactions.filter(t => t.description.toLowerCase().includes(term));
  }
  if (dateRange !== "all") {
    const now = new Date();
    if (dateRange === "this-month") {
      const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      filteredTransactions = filteredTransactions.filter(t => t.date.startsWith(monthPrefix));
    } else {
      const days = dateRange === "last-7" ? 7 : 30;
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - days);
      filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= cutoff);
    }
  }

  filteredTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "amount-desc":
        return Number(b.amount) - Number(a.amount);
      case "amount-asc":
        return Number(a.amount) - Number(b.amount);
      case "date-desc":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <div className="transactions">
      <div className="transactions-header">
        <h2>Transactions</h2>
        <div className="transactions-header-actions">
          <span className="transaction-count">Showing {filteredTransactions.length} of {transactions.length}</span>
          <button
            type="button"
            className="export-btn"
            onClick={() => downloadCSV(transactionsToCSV(filteredTransactions), `transactions-${new Date().toISOString().split('T')[0]}.csv`)}
            disabled={filteredTransactions.length === 0}
          >
            ⬇ Export CSV
          </button>
          <button type="button" className="reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{CATEGORY_ICONS[cat] || "📦"} {cat}</option>
          ))}
        </select>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option value="all">All Time</option>
          <option value="this-month">This Month</option>
          <option value="last-7">Last 7 Days</option>
          <option value="last-30">Last 30 Days</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

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
          {filteredTransactions.length === 0 && (
            <tr className="empty-row">
              <td colSpan={5}>No transactions match your filters.</td>
            </tr>
          )}
          {filteredTransactions.map(t => (
            editingId === t.id ? (
              <EditRow
                key={t.id}
                transaction={t}
                categories={categories}
                onCancel={() => setEditingId(null)}
                onSave={(updates) => {
                  onEditTransaction(t.id, updates);
                  setEditingId(null);
                }}
              />
            ) : (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td>
                  <span className="category-badge" data-category={t.category}>
                    {CATEGORY_ICONS[t.category] || "📦"} {t.category}
                  </span>
                </td>
                <td className={t.type === "income" ? "income-amount" : "expense-amount"}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </td>
                <td className="row-actions">
                  <button className="edit-btn" onClick={() => setEditingId(t.id)}>Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (window.confirm(`Delete "${t.description}"?`)) {
                        onDeleteTransaction(t.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList
