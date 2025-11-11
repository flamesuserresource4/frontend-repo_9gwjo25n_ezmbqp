import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import GameCard from '../components/GameCard'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

function Home() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeGame, setActiveGame] = useState(null)
  const query = useQuery()
  const type = query.get('type')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchGames = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/games${type ? `?type=${type}` : ''}`)
      const data = await res.json()
      setGames(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [type])

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Browse games {type ? `- ${type}` : ''}</h1>
        {loading ? (
          <p className="text-neutral-400">Loading...</p>
        ) : games.length === 0 ? (
          <p className="text-neutral-400">No games yet. Admin can add games from Admin page.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {games.map(g => (
              <GameCard key={g.id} game={g} onPlay={setActiveGame} />)
            )}
          </div>
        )}
      </main>

      {activeGame && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-neutral-900 w-full max-w-5xl h-[80vh] rounded-lg overflow-hidden flex flex-col">
            <div className="p-3 flex items-center justify-between bg-neutral-800">
              <h3 className="text-white font-semibold">{activeGame.title}</h3>
              <button onClick={() => setActiveGame(null)} className="text-white/80 hover:text-white">Close</button>
            </div>
            <iframe src={activeGame.play_url} className="flex-1 w-full bg-black" title={activeGame.title} allow="fullscreen; gamepad; accelerometer; autoplay; encrypted-media" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
