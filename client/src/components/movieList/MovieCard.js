const MovieCard = ({ movie }) => {
  return (
    <div>
      <div className='rounded-md'>
        <img
          className='rounded-md'
          src={movie.medium_cover_image}
          alt='movie poster'
        />
        <h1>{movie.title_long}</h1>
      </div>
    </div>
  )
}

export default MovieCard
