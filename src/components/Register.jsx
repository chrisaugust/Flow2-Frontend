import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/signup", {
        user: {
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (onRegister) onRegister(res.data.token); // optional callback
        navigate("/dashboard");
      } else {
        setError(res.data?.errors?.join(", ") || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.join(", ") : err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Confirm Password</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Register;
