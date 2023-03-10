const MovieHeader = ({ movieData }) => {
  return (
    <div className='z-10 p-10'>
      <h1 className='text-6xl font-bold mb-6'>{movieData.title}</h1>
      <div className='flex flex-wrap md:flex-row gap-4 text-xs max-w-fit text-center'>
        {movieData.genres.map((genre) => (
          <div className='bg-hyper-gray px-2 py-1 rounded-2xl' key={genre}>
            {genre}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MovieHeader
