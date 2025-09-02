import api from '../services/api';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ExpenseForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedCategoryId = queryParams.get("category_id");

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(preselectedCategoryId || "");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState([]);

  const { id } = useParams(); // if present, we're in edit mode
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [occurredOn, setOccurredOn] = useState(
    isEditMode ? '' : new Date().toISOString().slice(0, 10)
  );

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setErrors(['Could not load categories']);
      }
    };

    fetchCategories();
  }, []);

  // Load expense if editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchExpense = async () => {
      try {
        const res = await api.get(`/expenses/${id}`);
        const data = res.data;
        setDescription(data.description || '');
        setAmount(data.amount || '');
        setCategoryId(data.category_id || '');
        setOccurredOn(data.occurred_on || '');
      } catch (err) {
        console.error(err);
        setErrors(['Failed to load expense.']);
      }
    };

    fetchExpense();
  }, [id, isEditMode]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      description,
      amount,
      category_id: categoryId,
      occurred_on: occurredOn
    };

    try {
      if (isEditMode) {
        await api.patch(`/expenses/${id}`, { expense: payload });
      } else {
        await api.post('/expenses', { expense: payload });
      }

      navigate(`/categories/${categoryId}/expenses`);
    } catch (err) {
      console.error('Error saving expense:', err);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors(['Something went wrong.']);
      }
    }
  };

  return (
    <div>
      <h2>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h2>

      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label><br />
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label><br />
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            step="0.01"
          />
        </div>
        <div>
          <label>Category:</label><br />
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Date:</label><br />
          <input
            type="date"
            value={occurredOn}
            onChange={e => setOccurredOn(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          {isEditMode ? 'Update Expense' : 'Create Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
