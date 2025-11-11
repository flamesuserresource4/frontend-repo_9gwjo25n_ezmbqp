import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  const user = userRaw ? JSON.parse(userRaw) : null

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="bg-black text-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          dark mod hanan
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:text-blue-300">Home</Link>
          <Link to="/?type=pc" className="hover:text-blue-300">PC Games</Link>
          <Link to="/?type=mobile" className="hover:text-blue-300">Mobile Games</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-blue-300">Admin</Link>
          )}
          {token ? (
            <button onClick={logout} className="ml-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Logout</button>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
