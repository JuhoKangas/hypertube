import { useEffect, useState } from 'react'
import moviesServices from '../services/movies'
import VideoPlayer from '../components/VideoPlayer'
import MovieInfo from '../components/MovieInfo'
import MovieHeader from '../components/MovieHeader'
import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'

const MoviePage = ({ id }) => {
  const [movieData, setMovieData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useMyLanguage
  const dictionary = translate(language)

  useEffect(() => {
    const getMovieData = async (id) => {
      const fetchedMovieData = await moviesServices.getMovieData(id)
      setMovieData(fetchedMovieData.movie)
      setIsLoading(false)
    }
    getMovieData(id)
  }, [id])

  return (
    <div className='text-white bg-hyper-black min-h-[97vh] relative'>
      {isLoading ? (
        <div>{dictionary.m_loading}</div>
      ) : (
        <div className=' flex flex-col max-w-screen-2xl mx-auto'>
          <MovieHeader movieData={movieData} />
          <VideoPlayer />
          <MovieInfo movieData={movieData} />
        </div>
      )}
    </div>
  )
}

export default MoviePage
