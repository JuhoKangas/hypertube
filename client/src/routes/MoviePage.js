import { useEffect, useState } from 'react'
import moviesServices from '../services/movies'
import VideoPlayer from '../components/VideoPlayer'
import MovieInfo from '../components/MovieInfo'
import MovieHeader from '../components/MovieHeader'
import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'
import downloadService from '../services/download'
import toast from 'react-hot-toast'
import { useLoggedUser } from '../context/UserContext'
import Comments from '../components/Comments'

const MoviePage = ({ id }) => {
  const [movieData, setMovieData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setDownloading] = useState(false)
  const { language } = useMyLanguage()
  const dictionary = translate(language)
  const { loggedUser } = useLoggedUser()
	console.log(language)

  useEffect(() => {
    const getMovieData = async (id) => {
      const fetchedMovieData = await moviesServices.getMovieData(id)
      console.log(fetchedMovieData)
      setMovieData(fetchedMovieData)
      setIsLoading(false)
    }
    getMovieData(id)
  }, [id])

  const downloadMovie = async () => {
    const downloaded = await downloadService.checkDownloaded(id)
    if (downloaded.rowCount === 0) {
      const response = await downloadService.startDownload(id)
      if (response.error) {
        toast.error(dictionary.e_unexpected)
      } else {
        setDownloading(true)
      }
    } else {
      setDownloading(true)
    }

    if (loggedUser.id) {
      downloadService.updateWatched(id, loggedUser.user_id)
    }
  }

  return (
    <div className='text-gray-300 bg-hyper-black min-h-[97vh] relative overflow-x-hidden'>
      {isLoading ? (
        <div>{dictionary.m_loading}</div>
      ) : (
        <>
          <img
            className='absolute h-[97vh]'
            src={movieData.background_image}
            alt=''
          />
          <div className='flex flex-col max-w-screen-2xl mx-auto'>
            <MovieHeader movieData={movieData} />
            <MovieInfo movieData={movieData} />
            {isDownloading ? (
              <VideoPlayer movieId={id} />
            ) : (
              <p className='text-gray-300 z-10' onClick={downloadMovie}>
                Not yet Downloading, button here :D
              </p>
            )}
            <Comments id={id} />
            {/*           <div className='mt-40'> 
            <Comments id={id} />
          </div> */}
          </div>
        </>
      )}
    </div>
  )
}

export default MoviePage
