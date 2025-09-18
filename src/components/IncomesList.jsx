// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';

// const IncomesList = () => {
//   const [incomes, setIncomes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState([]);
//   const navigate = useNavigate();

//   const fetchIncomes = async () => {
//     try {
//       const res = await api.get('/incomes');
//       setIncomes(res.data);
//     } catch (err) {
//       console.error(err);
//       setErrors([err.response?.data?.errors?.join(', ') || err.message]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIncomes();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this income?')) return;

//     try {
//       await api.delete(`/incomes/${id}`);
//       setIncomes(incomes.filter(income => income.id !== id));
//     } catch (err) {
//       console.error(err);
//       setErrors([err.response?.data?.errors?.join(', ') || err.message]);
//     }
//   };

//   if (loading) return <p>Loading incomes...</p>;

//   return (
//     <div>
//       <h2>Your Incomes</h2>
//       <div style={{ marginBottom: '1rem' }}>
//         <a href="/incomes/new">➕ Add New Income</a>
//       </div>

//       {errors.length > 0 && (
//         <div style={{ color: 'red' }}>
//           {errors.map((e, i) => <p key={i}>{e}</p>)}
//         </div>
//       )}

//       {incomes.length === 0 ? (
//         <p>No incomes found.</p>
//       ) : (
//         <table className="border-collapse w-full">
//           <thead>
//             <tr>
//               <th>Source</th>
//               <th>Amount</th>
//               <th>Received On</th>
//               <th>Work Income?</th>
//               <th>Notes</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {incomes.map(income => (
//               <tr key={income.id}>
//                 <td>{income.source}</td>
//                 <td>${parseFloat(income.amount).toFixed(2)}</td>
//                 <td>{income.received_on}</td>
//                 <td>{income.is_work_income ? 'Yes' : 'No'}</td>
//                 <td>{income.notes || '-'}</td>
//                 <td>
//                   <button onClick={() => navigate(`/incomes/${income.id}/edit`)}>Edit</button>
//                   <button onClick={() => handleDelete(income.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default IncomesList;

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  if (loading) return <p className="text-gray-500">Loading incomes...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Incomes</h2>

      <div className="mb-4">
        <Link
          to="/incomes/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Add New Income
        </Link>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      {incomes.length === 0 ? (
        <p className="text-gray-500">No incomes found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Source</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Received On</th>
                <th className="py-2 px-4 text-left">Work Income?</th>
                <th className="py-2 px-4 text-left">Notes</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map(income => (
                <tr key={income.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-4">{income.source}</td>
                  <td className="py-2 px-4">${parseFloat(income.amount).toFixed(2)}</td>
                  <td className="py-2 px-4">{income.received_on}</td>
                  <td className="py-2 px-4">{income.is_work_income ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4">{income.notes || '-'}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => navigate(`/incomes/${income.id}/edit`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(income.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncomesList;
