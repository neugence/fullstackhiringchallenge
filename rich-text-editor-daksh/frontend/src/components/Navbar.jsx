import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          AI Resume Platform
        </Link>
        
        {isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/resume-review" className="navbar-link">Resume Review</Link>
            <Link to="/job-match" className="navbar-link">Job Match</Link>
            <div className="navbar-user">
              <span>{user?.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
