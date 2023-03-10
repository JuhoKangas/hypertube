import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'

const MovieInfo = ({ movieData }) => {
  const { language } = useMyLanguage()
  const dictionary = translate(language)
  console.log(movieData)

  return (
    <>
      <img
        className='absolute top-0 z-0 w-full min-w-[1200px]'
        src={movieData.background_image}
        alt=''
      />
      <div className='z-10 p-10'>
        <div>{movieData.year}</div>
        <div>{movieData.runtime}</div>
        <div>{movieData.rating}</div>
        <div className='flex flex-col gap-2'>
          {dictionary.mov_cast}
          {movieData.cast.map((member) => (
            <div key={member.name}>
              {member.name} as {member.character_name}
            </div>
          ))}
        </div>
        <div>{movieData.description_full}</div>
      </div>
    </>
  )
}

export default MovieInfo
