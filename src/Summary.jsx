import { formatCurrency } from './utils.js'
import CategoryBreakdown from './CategoryBreakdown.jsx'

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  return (
    <div className="summary-section">
      <div className="summary">
        <div className="summary-card">
          <h3>Income</h3>
          <p className="income-amount">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="summary-card">
          <h3>Expenses</h3>
          <p className="expense-amount">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="summary-card">
          <h3>Balance</h3>
          <p className={`balance-amount ${balance < 0 ? "negative" : ""}`}>{formatCurrency(balance)}</p>
        </div>
        <div className="summary-card">
          <h3>Savings Rate</h3>
          <p className={`balance-amount ${savingsRate < 0 ? "negative" : "positive"}`}>{savingsRate}%</p>
        </div>
      </div>
      <CategoryBreakdown transactions={transactions} />
    </div>
  );
}

export default Summary
