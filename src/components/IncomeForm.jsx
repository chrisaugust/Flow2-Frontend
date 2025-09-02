// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';

// const IncomeForm = ({ token }) => {
//   const { id } = useParams();
//   const isEditMode = Boolean(id);

//   const [source, setSource] = useState('');
//   const [amount, setAmount] = useState('');
//   const [receivedOn, setReceivedOn] = useState(
//     isEditMode ? '' : new Date().toISOString().slice(0, 10)
//   );
//   const [isWorkIncome, setIsWorkIncome] = useState(false);
//   const [notes, setNotes] = useState('');
//   const [errors, setErrors] = useState([]);
//   const [loading, setLoading] = useState(isEditMode);
  
//   const navigate = useNavigate();

//   // Fetch existing income if editing
//   useEffect(() => {
//     const fetchIncome = async () => {
//       try {
//         const res = await fetch(`http://localhost:3000/incomes/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         if (!res.ok) throw new Error('Failed to load income');

//         const data = await res.json();

//         setSource(data.source || '');
//         setAmount(data.amount || '');
//         setReceivedOn(data.received_on || '');
//         setIsWorkIncome(data.is_work_income || false);
//         setNotes(data.notes || '');
//       } catch (err) {
//         setErrors([err.message]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isEditMode) fetchIncome();
//   }, [id, token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const incomeData = {
//       source,
//       amount,
//       received_on: receivedOn,
//       is_work_income: isWorkIncome,
//       notes
//     };
//     const method = isEditMode ? 'PATCH' : 'POST';
//     const url = isEditMode
//       ? `http://localhost:3000/incomes/${id}`
//       : 'http://localhost:3000/incomes';
//     try {

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ income: incomeData })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         navigate('/incomes');
//       } else {
//         setErrors(data.errors || ['Something went wrong.']);
//       }
//     } catch (err) {
//       setErrors(['Request failed.']);
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

  // Fetch existing income if editing
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
      const res = isEditMode
        ? await api.patch(`/incomes/${id}`, { income: incomeData })
        : await api.post('/incomes', { income: incomeData });

      navigate('/incomes');
    } catch (err) {
      console.error(err);
      setErrors([err.response?.data?.errors?.join(', ') || 'Request failed.']);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{isEditMode ? 'Edit Income' : 'Add Income'}</h2>

      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Source:</label>
          <input value={source} onChange={(e) => setSource(e.target.value)} required />
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Received On:</label>
          <input
            type="date"
            value={receivedOn}
            onChange={(e) => setReceivedOn(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isWorkIncome}
              onChange={(e) => setIsWorkIncome(e.target.checked)}
            />
            Work Income
          </label>
        </div>

        <div>
          <label>Notes:</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <button type="submit">{isEditMode ? 'Update' : 'Save'} Income</button>
      </form>
    </div>
  );
};

export default IncomeForm;
