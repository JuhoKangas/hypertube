import axios from 'axios'

const baseUrl = 'http://localhost:3001/users'
const loginUrl = 'http://localhost:3001/login'
const settingsUrl = 'http://localhost:3001/settings'
const uploadUrl = 'http://localhost:3001/photos'
const uploadPicUrl = 'http://localhost:3001/upload'

const create = (newUser) => {
  return axios.post(baseUrl, newUser)
}

const uploadPhoto = (imageData) => {
  return axios.post(uploadPicUrl, imageData)
}

const loginUser = (username, password) => {
  return axios.post(
    loginUrl,
    {
      username,
      password,
    },
    { withCredentials: true }
  )
}

const loginOauthUser = (token) => {
  return axios.post(
    `${loginUrl}/oauth`,
    {
      token,
    },
    { withCredentials: true }
  )
}

const update = (updatedUserInfo) => {
  return axios.put(settingsUrl, updatedUserInfo, { withCredentials: true })
}

const upload = (userPhoto) => {
  return axios.post(uploadUrl, userPhoto, { withCredentials: true })
}

const getUserByUsername = (username) => {
  return axios.get(`${baseUrl}/user/${username}`)
}

const getUserData = (selectedUser) => {
  return axios.get(`${baseUrl}/selected/${selectedUser}`)
}

const hasWatched = (userId, ytsId) => {
  return axios
    .get(`http://localhost:3001/movies/watched/${userId}/${ytsId}`)
    .then((res) => res.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  create,
  loginUser,
  update,
  getUserByUsername,
  upload,
  uploadPhoto,
  loginOauthUser,
  getUserData,
  hasWatched,
}
