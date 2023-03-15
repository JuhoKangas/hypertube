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
  const [sortAndFilter, setSortAndFilter] = useState({
    minimum_rating: 0,
    query_term: '',
    quality: 'All', //string, 720p 1080p 2160p 3D
    genre: '',
    sort_by: 'like_count', //title, year, rating
    order_by: 'desc',
  })

  useEffect(() => {
    const getAllMovies = async () => {
      const movieData = await moviesService.getFilteredMovies(sortAndFilter)
      setAllMovies(movieData.movies)
    }
    getAllMovies()
  }, [sortAndFilter])

  const fetchNextMovies = async () => {
    const newMovies = await moviesService.getNextMovies(page, sortAndFilter)
    console.log(newMovies)
    if (newMovies.movies) {
      setAllMovies(allMovies.concat(newMovies.movies))
      setPage((prev) => prev + 1)
    } else {
      setPage(10)
    }
  }

  const handleSearch = (params) => {
    setPage(2)
    setSortAndFilter(params)
  }

  return (
    <div className='bg-hyper-black'>
      <MovieSearch onSearch={handleSearch} searchParams={sortAndFilter} />
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
          <p className='text-white p-8 basis-full text-center'>
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
