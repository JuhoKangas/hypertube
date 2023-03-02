const MovieCard = ({ movie }) => {
  return (
    <div className='rounded-md w-52 font-montserrat text-white hover:scale-105 transition-all cursor-pointer'>
      <img
        className='rounded-md'
        src={movie.medium_cover_image}
        alt='movie poster'
      />
      <h1 className='text-lg'>{movie.title}</h1>
    </div>
  )
}

export default MovieCard
