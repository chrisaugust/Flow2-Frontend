import styles from './NavBar.module.css';
import { NavLink } from 'react-router-dom';

const NavBar = ({ token, onLogout }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Flow2</div>

      <div className={styles.navLinks}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
        >
          Expenses
        </NavLink>
        <NavLink
          to="/incomes"
          className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
        >
          Incomes
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
        >
          Categories
        </NavLink>
        <NavLink
          to="/monthly_reviews"
          className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
        >
          Monthly Reviews
        </NavLink>
      </div>

      {token && (
        <button className={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default NavBar;