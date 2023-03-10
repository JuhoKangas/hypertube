import { useEffect, useState } from 'react'
import moviesService from '../services/movies'
import InfiniteScroll from 'react-infinite-scroll-component'

import MovieCard from '../components/movieList/MovieCard'
import MovieSearch from '../components/movieList/MovieSearch'
import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'

const Movies = () => {
  const { language } = useMyLanguage()
  const dictionary = translate(language)

  const [allMovies, setAllMovies] = useState([])
  const [page, setPage] = useState(2)
  // URI query params
  const [minimumRating, setMinimumRating] = useState(0)
  const [queryTerm, setQueryTerm] = useState('')
  const [genre, setGenre] = useState('')
  const [sorting, setSorting] = useState('')

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
    <div className='bg-hyper-black'>
      <MovieSearch />
      <InfiniteScroll
        className='flex flex-wrap gap-16 justify-center px-5 pt-4'
        dataLength={allMovies.length} //This is important field to render the next data
        next={fetchNextMovies}
        hasMore={page < 10 ? true : false}
        loader={
          <h4 className='text-white text-2xl w-screen p-6 text-center'>
            {dictionary.m_loading}
          </h4>
        }
        endMessage={
          <p className='text-white p-8'>
            <b>{dictionary.m_page_end}</b>
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
