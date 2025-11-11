import { useState } from 'react'
import Navbar from '../components/Navbar'

function Auth() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        const res = await fetch(`${baseUrl}/auth/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })
        if (!res.ok) throw new Error('Registration failed')
        // After register, login
      }
      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)
      const res = await fetch(`${baseUrl}/auth/login`, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      const me = await fetch(`${baseUrl}/auth/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
      const user = await me.json()
      localStorage.setItem('user', JSON.stringify(user))
      window.location.href = '/'
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
          <h1 className="text-white text-2xl font-bold mb-4">{mode === 'login' ? 'Login' : 'Create account'}</h1>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <form onSubmit={submit} className="space-y-3">
            {mode === 'register' && (
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full bg-neutral-800 text-white p-2 rounded" required />
            )}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-neutral-800 text-white p-2 rounded" required />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full bg-neutral-800 text-white p-2 rounded" required />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">{mode === 'login' ? 'Login' : 'Register'}</button>
          </form>
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-4 text-blue-300 hover:text-blue-200 text-sm">
            {mode === 'login' ? "Don't have an account? Register" : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
