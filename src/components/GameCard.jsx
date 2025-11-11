function GameCard({ game, onPlay }) {
  return (
    <div className="bg-neutral-900 rounded-lg overflow-hidden shadow border border-neutral-800">
      {game.cover_image_url ? (
        <img src={game.cover_image_url} alt={game.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-neutral-800 flex items-center justify-center text-neutral-400">No Image</div>
      )}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg">{game.title}</h3>
        {game.description && <p className="text-neutral-400 text-sm mt-1 line-clamp-2">{game.description}</p>}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs px-2 py-1 rounded bg-blue-700/30 text-blue-300 uppercase">{game.type}</span>
          <button onClick={() => onPlay(game)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded">Play</button>
        </div>
      </div>
    </div>
  )
}

export default GameCard
