import { useState, useEffect } from 'react'

const MovieCard = ({ movie }) => {
  const [coverImage, setCoverImage] = useState('')

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
        setCoverImage(movie.medium_cover_image)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='rounded-md w-96 font-montserrat text-white hover:scale-105 transition-all cursor-pointer group'>
      <div className='relative w-full h-full'>
        <img className='rounded-lg w-full h-full' src={coverImage} alt='' />
        <div className='absolute flex flex-col justify-end bg-gradient-to-t from-black/70 gap-4 w-full h-full opacity-0 bottom-0 group-hover:opacity-100 transition-all rounded-lg p-8'>
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
        </div>
      </div>
    </div>
  )
}

export default MovieCard
