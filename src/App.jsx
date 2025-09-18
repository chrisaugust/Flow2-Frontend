import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import CategoryForm from './components/CategoryForm';
import IncomeForm from './components/IncomeForm';
import IncomesList from './components/IncomesList';
import ExpensesList from './components/ExpensesList';
import CategoriesList from './components/CategoriesList';
import CategoryExpenses from './components/CategoryExpenses';
import MonthlyReview from "./components/MonthlyReview";
import MonthlyReviewList from './components/MonthlyReviewList';
import UserProfile from './components/UserProfile';
import PasswordReset from './components/PasswordReset';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <NavBar token={token} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/signup"
          element={<Register />}
        />
        <Route
          path="/login"
          element={<Login onLogin={setToken} />}
        />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard token={token}/> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route
          path="/categories/new"
          element={token ? <CategoryForm token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/categories/:id/edit"
          element={token ? <CategoryForm token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/categories/:categoryId/expenses"
          element={token ? <CategoryExpenses token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/expenses/new"
          element={token ? <ExpenseForm token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/expenses/:id/edit"
          element={token ? <ExpenseForm token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/incomes/new"
          element={token ? <IncomeForm token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/incomes/:id/edit"
          element={token ? <IncomeForm token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/incomes"
          element={token ? <IncomesList token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/expenses"
          element={token ? <ExpensesList token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/categories"
          element={token ? <CategoriesList token={token} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/monthly_reviews" 
          element={token ? <MonthlyReviewList token={token} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/monthly_reviews/by_month_code/:month_code" 
          element={token ? <MonthlyReview token={token} />: <Navigate to="/login" />} 
        />
        <Route
          path="/profile"
          element={token ? <UserProfile token={token} />: <Navigate to="/login" />}
        />
        <Route path="/reset-password" element={<PasswordReset />} />

      </Routes>
    </Router>
  );
}

export default App;
