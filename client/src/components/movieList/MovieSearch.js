import { useMyLanguage } from '../../context/LanguageContext'
import { translate } from '../../dictionaries/translate'

const MovieSearch = () => {
  const { language } = useMyLanguage()
  const dictionary = translate(language)
  return (
    <div className='flex justify-center pt-28 mb-20 text-white'>
      <h1 className='text-5xl font-bold'>{dictionary.m_movies_search}</h1>
    </div>
  )
}

export default MovieSearch
