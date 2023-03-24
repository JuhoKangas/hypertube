import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoggedUser } from '../../context/UserContext'
import usersService from '../../services/users'

const MovieCard = ({ movie }) => {
  const [coverImage, setCoverImage] = useState('')
  const navigate = useNavigate()
  const { loggedUser } = useLoggedUser()
  const [hasWatched, setHasWatched] = useState(false)

  const checkIfImageExists = (url, callback) => {
    const img = new Image()
    img.src = url

    if (img.complete) {
      callback(true)
    } else {
      img.onload = () => {
        callback(true)
      }

      img.onerror = () => {
        callback(false)
      }
    }
  }

  useEffect(() => {
    checkIfImageExists(movie.large_cover_image, (exists) => {
      if (exists) {
        setCoverImage(movie.large_cover_image)
      } else {
				checkIfImageExists(movie.medium_cover_image, (exists) => {
					if (exists) {
						setCoverImage(movie.medium_cover_image)
					} else {
						setCoverImage('http://localhost:3001/uploads/dog.png')
					}
				})
      }
    })

    const checkWatched = async () => {
      const hasWatchedData = await usersService.hasWatched(
        loggedUser.id,
        movie.id
      )
      if (hasWatchedData) {
        setHasWatched(true)
      }
    }
    checkWatched()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    navigate(`/movies/${movie.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className='rounded-md w-96 text-white hover:scale-105 transition-all cursor-pointer group'
    >
      <div className='relative w-full h-full'>
        <img className='rounded-lg w-full h-full' src={coverImage} alt='' />
        <div
          className={`absolute flex flex-col justify-end gap-4 w-full h-full bottom-0 transition-all rounded-lg p-8 ${
            hasWatched
              ? 'bg-black/70'
              : 'bg-gradient-to-t from-black/70 opacity-0 group-hover:opacity-100'
          }`}
        >
          {hasWatched ? (
            <div className='m-auto'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={0.5}
                stroke='currentColor'
                className='w-56 h-56 text-white/50'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </div>
          ) : (
            <>
              <div className='text-xl font-bold'>{movie.title}</div>
              <div className='flex gap-3'>
                <div className=''>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4 inline-block align-[-2px] mr-1'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
                    />
                  </svg>
                  {movie.rating}
                </div>
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4 inline-block align-[-2px] mr-1'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  {movie.runtime} min
                </div>
                <div>{movie.year}</div>
              </div>
              <div className='line-clamp-4'>{movie.synopsis}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
