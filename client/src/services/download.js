import axios from 'axios'

const baseUrl = 'http://localhost:3001/movies'

const startDownload = (movieId) => {
  return axios.get(`${baseUrl}/download/${movieId}`).then((res) => res.data)
}

const checkDownloaded = (movieId) => {
  return axios.get(`${baseUrl}/check/${movieId}`).then((res) => res.data)
}

const updateWatched = (movieId, loggedUserId) => {
  return axios.post(`${baseUrl}/updateWatched`, {
    movieId: movieId,
    loggedUserId: loggedUserId,
  })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { startDownload, checkDownloaded, updateWatched }
