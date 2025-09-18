// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../services/api';

// const MONTH_NAMES = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// const MonthlyReviewList = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const formatMonthCode = (monthCode) => {
//     const month = parseInt(monthCode.slice(0, 2), 10);
//     const year = monthCode.slice(2);
//     const monthName = MONTH_NAMES[month - 1] || 'Unknown';
//     return `${monthName} ${year}`;
//   };

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const res = await api.get('/monthly_reviews');
//         const sorted = res.data.sort((a, b) => b.month_code.localeCompare(a.month_code));
//         setReviews(sorted);
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, []);

//   if (loading) return <p>Loading monthly reviews...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error}</p>;
//   if (reviews.length === 0) return <p>No reviews to display</p>;

//   return (
//     <div>
//       <h2>Monthly Reviews</h2>
//       <ul>
//         {reviews.map(review => (
//           <li key={review.id}>
//             <Link to={`/monthly_reviews/by_month_code/${review.month_code}`}>
//               {formatMonthCode(review.month_code)}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MonthlyReviewList;
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

  if (loading) return <p className="text-gray-500">Loading monthly reviews...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (reviews.length === 0) return <p className="text-gray-500">No reviews to display</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Monthly Reviews</h2>
      <ul className="space-y-2">
        {reviews.map((review) => (
          <li key={review.id}>
            <Link
              to={`/monthly_reviews/by_month_code/${review.month_code}`}
              className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-md transition text-blue-600 font-medium"
            >
              {formatMonthCode(review.month_code)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyReviewList;
