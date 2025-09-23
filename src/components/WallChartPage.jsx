import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import WallChartGraph from './WallChartGraph';

const WallChartPage = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API calls
        const [catRes, expRes, incRes] = await Promise.all([
          api.get('/categories'),
          api.get('/expenses'),
          api.get('/incomes')
        ]);
        setCategories(catRes.data);
        setExpenses(expRes.data);
        setIncomes(incRes.data);
      } catch (err) {
        console.error('Failed to fetch Wall Chart data:', err);
        // Optional: navigate to login if unauthorized
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);
  //   useEffect(() => {
  //   // TEMPORARY MOCK DATA for testing
  //   const mockCategories = [
  //     { id: 1, name: 'Food' },
  //     { id: 2, name: 'Rent' },
  //     { id: 3, name: 'Transportation' },
  //     { id: 4, name: 'Entertainment' },
  //   ];

  //   const mockExpenses = [
  //     { id: 1, category_id: 1, amount: '200', occurred_on: '2025-07-05' },
  //     { id: 2, category_id: 2, amount: '1200', occurred_on: '2025-07-01' },
  //     { id: 3, category_id: 1, amount: '180', occurred_on: '2025-08-03' },
  //     { id: 4, category_id: 3, amount: '60', occurred_on: '2025-08-10' },
  //     { id: 5, category_id: 4, amount: '100', occurred_on: '2025-09-12' },
  //     { id: 6, category_id: 1, amount: '200', occurred_on: '2025-09-15'}
  //   ];

  //   const mockIncomes = [
  //     { id: 1, amount: '3000', received_on: '2025-07-01' },
  //     { id: 2, amount: '3200', received_on: '2025-08-01' },
  //     { id: 3, amount: '3100', received_on: '2025-09-01' },
  //   ];

  //   // Set the mock data
  //   setCategories(mockCategories);
  //   setExpenses(mockExpenses);
  //   setIncomes(mockIncomes);

  //   setLoading(false);
  // }, []);

  if (loading) return <p>Loading Wall Chart data...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Wall Chart</h1>
      <WallChartGraph expenses={expenses} incomes={incomes} categories={categories} />
    </div>
  );
};

export default WallChartPage;
