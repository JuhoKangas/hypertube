import { useEffect, useState } from 'react'
import moviesService from '../services/movies'
import userService from '../services/users'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLoggedUser } from '../context/UserContext'
import toast from 'react-hot-toast'

import MovieCard from '../components/movieList/MovieCard'
import MovieSearch from '../components/movieList/MovieSearch'
import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'

const Movies = () => {
  const { language, changeLanguage } = useMyLanguage()
  const dictionary = translate(language)
  const { changeLoggedUser } = useLoggedUser()

  const [allMovies, setAllMovies] = useState([])
  const [page, setPage] = useState(1)
  // URI query params
  const [sortAndFilter, setSortAndFilter] = useState({
    minimum_rating: 0,
    query_term: '',
    quality: 'All', //string, 720p 1080p 2160p 3D
    genre: '',
    sort_by: 'like_count', //title, year, rating, like_count
    order_by: 'desc',
  })

  useEffect(() => {
    const getAllMovies = async () => {
      const movieData = await moviesService.getFilteredMovies(sortAndFilter)
      if (movieData.movie_count > 0) {
        setAllMovies(movieData.movies)
      } else {
        toast.error(dictionary.mov_not_found)
      }
    }
    getAllMovies()

    const loginFromOauth = async (token) => {
      const res = await userService.loginOauthUser(token)
      const user = res.data
      localStorage.setItem('loggedUser', JSON.stringify(user))
      changeLoggedUser(user)
      //check login worked?
      changeLanguage(user.language)
    }
    if (document.cookie) {
      const name = 'oauthLogin'
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      loginFromOauth(match[2])
      document.cookie = document.cookie + ';max-age=0'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortAndFilter])

  const fetchNextMovies = async () => {
    const newMovies = await moviesService.getNextMovies(page + 1, sortAndFilter)
    if (newMovies.movies) {
      setAllMovies(allMovies.concat(newMovies.movies))
      setPage((prev) => prev + 1)
    } else {
      setPage(10)
    }
  }

  const handleSearch = (params) => {
    setPage(1)
    setSortAndFilter(params)
  }

  return (
    <div className=''>
      <MovieSearch onSearch={handleSearch} searchParams={sortAndFilter} />
      <InfiniteScroll
        className='flex flex-wrap gap-16 justify-center px-5 py-4'
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
