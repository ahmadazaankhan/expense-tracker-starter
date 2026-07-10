import { useState } from 'react'
import { CATEGORY_ICONS } from './utils.js'

function TransactionForm({ categories, onAddTransaction }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!amount || Number(amount) <= 0) newErrors.amount = "Enter an amount greater than 0.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newTransaction = {
      id: Date.now(),
      description,
      amount,
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    };

    onAddTransaction(newTransaction);
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("food");
    setErrors({});
  };

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="type-toggle">
          <button
            type="button"
            className={`toggle-btn income ${type === "income" ? "active" : ""}`}
            onClick={() => setType("income")}
          >
            Income
          </button>
          <button
            type="button"
            className={`toggle-btn expense ${type === "expense" ? "active" : ""}`}
            onClick={() => setType("expense")}
          >
            Expense
          </button>
        </div>

        <div className="form-row">
          <div className="form-field">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>
          <div className="form-field">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.amount && <p className="field-error">{errors.amount}</p>}
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_ICONS[cat] || "📦"} {cat}</option>
            ))}
          </select>
          <button type="submit" className="add-btn">Add</button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm
