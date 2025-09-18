// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import api from '../services/api';

// const IncomeForm = () => {
//   const { id } = useParams();
//   const isEditMode = Boolean(id);
//   const navigate = useNavigate();

//   const [source, setSource] = useState('');
//   const [amount, setAmount] = useState('');
//   const [receivedOn, setReceivedOn] = useState(
//     new Date().toISOString().slice(0, 10)
//   );
//   const [isWorkIncome, setIsWorkIncome] = useState(false);
//   const [notes, setNotes] = useState('');
//   const [errors, setErrors] = useState([]);
//   const [loading, setLoading] = useState(isEditMode);

//   // Fetch existing income if editing
//   useEffect(() => {
//     if (!isEditMode) return;

//     const fetchIncome = async () => {
//       try {
//         const res = await api.get(`/incomes/${id}`);
//         const data = res.data;

//         setSource(data.source || '');
//         setAmount(data.amount || '');
//         setReceivedOn(data.received_on || '');
//         setIsWorkIncome(data.is_work_income || false);
//         setNotes(data.notes || '');
//       } catch (err) {
//         console.error(err);
//         setErrors([err.response?.data?.errors?.join(', ') || err.message]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIncome();
//   }, [id, isEditMode]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const incomeData = {
//       source,
//       amount,
//       received_on: receivedOn,
//       is_work_income: isWorkIncome,
//       notes
//     };

//     try {
//       const res = isEditMode
//         ? await api.patch(`/incomes/${id}`, { income: incomeData })
//         : await api.post('/incomes', { income: incomeData });

//       navigate('/incomes');
//     } catch (err) {
//       console.error(err);
//       setErrors([err.response?.data?.errors?.join(', ') || 'Request failed.']);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>{isEditMode ? 'Edit Income' : 'Add Income'}</h2>

//       {errors.length > 0 && (
//         <div style={{ color: 'red' }}>
//           {errors.map((err, i) => <p key={i}>{err}</p>)}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Source:</label>
//           <input value={source} onChange={(e) => setSource(e.target.value)} required />
//         </div>

//         <div>
//           <label>Amount:</label>
//           <input
//             type="number"
//             step="0.01"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Received On:</label>
//           <input
//             type="date"
//             value={receivedOn}
//             onChange={(e) => setReceivedOn(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>
//             <input
//               type="checkbox"
//               checked={isWorkIncome}
//               onChange={(e) => setIsWorkIncome(e.target.checked)}
//             />
//             Work Income
//           </label>
//         </div>

//         <div>
//           <label>Notes:</label>
//           <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
//         </div>

//         <button type="submit">{isEditMode ? 'Update' : 'Save'} Income</button>
//       </form>
//     </div>
//   );
// };

// export default IncomeForm;
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const IncomeForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [receivedOn, setReceivedOn] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [isWorkIncome, setIsWorkIncome] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchIncome = async () => {
      try {
        const res = await api.get(`/incomes/${id}`);
        const data = res.data;

        setSource(data.source || '');
        setAmount(data.amount || '');
        setReceivedOn(data.received_on || '');
        setIsWorkIncome(data.is_work_income || false);
        setNotes(data.notes || '');
      } catch (err) {
        console.error(err);
        setErrors([err.response?.data?.errors?.join(', ') || err.message]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const incomeData = {
      source,
      amount,
      received_on: receivedOn,
      is_work_income: isWorkIncome,
      notes
    };

    try {
      isEditMode
        ? await api.patch(`/incomes/${id}`, { income: incomeData })
        : await api.post('/incomes', { income: incomeData });

      navigate('/incomes');
    } catch (err) {
      console.error(err);
      setErrors([err.response?.data?.errors?.join(', ') || 'Request failed.']);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditMode ? 'Edit Income' : 'Add Income'}
      </h2>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Source:</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Received On:</label>
          <input
            type="date"
            value={receivedOn}
            onChange={(e) => setReceivedOn(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isWorkIncome}
            onChange={(e) => setIsWorkIncome(e.target.checked)}
            id="workIncome"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="workIncome" className="font-medium">Work Income</label>
        </div>

        <div>
          <label className="block mb-1 font-medium">Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {isEditMode ? 'Update Income' : 'Save Income'}
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;
