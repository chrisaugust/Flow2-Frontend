import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, catRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/categories')
        ]);
        setExpenses(expRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setErrors([err.response?.data?.errors?.join(', ') || err.message]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;

    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error('Failed to delete expense:', err);
      setErrors([err.response?.data?.errors?.join(', ') || err.message]);
    }
  };

  if (loading) return <p className="text-gray-500">Loading expenses...</p>;

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Expenses</h2>
        <button
          onClick={() => navigate('/expenses/new')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Add New Expense
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Category</th>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{exp.description}</td>
                  <td className="px-4 py-2">${parseFloat(exp.amount).toFixed(2)}</td>
                  <td className="px-4 py-2">{getCategoryName(exp.category_id)}</td>
                  <td className="px-4 py-2">{exp.occurred_on}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/expenses/${exp.id}/edit`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpensesList;