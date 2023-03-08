import ReactPlayer from 'react-player'
//import { PlayCircleIcon } from '@heroicons/react/24/outline'

const VideoPlayer = () => {
  return (
    <div>
      <ReactPlayer
        url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
        //playIcon={<PlayCircleIcon />}
        autoPlay={true}
        controls
      />
    </div>
  )
}

export default VideoPlayer
