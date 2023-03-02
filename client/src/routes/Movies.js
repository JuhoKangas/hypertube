import { useEffect, useState } from 'react'
import moviesService from '../services/movies'
import InfiniteScroll from 'react-infinite-scroll-component'

import MovieCard from '../components/movieList/MovieCard'
import MovieSearch from '../components/movieList/MovieSearch'

const Movies = () => {
  const [allMovies, setAllMovies] = useState([])
  const [page, setPage] = useState(2)

  useEffect(() => {
    const getAllMovies = async () => {
      const movieData = await moviesService.getAllMovies()
      setAllMovies(movieData.movies)
    }
    getAllMovies()
  }, [])

  const fetchNextMovies = async () => {
    const newMovies = await moviesService.getNextMovies(page)
    setAllMovies(allMovies.concat(newMovies.movies))
    setPage((prev) => prev + 1)
  }

  return (
    <div className='bg-black'>
      <MovieSearch />
      <InfiniteScroll
        className='flex flex-wrap gap-16 justify-center px-5'
        dataLength={allMovies.length} //This is important field to render the next data
        next={fetchNextMovies}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {allMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default Movies
