import { useEffect, useState } from 'react'
import moviesService from '../services/movies'

import MovieCard from '../components/movieList/MovieCard'

const Movies = () => {
  const [allMovies, setAllMovies] = useState([])

  useEffect(() => {
    const getAllMovies = async () => {
      const movieData = await moviesService.getAllMovies()
      console.log(movieData)
      setAllMovies(movieData.movies)
    }
    getAllMovies()
  }, [])

  return (
    <div className='flex flex-wrap gap-16'>
      {allMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default Movies
