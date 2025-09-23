import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faUserCircle } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({ token, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `hover:bg-brand-dark hover:text-white rounded py-2 px-4 ${
      isActive ? "bg-brand text-slate-900" : "text-slate-700"
    }`;

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden sm:flex w-full justify-center items-center text-slate-700 py-6 px-5 bg-slate-50">
        <div className="container mx-auto flex justify-between items-center">

          {/* Logo on the left */}
          <div className="flex items-center space-x-4 pr-8">
            <NavLink to="/" className="text-4xl">
              💵
            </NavLink>
          </div>

          {/* Left links */}
          <div className="flex space-x-2">
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/expenses" className={navLinkClass}>Expenses</NavLink>
            <NavLink to="/incomes" className={navLinkClass}>Incomes</NavLink>
            <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
            <NavLink to="/monthly_reviews" className={navLinkClass}>Monthly Reviews</NavLink>
            <NavLink to="/wall-chart" className={navLinkClass}>Wall Chart</NavLink>
          </div>

          {/* Right links */}
          <div className="flex space-x-2">
            {token ? (
              <>
                <button
                  onClick={onLogout}
                  className="hover:bg-brand-dark hover:text-white rounded py-2 px-4 text-slate-700"
                >
                  Sign Out
                </button>
                <NavLink
                  to="/profile"
                  className="hover:bg-brand-dark hover:text-white rounded py-2 px-4 text-slate-700"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="inline w-5 h-5" />
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/login"
                className="hover:bg-brand-dark hover:text-white rounded py-2 px-4 text-slate-700"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navbar */}
      <header className="bg-brand-light sm:hidden w-full py-4 px-5 text-slate-900">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
            <NavLink to="/" className="text-4xl">
               💵
            </NavLink>
          </div>

          {/* Toggle button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            type="button"
            className="flex items-center justify-center text-slate-900"
          >
            {mobileOpen ? (
              <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile dropdown links */}
        {mobileOpen && (
          <div className="border-t-2 border-slate-300 flex flex-col w-full justify-center items-center mt-2">
            <NavLink to="/dashboard" className="hover:bg-brand-dark text-slate-700 rounded py-2 px-4 mt-2">Dashboard</NavLink>
            <NavLink to="/expenses" className="hover:bg-brand-dark text-slate-700 rounded py-2 px-4 mt-2">Expenses</NavLink>
            <NavLink to="/incomes" className="hover:bg-brand-dark text-slate-700 rounded py-2 px-4 mt-2">Incomes</NavLink>
            <NavLink to="/categories" className="hover:bg-brand-dark text-slate-700 rounded py-2 px-4 mt-2">Categories</NavLink>
            <NavLink to="/monthly_reviews" className="hover:bg-brand-dark text-slate-700 rounded py-2 px-4 mt-2">Monthly Reviews</NavLink>
            <NavLink to="/wall-chart" className="hover:bg-brand-dark text-slate-700 rounded py-2 px-4 mt-2">Wall Chart</NavLink>
            {token ? (
              <>
                <button
                  onClick={onLogout}
                  className="hover:bg-brand-dark text-slate-700 rounded py-2 px-4 mt-2"
                >
                  Sign Out
                </button>
                <NavLink
                  to="/profile"
                  className="hover:bg-brand-dark text-slate-700 rounded py-2 px-4 mt-2"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="inline w-5 h-5" />
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/login"
                className="hover:bg-brand-dark text-slate-700 rounded py-2 px-4 mt-2"
              >
                Sign In
              </NavLink>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default NavBar;
