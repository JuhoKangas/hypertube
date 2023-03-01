import moviesService from '../services/movies'

const Movies = () => {
  const getAllMovies = async () => {
    console.log(await moviesService.getAllMovies())
  }

  getAllMovies()

  return (
    <div>
      <h1>MOVIES HERE</h1>
    </div>
  )
}

export default Movies
