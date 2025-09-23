// src/components/WallChartGraph.jsx
import { Chart } from 'react-chartjs-2';
import ChartJS from 'chart.js/auto';

function extractYearMonth(dateStr) {
  return {
    year: parseInt(dateStr.slice(0, 4), 10),
    month: parseInt(dateStr.slice(5, 7), 10) // 1-based
  };
}

function compareYearMonth(a, b) {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}

function buildMonthlyChartData(expenses, incomes, categories) {
  const allDates = [
    ...expenses.map(e => extractYearMonth(e.occurred_on)),
    ...incomes.map(i => extractYearMonth(i.received_on))
  ];
  if (allDates.length === 0) {
    return { monthLabels: [], categoryTotalsByMonth: {}, totalExpensesByMonth: [], totalIncomeByMonth: [] };
  }

  const min = allDates.reduce((acc, d) => (compareYearMonth(d, acc) < 0 ? d : acc));
  const max = allDates.reduce((acc, d) => (compareYearMonth(d, acc) > 0 ? d : acc));

  // Build month range
  const monthLabels = [];
  const monthMap = [];
  let { year, month } = min;
  while (year < max.year || (year === max.year && month <= max.month)) {
    monthLabels.push(new Date(year, month - 1, 1).toLocaleString('default', { month: 'short', year: 'numeric' }));
    monthMap.push({ year, month });
    month++;
    if (month > 12) { month = 1; year++; }
  }

  // Lookup map for performance
  const indexByYearMonth = Object.fromEntries(monthMap.map((m, idx) => [`${m.year}-${m.month}`, idx]));

  // Init category totals
  const categoryTotalsByMonth = Object.fromEntries(categories.map(cat => [cat.name, monthLabels.map(() => 0)]));

  // Fill expenses
  expenses.forEach(exp => {
    const { year, month } = extractYearMonth(exp.occurred_on);
    const cat = categories.find(c => c.id === exp.category_id);
    if (!cat) return;
    const idx = indexByYearMonth[`${year}-${month}`];
    if (idx !== undefined) {
      categoryTotalsByMonth[cat.name][idx] += parseFloat(exp.amount) || 0;
    }
  });

  const totalExpensesByMonth = monthLabels.map((_, idx) =>
    categories.reduce((sum, cat) => sum + categoryTotalsByMonth[cat.name][idx], 0)
  );

  const totalIncomeByMonth = monthMap.map(({ year, month }) =>
    incomes.reduce((sum, inc) => {
      const d = extractYearMonth(inc.received_on);
      return d.year === year && d.month === month ? sum + (parseFloat(inc.amount) || 0) : sum;
    }, 0)
  );

  return { monthLabels, categoryTotalsByMonth, totalExpensesByMonth, totalIncomeByMonth };
}


const WallChartGraph = ({ expenses, incomes, categories }) => {
  const { monthLabels, categoryTotalsByMonth, totalExpensesByMonth, totalIncomeByMonth } =
    buildMonthlyChartData(expenses, incomes, categories);

  const barDatasets = Object.entries(categoryTotalsByMonth).map(([catName, totals], idx) => ({
    type: 'bar',
    label: catName,
    data: totals,
    backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
    stack: 'expenses'
  }));

  const totalExpensesDataset = {
    type: 'line',
    label: 'Total Expenses',
    data: totalExpensesByMonth,
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.88)',
    tension: 0.3,
    fill: false,
    yAxisID: 'yLines'
  };

  const totalIncomeDataset = {
    type: 'line',
    label: 'Total Income',
    data: totalIncomeByMonth,
    borderColor: 'green',
    backgroundColor: 'rgba(14, 159, 14, 0.95)',
    tension: 0.3,
    fill: false,
    yAxisID: 'yLines'
  };

  const chartData = {
    labels: monthLabels,
    datasets: [...barDatasets, totalExpensesDataset, totalIncomeDataset]
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { stacked: true },
      y: { 
        stacked: true, // stack bars vertically
        beginAtZero: true 
      }, //bars
      yLines: { stacked: false, beginAtZero: true, position: 'right' } // lines
    }
  };

  return <Chart type="bar" data={chartData} options={options} />;
};

export default WallChartGraph;
