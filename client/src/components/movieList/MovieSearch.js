import { useState } from 'react'
import { useMyLanguage } from '../../context/LanguageContext'
import { translate } from '../../dictionaries/translate'

const genreList = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Film Noir',
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Short Film',
  'Sport',
  'Superhero',
  'Thriller',
  'War',
  'Western',
]

const MovieSearch = ({ onSearch, searchParams }) => {
  const { language } = useMyLanguage()
  const dictionary = translate(language)

  const [search, setSearch] = useState('')

  const handleClick = () => {
    const newSearch = {
      ...searchParams,
      query_term: search,
    }

    onSearch(newSearch)
  }

  return (
    <div className='pt-16 flex flex-col items-center'>
      <div className='flex flex-col items-center mb-20 p-8 md:px-36 md:py-24 text-white border-2 border-white rounded-2xl w-10/12 md:w-3/4'>
        <h1 onClick={handleClick} className='text-5xl font-bold'>
          {dictionary.m_movies_search}
        </h1>
        <div>
          <input
            className='bg-transparent border-2 p-2 border-white rounded-lg'
            type='text'
            placeholder='Search'
            value={search}
            onChange={({ target }) => setSearch(target.value)}
          />
          <label
            htmlFor='genre'
            className='block mb-2 text-sm font-medium text-white'
          >
            Movie Genre
          </label>
          <select
            onChange={(e) => console.log(e.target.value)}
            defaultValue='placeholder'
            id='genre'
            className='bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          >
            <option value='placeholder'>Choose a value</option>
            {genreList.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default MovieSearch
