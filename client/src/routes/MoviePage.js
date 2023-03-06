import { useEffect, useState } from 'react'
import moviesServices from '../services/movies'

const MoviePage = ({ id }) => {
  const [movieData, setMovieData] = useState({})

  useEffect(() => {
    const getMovieData = async (id) => {
      const fetchedMovieData = await moviesServices.getMovieData(id)
      setMovieData(fetchedMovieData)
    }
    getMovieData(id)
  }, [id])

  console.log(movieData)

  return (
    <div>
      <h1>MOVIEPAGE</h1>
    </div>
  )
}

export default MoviePage
