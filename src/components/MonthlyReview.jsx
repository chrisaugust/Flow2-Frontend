import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonthlyCategoryReviewItem from "./MonthlyCategoryReviewItem";
import api from "../services/api";

const MonthlyReview = () => {
  const { month_code } = useParams();
  const [review, setReview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchReviewAndCategories = async () => {
    setLoading(true);
    try {
      const [catRes, reviewRes] = await Promise.all([
        api.get("/categories"),
        api.get(`/monthly_reviews/by_month_code/${month_code}`),
      ]);

      setCategories(catRes.data);
      setReview(reviewRes.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching review:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewAndCategories();
  }, [month_code]);

  const saveNotes = useCallback(
    async (newNotes) => {
      if (!review) return;
      try {
        setSaving(true);
        const res = await api.patch(`/monthly_reviews/${review.id}`, {
          notes: newNotes,
        });
        setReview(res.data);
      } catch (err) {
        console.error("Error saving notes:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setSaving(false);
      }
    },
    [review]
  );

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setReview(prev => ({ ...prev, notes: newNotes }));
    saveNotes(newNotes);
  };

  const handleRebuild = async () => {
    try {
      await api.post(`/monthly_reviews/${review.id}/rebuild`);
      fetchReviewAndCategories();
    } catch (err) {
      console.error("Error rebuilding review:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleToggleComplete = async () => {
    try {
      const res = await api.patch(`/monthly_reviews/${review.id}`, {
        notes: review.notes,
        completed: !review.completed,
      });
      setReview(res.data);
      if (res.data.completed) {
        navigate("/monthly_reviews");
      }
    } catch (err) {
      console.error("Error saving review:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p>Loading monthly review...</p>;
  if (error) return <p>{error}</p>;
  if (!review) return <p>No review found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Monthly Review: {review.month_start || month_code}
      </h1>

      <div className="mb-4">
        <p><strong>Total Income:</strong> ${review.total_income}</p>
        <p><strong>Total Expenses:</strong> ${review.total_expenses}</p>
        {review.user && (
          <p>
            <strong>
              Hourly Wage: ${parseFloat(review.user.hourly_wage).toFixed(2)}
            </strong>
          </p>
        )}
      </div>

      <button
        onClick={handleRebuild}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Rebuild Review
      </button>
      <hr></hr>
      <p>In reviewing the following category totals, ask yourself these three questions:</p>
      <p>1) Did I exchange my life energy for a proportional amount of fulfillment, satisfaction, and value?</p>
      <p>2) Is this expenditure of life energy aligned with my values and life purpose?</p>
      <p>3) How might this pattern of spending change if I were financially independent (FI), and did not need to work for a living? In other words, would it change post-FI?</p>
      <p>In answering these questions, mark a '-' to indicate that the value or fulfillment received was not proportional to the life energy spent, or if the spending was not in alignment with values and purpose, or if you would spend less in this category post-FI.</p>
      <p>Mark a '+' if increasing spending would provide more value/fulfillment, would demonstrate greater personal alignment, or would increase post-FI.</p>
      <p>Mark a '0' if spending for the category is fine as it currently stands.</p>
      <hr></hr>
      <h3 className="mt-6 text-xl font-semibold">Category Reviews:</h3>
      {review.monthly_category_reviews.map((catReview) => (
        <MonthlyCategoryReviewItem
          key={catReview.id}
          reviewItem={catReview}
          categories={categories}
        />
      ))}

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Notes</h2>
        <textarea
          className="w-full p-2 border rounded"
          rows="6"
          value={review.notes || ""}
          onChange={handleNotesChange}
          placeholder="Write your notes here..."
        />
        {saving && <p className="text-sm text-gray-500">Saving...</p>}
      </div>

      <button
        onClick={handleToggleComplete}
        className={`mt-2 px-4 py-2 rounded ${
          review.completed ? "bg-green-500 text-white" : "bg-gray-300 text-black"
        }`}
        disabled={review.completed}
      >
        {review.completed ? "Completed" : "Mark Complete"}
      </button>
    </div>
  );
};

export default MonthlyReview;
