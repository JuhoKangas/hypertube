import { useState, useEffect } from 'react'
import commentsServices from '../services/comments'
import { useLoggedUser } from '../context/UserContext'
import toast from 'react-hot-toast'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { translate } from '../dictionaries/translate'
import { useMyLanguage } from '../context/LanguageContext'

const Comments = ({ id }) => {
  const { loggedUser } = useLoggedUser()
  const [allComments, setAllComments] = useState([])
  const [newComment, setNewComment] = useState('')
	const { language } = useMyLanguage()
	const dictionary = translate(language)

  useEffect(() => {
    const getMovieComments = async (id) => {
      const comments = await commentsServices.getAllComments(id)
      if (comments) {
        setAllComments(comments.allComments)
      }
    }
    getMovieComments(id)
  }, [id])

  const handleCommentChange = (e) => {
    if (newComment.length < 420) {
      setNewComment(e.target.value)
    } else {
      setNewComment(e.target.value.slice(0, 420))
      toast.error(dictionary.long_comment)
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
    } else toast.error(dictionary.empty_comment)
  }

  return (
    <div className='z-0 font-montserrat'>
      <h1 className='mt-16 text-3xl font-semibold mb-3 ml-3'>{dictionary.comment_section}</h1>
      {Object.values(allComments)?.map((comment) => (
        <div className='text-white ml-10 mr-10' key={comment.id}>
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
          <hr className='md:w-64 w-32 h-0.5 bg-white border-0 rounded mb-0.5' />
          <div className='ml-3 mb-5'>{comment.text}</div>
        </div>
      ))}
      <h1 className='mt-10 text-xl font-semibold ml-5'>{dictionary.submit_comment}</h1>
      <div className='border-gray-300 rounded-lg border bg-white flex justify-between z-0 mb-16 ml-5 mr-10'>
        <input
          type='text'
          placeholder={dictionary.write_comment}
          className='w-full rounded-lg text-hyper-black outline-none p-2'
          value={newComment}
          onChange={handleCommentChange}
        />
        <button
          className='text-white bg-dark-red p-2 rounded-lg focus:outline-none focus:shadow-outline font-semibold text-lg cursor-pointer'
          onClick={submitNewComment}
        >
          {dictionary.submit_btn}
        </button>
      </div>
    </div>
  )
}

export default Comments
