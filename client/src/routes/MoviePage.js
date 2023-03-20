import { useEffect, useState } from 'react'
import moviesServices from '../services/movies'
import VideoPlayer from '../components/VideoPlayer'
import MovieInfo from '../components/MovieInfo'
import MovieHeader from '../components/MovieHeader'
import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'
import toast from 'react-hot-toast'
import { useLoggedUser } from '../context/UserContext'
import commentsServices from '../services/comments'
import moment from 'moment'

const MoviePage = ({ id }) => {
  const [movieData, setMovieData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const { language } = useMyLanguage
  const dictionary = translate(language)
  const { loggedUser } = useLoggedUser()

  useEffect(() => {
    const getMovieData = async (id) => {
      const fetchedMovieData = await moviesServices.getMovieData(id)
      setMovieData(fetchedMovieData.movie)
      setIsLoading(false)
    }
    getMovieData(id)
  }, [id])

  const handleCommentChange = (e) => {
    if (newComment.length < 420) {
      setNewComment(e.target.value)
    } else {
      setNewComment(e.target.value.slice(0, 420))
      toast.error('The comment is too long')
    }
  }

  const submitNewComment = async (e) => {
    e.preventDefault()
    const loggedUserId = loggedUser.id

    const comment = {
      text: newComment,
      sender: loggedUserId,
      movie: id,
    }

    if (comment.text !== '') {
      // store comment in db
      const sentComment = await commentsServices.commentSend(comment)
      console.log('Comment info', sentComment)
      setNewComment('')
    } else toast.error('Cannot send an empty comment')
  }

  return (
    <div className='text-gray-300 bg-hyper-black min-h-[97vh] relative'>
      {isLoading ? (
        <div>{dictionary.m_loading}</div>
      ) : (
        <div className='flex flex-col max-w-screen-2xl mx-auto'>
          <MovieHeader movieData={movieData} />
          <MovieInfo movieData={movieData} />
          <VideoPlayer />
          <h1 className='mt-10 text-xl font-semibold z-0'>Submit a Comment</h1>
          <div className='border-gray-300 rounded-lg border bg-white flex justify-between font-montserrat z-0 m-5'>
            <input
              type='text'
              placeholder='Write a comment'
              className='w-full rounded-lg text-hyper-black outline-none p-2'
              value={newComment}
              onChange={handleCommentChange}
            />
            <button
              className='text-white bg-dark-red p-2 rounded-lg focus:outline-none focus:shadow-outline font-montserrat font-semibold text-lg cursor-pointer'
              onClick={submitNewComment}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MoviePage
