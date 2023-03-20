import axios from 'axios'

const baseUrl = 'http://localhost:3001/movies'

const getAllMovies = () => {
  return axios.get(`${baseUrl}`).then((res) => res.data)
}

const getFilteredMovies = (queryParams) => {
  return axios.post(baseUrl, queryParams).then((res) => res.data)
}

const getNextMovies = (page, queryParams) => {
  return axios
    .post(`${baseUrl}/page/${page}`, queryParams)
    .then((res) => res.data)
}

const getMovieData = (id) => {
  return axios.get(`${baseUrl}/id/${id}`).then((res) => res.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAllMovies, getNextMovies, getMovieData, getFilteredMovies }
