import { useAuth } from '../auth/AuthContext';

const Header = () => {
  const { role, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <div className="text-muted">
                <span style={{marginRight: "10px"}}>
                {role?.toUpperCase()}
                </span>

              <small>{new Date().toLocaleDateString()}</small>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div >
              {isAuthenticated ? <a onClick={logout} style={{cursor: 'pointer'}}>Logout</a> : ""}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
