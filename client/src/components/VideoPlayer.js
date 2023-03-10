import ReactPlayer from 'react-player'
//import { PlayCircleIcon } from '@heroicons/react/24/outline'

const VideoPlayer = () => {
  return (
    <div>
      <ReactPlayer
        //url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
        //playIcon={<PlayCircleIcon />}
        url={`http://localhost:3001/movies/stream/1`}
        autoPlay={true}
        controls
      />
    </div>
  )
}

export default VideoPlayer
