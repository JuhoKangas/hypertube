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
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
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
  const [genre, setGenre] = useState('')
  const [rating, setRating] = useState(0)
  const [sortBy, setSortBy] = useState('like_count')
  const [orderBy, setOrderBy] = useState('desc')

  const handleClick = () => {
    const newSearch = {
      ...searchParams,
      query_term: search,
      genre: genre,
      minimum_rating: rating,
      sort_by: sortBy,
      order_by: orderBy,
    }

    onSearch(newSearch)
  }

  return (
    <div className='pt-16 flex flex-col items-center'>
      <div className='flex flex-col items-center mb-20 p-8 md:px-24 md:py-24 text-white border-2 border-white rounded-2xl w-10/12 md:w-3/4'>
        <h1 className='text-5xl font-bold'>{dictionary.m_movies_search}</h1>

        <div className='flex flex-col lg:flex-row lg:gap-6 mt-16 w-full xl:max-w-3xl'>
          <label
            htmlFor='genre'
            className='block text-sm font-medium text-white mb-2'
          >
            Movie Genre
          </label>
          <select
            onChange={(e) => setGenre(e.target.value)}
            defaultValue=''
            id='genre'
            className='bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          >
            <option value=''>Choose a genre</option>
            {genreList.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <label
            htmlFor='minimum_rating'
            className='block text-sm font-medium text-white mt-6 lg:mt-0 mb-2'
          >
            Minimum rating
          </label>
          <select
            onChange={(e) => setRating(e.target.value)}
            defaultValue='0'
            id='minimum_rating'
            className='bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          >
            <option value=''>Choose a value</option>
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
          </select>

          <label
            htmlFor='sort_by'
            className='block text-sm font-medium text-white mt-6 lg:mt-0 mb-2'
          >
            Sort by
          </label>
          <select
            onChange={(e) => setSortBy(e.target.value)}
            defaultValue='like_count'
            id='sort_by'
            className='bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          >
            <option value='like_count'>Like count</option>
            <option value='title'>Title</option>
            <option value='year'>Year</option>
            <option value='rating'>Rating</option>
          </select>

          <label
            htmlFor='order_by'
            className='block text-sm font-medium text-white mt-6 lg:mt-0 mb-2'
          >
            Order by
          </label>
          <select
            onChange={(e) => setOrderBy(e.target.value)}
            defaultValue='desc'
            id='order_by'
            className='bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          >
            <option value='desc'>Descending</option>
            <option value='asc'>Ascending</option>
          </select>
        </div>

        <input
          className='bg-transparent mt-10 border-2 p-2 border-white rounded-lg w-full lg:w-1/2'
          type='text'
          placeholder='Search'
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />

        <button
          onClick={handleClick}
          className='mt-10 bg-dark-red py-2 px-6 rounded-lg cursor-pointer hover:bg-dark-red/80'
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default MovieSearch
