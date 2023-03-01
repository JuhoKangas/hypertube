import axios from 'axios'

const baseUrl = 'http://localhost:3001/movies'

const getAllMovies = () => {
  return axios.get(`${baseUrl}`).then((res) => res.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAllMovies }
