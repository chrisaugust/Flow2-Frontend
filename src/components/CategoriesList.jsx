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

  if (loading) return <p className="text-gray-500">Loading categories...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Categories</h2>
        <button
          onClick={() => navigate('/categories/new')}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
        >
          ➕ Add New Category
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Default?</th>
              <th className="text-left px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{cat.name}</td>
                <td className="px-4 py-2 border-b">{cat.is_default ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border-b space-x-2">
                  {cat.is_default ? (
                    <button
                      disabled
                      title="Default categories can't be deleted"
                      className="text-gray-400 cursor-not-allowed"
                    >
                      🚫 Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
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
