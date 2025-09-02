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
    <div>
      <h1>New Category</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Default Category:
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
        </label>
        <br />

        <button type="submit">Save Category</button>
      </form>
    </div>
  );
};

export default CategoryForm;