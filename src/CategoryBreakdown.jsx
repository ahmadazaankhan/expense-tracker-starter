import { CATEGORY_ICONS, CATEGORY_COLORS, formatCurrency } from './utils.js'

function CategoryBreakdown({ transactions }) {
  const expenses = transactions.filter(t => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  if (totalExpenses === 0) {
    return null;
  }

  const totalsByCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  const rows = Object.entries(totalsByCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="category-breakdown">
      <h3>Spending by Category</h3>
      <div className="breakdown-list">
        {rows.map(([category, amount]) => {
          const percent = (amount / totalExpenses) * 100;
          return (
            <div className="breakdown-row" key={category}>
              <div className="breakdown-label">
                <span>{CATEGORY_ICONS[category] || "📦"} {category}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="breakdown-bar-track">
                <div
                  className="breakdown-bar-fill"
                  style={{ width: `${percent}%`, background: CATEGORY_COLORS[category] || "#6b7280" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryBreakdown
