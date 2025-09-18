import api from '../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryForm = ({ token }) => {
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = {
      name,
      is_default: isDefault,
    };

    try {
      const res = await api.post('/categories', categoryData);
      if (res.status === 201 || res.status === 200) {
        navigate('/dashboard');
      } else {
        setError(res.data?.errors?.join(', ') || 'Failed to create category');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.response?.data?.errors?.join(', ') || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-4">New Category</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            id="isDefault"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="text-gray-700">
            Default Category
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Save Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;