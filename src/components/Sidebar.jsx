import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logout, role } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-gem" style={{ fontSize: '28px', color: '#6366f1' }}></i>
          <div>
            <h5 className="mb-0">Antiques</h5>
            <small className="text-muted">Admin Panel</small>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>

          <li className='nav-item'>
            <Link
            to="/lots"
            className={`nav-link ${isActive('/lots') ? 'active' : ''}`}
            >
              Lots
            </Link>
          </li>

          {role === 'admin' && (
            <li className="nav-item">
              <Link
                to="/users"
                className={`nav-link ${isActive('/users') ? 'active' : ''}`}
              >
                Users
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer mt-auto">
        <button 
          onClick={logout}
          className="btn btn-light w-100"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
