import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'

const MovieInfo = ({ movieData }) => {
  const { language } = useMyLanguage()
  const dictionary = translate(language)

  return (
    <>
      <div className='z-10 px-12 ml-5'>
        <div className='flex font-bold gap-4 text-sm mb-5'>
          <div>{movieData.year}</div>
          <div>
            {movieData.runtime > 0
              ? `${movieData.runtime} min`
              : `${movieData.additionalData.Runtime}`}
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
                d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
              />
            </svg>
            {movieData.rating}
          </div>
        </div>
        <div className='flex flex-col gap-1 mb-5'>
          {dictionary.mov_cast}
          {movieData.cast?.map((member) => (
            <div key={member.name}>
              {member.name} as {member.character_name}
            </div>
          ))}
        </div>
        <div className='mb-4'>
          {dictionary.mov_director}
          {movieData.additionalData.Director}
        </div>
        <div className='mb-7'>
          {dictionary.mov_writer}
          {movieData.additionalData.Writer}
        </div>
        <div className='lg:w-1/2 mb-12'>{movieData.description_full}</div>
      </div>
    </>
  )
}

export default MovieInfo
