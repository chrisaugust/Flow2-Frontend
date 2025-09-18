import api from '../services/api';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const CategoryExpenses = ({ token }) => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, expRes] = await Promise.all([
          api.get(`/categories/${categoryId}`),
          api.get('/expenses')
        ]);

        const categoryData = await catRes.data;
        const expensesData = await expRes.data;

        const filteredExpenses = expensesData.filter(exp => {
          const [year, month] = exp.occurred_on.split('-').map(Number);
          return (
            exp.category_id === parseInt(categoryId, 10) &&
            year === currentYear &&
            month === currentMonth 
          );
        });

        setCategory(categoryData);
        setExpenses(filteredExpenses);
      } catch (err) {
        setErrors([err.response?.data?.error || err.message]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;

    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      setErrors([err.response?.data?.error || err.message]);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!category) return <p className="text-red-500">Category not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Expenses for <em className="text-blue-600">{category.name}</em>
      </h2>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      {expenses.length === 0 ? (
        <p className="text-gray-500 mb-4">No expenses for this category in the current month.</p>
      ) : (
        <ul className="space-y-3 mb-4">
          {expenses.map(exp => (
            <li key={exp.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:bg-gray-50">
              <div>
                <p className="font-medium">{exp.description}</p>
                <p className="text-gray-600">${parseFloat(exp.amount).toFixed(2)} on {exp.occurred_on}</p>
              </div>
              <div className="flex space-x-2">
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
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Link
          to={`/expenses/new?category_id=${categoryId}`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-center"
        >
          ➕ Add Expense
        </Link>
        <Link
          to="/dashboard"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition text-center"
        >
          ⬅ Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CategoryExpenses;
