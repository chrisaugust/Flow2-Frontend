import { useState, useEffect } from "react";
import api from "../services/api";

const MARK_OPTIONS = ["-", "0", "+"];

const MonthlyCategoryReviewItem = ({ reviewItem, categories }) => {
  const category = categories.find(c => c.id === reviewItem.category_id);

  const [formData, setFormData] = useState({
    received_fulfillment: reviewItem.received_fulfillment || "0",
    aligned_with_values: reviewItem.aligned_with_values || "0",
    would_change_post_fi: reviewItem.would_change_post_fi || "0",
  });
  const [saving, setSaving] = useState(false);

  // Auto-save on change with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        const res = await api.patch(
          `/monthly_category_reviews/${reviewItem.id}`,
          { monthly_category_review: formData }
        );

      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setSaving(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, reviewItem.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 border rounded mb-4">
      <h4 className="font-semibold">{category?.name || "Unknown Category"}</h4>
      <p>Total Spent: ${reviewItem.total_spent}</p>
      <p>Total Life Energy Hours: {reviewItem.total_life_energy_hours}</p>

      <label>
        Received Fulfillment:
        <select
          name="received_fulfillment"
          value={formData.received_fulfillment}
          onChange={handleChange}
          className="block w-full mb-2"
        >
          {MARK_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

      <label>
        Aligned With Values:
        <select
          name="aligned_with_values"
          value={formData.aligned_with_values}
          onChange={handleChange}
          className="block w-full mb-2"
        >
          {MARK_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

      <label>
        Would Change Post-FI:
        <select
          name="would_change_post_fi"
          value={formData.would_change_post_fi}
          onChange={handleChange}
          className="block w-full mb-2"
        >
          {MARK_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

      <p className="text-sm text-gray-500">{saving ? "Saving…" : "All changes saved"}</p>
    </div>
  );
};

export default MonthlyCategoryReviewItem;
