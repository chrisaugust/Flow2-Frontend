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

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [occurredOn, setOccurredOn] = useState(
    isEditMode ? '' : new Date().toISOString().slice(0, 10)
  );

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { description, amount, category_id: categoryId, occurred_on: occurredOn };

    try {
      if (isEditMode) {
        await api.patch(`/expenses/${id}`, { expense: payload });
      } else {
        await api.post('/expenses', { expense: payload });
      }
      navigate(`/categories/${categoryId}/expenses`);
    } catch (err) {
      console.error('Error saving expense:', err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else setErrors(['Something went wrong.']);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h2>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            step="0.01"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={occurredOn}
            onChange={e => setOccurredOn(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isEditMode ? 'Update Expense' : 'Create Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
