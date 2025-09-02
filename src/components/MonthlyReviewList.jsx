import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthlyReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatMonthCode = (monthCode) => {
    const month = parseInt(monthCode.slice(0, 2), 10);
    const year = monthCode.slice(2);
    const monthName = MONTH_NAMES[month - 1] || 'Unknown';
    return `${monthName} ${year}`;
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/monthly_reviews');
        const sorted = res.data.sort((a, b) => b.month_code.localeCompare(a.month_code));
        setReviews(sorted);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p>Loading monthly reviews...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (reviews.length === 0) return <p>No reviews to display</p>;

  return (
    <div>
      <h2>Monthly Reviews</h2>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <Link to={`/monthly_reviews/by_month_code/${review.month_code}`}>
              {formatMonthCode(review.month_code)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyReviewList;
