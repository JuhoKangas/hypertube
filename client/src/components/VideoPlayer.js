import ReactPlayer from 'react-player'

const VideoPlayer = ({ movieId }) => {
  return (
    <div className='z-10'>
      <ReactPlayer
        url={`http://localhost:3001/movies/stream/${movieId}`}
        autoPlay={true}
        controls
      />
    </div>
  )
}

export default VideoPlayer
