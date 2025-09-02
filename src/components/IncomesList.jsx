import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const IncomesList = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const fetchIncomes = async () => {
    try {
      const res = await api.get('/incomes');
      setIncomes(res.data);
    } catch (err) {
      console.error(err);
      setErrors([err.response?.data?.errors?.join(', ') || err.message]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) return;

    try {
      await api.delete(`/incomes/${id}`);
      setIncomes(incomes.filter(income => income.id !== id));
    } catch (err) {
      console.error(err);
      setErrors([err.response?.data?.errors?.join(', ') || err.message]);
    }
  };

  if (loading) return <p>Loading incomes...</p>;

  return (
    <div>
      <h2>Your Incomes</h2>
      <div style={{ marginBottom: '1rem' }}>
        <a href="/incomes/new">➕ Add New Income</a>
      </div>

      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      {incomes.length === 0 ? (
        <p>No incomes found.</p>
      ) : (
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th>Source</th>
              <th>Amount</th>
              <th>Received On</th>
              <th>Work Income?</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map(income => (
              <tr key={income.id}>
                <td>{income.source}</td>
                <td>${parseFloat(income.amount).toFixed(2)}</td>
                <td>{income.received_on}</td>
                <td>{income.is_work_income ? 'Yes' : 'No'}</td>
                <td>{income.notes || '-'}</td>
                <td>
                  <button onClick={() => navigate(`/incomes/${income.id}/edit`)}>Edit</button>
                  <button onClick={() => handleDelete(income.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IncomesList;
