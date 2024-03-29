import axios from 'axios'

const baseUrl = 'http://localhost:3001/comments'

const commentSend = (comment) => {
  return axios.post(baseUrl, comment).then((res) => res.data)
}

const getAllComments = (id) => {
  return axios.get(baseUrl, { params: { id: id }}).then((res) => res.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { commentSend, getAllComments }
