import api from '../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; 

// Calculate category subtotals safely
function getCategorySubtotals(expenses, categories, currentMonth) {
  const subtotals = {};
  let grandTotal = 0;

  categories.forEach(cat => subtotals[cat.id] = 0);

  expenses.forEach(exp => {
    if (!exp?.occurred_on) return; // skip invalid
    const parts = exp.occurred_on.split('-').map(Number);
    if (parts.length < 2) return; // skip malformed
    const [year, month] = parts;
    if (year === currentMonth.getFullYear() && month === currentMonth.getMonth() + 1) {
      subtotals[exp.category_id] += parseFloat(exp.amount) || 0;
      grandTotal += parseFloat(exp.amount) || 0;
    }
  });

  return {
    categorySubtotals: Object.entries(subtotals).map(([id, total]) => {
      const cat = categories.find(c => c.id === parseInt(id, 10));
      return { category: cat?.name || 'Unknown', total: total.toFixed(2) };
    }),
    grandTotal: grandTotal.toFixed(2)
  };
}

// Calculate total income safely
function getMonthlyIncomeTotal(incomes, currentMonth) {
  let total = 0;
  incomes.forEach(inc => {
    if (!inc?.received_on) return; // skip invalid
    const parts = inc.received_on.split('-').map(Number);
    if (parts.length < 2) return; // skip malformed
    const [year, month] = parts;
    if (year === currentMonth.getFullYear() && month === currentMonth.getMonth() + 1) {
      total += parseFloat(inc.amount) || 0;
    }
  });
  return total.toFixed(2);
}

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [hourlyWage, setHourlyWage] = useState('');
  const [wageSaving, setWageSaving] = useState(false);
  const [wageError, setWageError] = useState('');

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, expRes, incRes] = await Promise.all([
          api.get('/categories'),
          api.get('/expenses', { params: { month: selectedMonth.getMonth() + 1, year: selectedMonth.getFullYear() } }),
          api.get('/incomes')
        ]);

        setCategories(catRes.data);
        setExpenses(expRes.data);
        setIncomes(incRes.data);

        // get user ID from localStorage token
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
          const userId = payload.user_id;
          const userRes = await api.get(`/users/${userId}`);
          setUser(userRes.data);
          setHourlyWage(userRes.data.hourly_wage || '');
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const handleMonthlyReview = async () => {
    try {
      const res = await api.post('/monthly_reviews', {
        month: selectedMonth.toISOString().slice(0, 10)
      });
      navigate(`/monthly_reviews/by_month_code/${res.data.month_code}`);
    } catch (err) {
      console.error('Could not start monthly review:', err);
      alert('Could not start monthly review. Try again.');
    }
  };

  if (loading) return <p>Loading...</p>;

  const { categorySubtotals, grandTotal } = getCategorySubtotals(expenses, categories, selectedMonth);
  const totalIncome = getMonthlyIncomeTotal(incomes, selectedMonth);

  const sortedSubtotals = [...categorySubtotals].sort((a, b) =>
    a.category.localeCompare(b.category, undefined, { sensitivity: 'base' })
  );

  const pieData = {
    labels: sortedSubtotals.map(item => item.category),
    datasets: [{
      data: sortedSubtotals.map(item => parseFloat(item.total)),
      backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#E7E9ED','#71B37C']
    }]
  };

  const handleHourlyWageUpdate = async (e) => {
    e.preventDefault();
    setWageSaving(true);
    setWageError('');

    try {
      const res = await api.patch(`/users/${user.id}`, { hourly_wage: hourlyWage });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setWageError(err.response?.data?.errors?.join(', ') || 'Update failed');
    } finally {
      setWageSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Month Picker */}
      <div className="mb-6">
        <label className="font-semibold mr-2">Select Month:</label>
        <input
          type="month"
          value={`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split('-').map(Number);
            setSelectedMonth(new Date(year, month - 1, 1));
          }}
          className="border p-2 rounded"
        />
      </div>

      {/* Hourly Wage editor */}
      {user && (
        <form onSubmit={handleHourlyWageUpdate} className="mb-6 max-w-sm">
          <label className="block mb-1 font-semibold">Hourly Wage</label>
          <input
            type="number"
            value={hourlyWage}
            onChange={(e) => setHourlyWage(e.target.value)}
            step="0.01"
            min="0"
            className="border p-2 rounded w-full mb-2"
          />
          <button
            type="submit"
            disabled={wageSaving}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            {wageSaving ? 'Saving...' : 'Save'}
          </button>
          {wageError && <p className="text-red-500 mt-1">{wageError}</p>}
        </form>
      )}

      <h2 className="text-xl font-semibold mb-2">
        {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}:
      </h2>

      <ul>
        {sortedSubtotals.map(({ category, total }) => {
          const catObj = categories.find(c => c.name === category);
          return (
            <li key={category}>
              <a href={`/categories/${catObj?.id}/expenses`}>{category}</a> – ${total}
            </li>
          );
        })}
      </ul>

      <div style={{ width: '400px', margin: '2rem auto' }}>
        <h3>Spending Breakdown</h3>
        <Pie data={pieData} />
      </div>

      <hr />

      <div>
        <p><strong><a href="/expenses">Total Spending</a>: ${grandTotal}</strong></p>
        <p><strong><a href="/incomes">Total Income</a>: ${totalIncome}</strong></p>
      </div>

      <button
        onClick={handleMonthlyReview}
        className="w-full max-w-sm py-6 px-8 text-xl font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition mb-8"
      >
        Start Monthly Review
      </button>

    </div>
  );
};

export default Dashboard;
