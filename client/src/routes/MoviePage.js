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
import { Link } from 'react-router-dom'

const MoviePage = ({ id }) => {
  const [movieData, setMovieData] = useState({})
  const [allComments, setAllComments] = useState([])
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

    const getMovieComments = async (id) => {
      const comments = await commentsServices.getAllComments(id)
      if (comments) {
        setAllComments(comments.allComments)
      }
    }
    getMovieData(id)
    getMovieComments(id)
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
    const loggedUserUsername = loggedUser.username

    const comment = {
      text: newComment,
      sender: loggedUserUsername,
      movie: id,
    }

    if (comment.text !== '') {
      // store comment in db
      if (comment.text.length < 420) {
        const sentComment = await commentsServices.commentSend(comment)
        setAllComments([sentComment.data, ...allComments])
      }
      setNewComment('')
    } else toast.error('Cannot submit an empty comment')
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
          <h1 className='mt-10 text-2xl font-semibold z-0 mb-3'>Comments</h1>
          {Object.values(allComments)?.map((comment) => (
            <div className='text-white z-0' key={comment.id}>
              <div className='flex gap-3 items-baseline'>
                <Link
                  className='text-dark-red font-semibold text-lg'
                  to={`/${comment.username}`}
                >
                  {comment.username}
                </Link>
                <div className='text-xs font-thin'>
                  {moment(comment.created_at).format('hh:mm a')}
                </div>
              </div>
              <hr className='md:w-64 h-0.5 bg-white border-0 rounded mb-0.5' />
              <div className='ml-3 mb-5'>{comment.text}</div>
            </div>
          ))}
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
