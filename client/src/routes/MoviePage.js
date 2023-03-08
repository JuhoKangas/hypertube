import { useEffect, useState } from 'react'
import moviesServices from '../services/movies'
import VideoPlayer from '../components/VideoPlayer'

const MoviePage = ({ id }) => {
  const [movieData, setMovieData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getMovieData = async (id) => {
      const fetchedMovieData = await moviesServices.getMovieData(id)
      setMovieData(fetchedMovieData.movie)
      setIsLoading(false)
    }
    getMovieData(id)
  }, [id])

  console.log(movieData)

  return (
    <div className='flex flex-col'>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <div>
          <h1>{movieData.title}</h1>
          <div>{movieData.year}</div>
          <div>{movieData.runtime}</div>
          <div>{movieData.rating}</div>
          <div>{movieData.description_full}</div>
          <img src={movieData.background_image} alt='background' />
          <VideoPlayer />
          <div>
            genres:
            {movieData.genres.map((genre) => (
              <div key={genre}>{genre}</div>
            ))}
          </div>
          <div className='flex flex-col'>
            url to download:{' '}
            {movieData.torrents.map((torrent) =>
              torrent.quality !== '3D' ? (
                <div key={torrent.url}>
                  {torrent.url} {torrent.quality} {torrent.type}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MoviePage
