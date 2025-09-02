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

          console.log("catRes.data:", catRes.data);
          console.log("expRes.data:", expRes.data);

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

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>Category not found</p>;

  return (
    <div>
      <h2>
        Expenses for <em>{category.name}</em>
      </h2>
      {expenses.length === 0 ? (
        <p>No expenses for this category in the current month.</p>
      ) : (
        <ul>
          {expenses.map(exp => (
            <li key={exp.id}>
              {exp.description} – ${exp.amount} on {exp.occurred_on}
              <button onClick={() => navigate(`/expenses/${exp.id}/edit`)}>Edit</button>
              <button onClick={() => handleDelete(exp.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <p>
        <Link to={`/expenses/new?category_id=${categoryId}`}>
          ➕ Add Expense
        </Link>
      </p>
      <p><a href="/dashboard">⬅ Back to Dashboard</a></p>
    </div>
  );
};

export default CategoryExpenses;