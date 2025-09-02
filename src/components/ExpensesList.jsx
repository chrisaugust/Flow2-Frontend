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

  if (loading) return <p>Loading expenses...</p>;

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div>
      <h2>Your Expenses</h2>
      <div><a href="/expenses/new">➕ Add New Expense</a></div>

      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id}>
                <td>{exp.description}</td>
                <td>${parseFloat(exp.amount).toFixed(2)}</td>
                <td>{getCategoryName(exp.category_id)}</td>
                <td>{exp.occurred_on}</td>
                <td>
                  <button onClick={() => navigate(`/expenses/${exp.id}/edit`)}>Edit</button>
                  <button onClick={() => handleDelete(exp.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpensesList;