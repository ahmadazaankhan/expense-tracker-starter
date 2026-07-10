export const CATEGORY_ICONS = {
  food: "🍔",
  housing: "🏠",
  utilities: "💡",
  transport: "🚗",
  entertainment: "🎬",
  salary: "💰",
  other: "📦",
};

export const CATEGORY_COLORS = {
  food: "#fb923c",
  housing: "#60a5fa",
  utilities: "#facc15",
  transport: "#22d3ee",
  entertainment: "#c084fc",
  salary: "#4ade80",
  other: "#9ca3af",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(amount) {
  return currencyFormatter.format(Number(amount) || 0);
}

export function transactionsToCSV(transactions) {
  const header = ["Date", "Description", "Category", "Type", "Amount"];
  const escape = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const rows = transactions.map((t) =>
    [t.date, t.description, t.category, t.type, t.amount].map(escape).join(",")
  );
  return [header.map(escape).join(","), ...rows].join("\n");
}

export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
