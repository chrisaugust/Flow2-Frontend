import api from '../services/api';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoriesList = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        setErrors([err.response?.data?.error || err.message]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      setErrors([err.response?.data?.error || err.message]);
    }
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div>
      <h2>Your Categories</h2>
      <div><a href="/categories/new">➕ Add New Category</a></div>

      {errors.length > 0 && (
        <div style={{ color: 'red' }}>{errors.map((e, i) => <p key={i}>{e}</p>)}</div>
      )}

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Default?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.is_default ? 'Yes' : 'No'}</td>
                <td>
                  {cat.is_default ? (
                    <button disabled title="Default categories can't be deleted" style={{ color: 'gray', cursor: 'not-allowed' }}>
                      🚫 Delete
                    </button>
                  ) : (
                    <button onClick={() => handleDelete(cat.id)} style={{ color: 'red' }}>
                      🗑️ Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoriesList;