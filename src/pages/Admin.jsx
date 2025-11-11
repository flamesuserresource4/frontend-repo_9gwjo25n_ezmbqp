import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

function Admin() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('pc')
  const [cover, setCover] = useState('')
  const [playUrl, setPlayUrl] = useState('')
  const [games, setGames] = useState([])
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  const user = userRaw ? JSON.parse(userRaw) : null

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      window.location.href = '/login'
    } else {
      loadGames()
    }
  }, [])

  const loadGames = async () => {
    const res = await fetch(`${baseUrl}/games`)
    const data = await res.json()
    setGames(data)
  }

  const add = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { title, description, type, cover_image_url: cover || null, play_url: playUrl, added_by_email: user.email }
      const res = await fetch(`${baseUrl}/games`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to add game. Ensure URL is embeddable (HTML5 or external host).')
      setTitle(''); setDescription(''); setCover(''); setPlayUrl(''); setType('pc')
      loadGames()
    } catch (e) {
      setError(e.message)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this game?')) return
    await fetch(`${baseUrl}/games/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    loadGames()
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-white text-2xl font-bold mb-4">Admin - Manage Games</h1>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <form onSubmit={add} className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Game title" className="bg-neutral-800 text-white p-2 rounded" required />
          <select value={type} onChange={e=>setType(e.target.value)} className="bg-neutral-800 text-white p-2 rounded">
            <option value="pc">PC</option>
            <option value="mobile">Mobile</option>
          </select>
          <input value={cover} onChange={e=>setCover(e.target.value)} placeholder="Cover image URL (optional)" className="bg-neutral-800 text-white p-2 rounded" />
          <input value={playUrl} onChange={e=>setPlayUrl(e.target.value)} placeholder="Playable URL (HTML5 game link or external host)" className="bg-neutral-800 text-white p-2 rounded" required />
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short description" className="bg-neutral-800 text-white p-2 rounded md:col-span-2" />
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded md:col-span-2">Add Game</button>
        </form>

        <h2 className="text-white text-xl font-semibold mt-6 mb-2">All Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map(g => (
            <div key={g.id} className="bg-neutral-900 p-4 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-3">
                {g.cover_image_url ? (
                  <img src={g.cover_image_url} className="w-16 h-16 object-cover rounded" />
                ) : (
                  <div className="w-16 h-16 rounded bg-neutral-800 flex items-center justify-center text-neutral-500">No Image</div>
                )}
                <div>
                  <p className="text-white font-semibold">{g.title}</p>
                  <p className="text-neutral-400 text-sm">{g.type}</p>
                </div>
                <button onClick={() => remove(g.id)} className="ml-auto text-red-400 hover:text-red-300">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Admin
