import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import photosService from '../services/photos'

import { toast } from 'react-hot-toast'

const UserProfile = ({ socket, selectedUser }) => {
  const navigate = useNavigate()
  const [selectedUserPhotos, setSelectedUserPhotos] = useState({})

  useEffect(() => {
    const getUserPhotos = async () => {
      const userPhotos = await photosService.getUserPhotos(selectedUser.id)
      setSelectedUserPhotos(userPhotos.photos.rows)
    }
    getUserPhotos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col ml-32 mr-56 mt-20 text-white">
      <div className="flex flex-col items-center justify-center">
        <img
          src={`http://localhost:3001/uploads/dog.png`} // remove hardcoded profile photo
          className="object-cover rounded-full h-60 w-60 border border-white mb-10"
          alt="profile-pic"
        ></img>
      </div>
      <div className="flex justify-center mb-3">
        <p className="text-dark-red text-3xl">{selectedUser.username}</p>
      </div>
      <div className="flex justify-center mb-3"></div>
      <div className="flex justify-center text-xl mt-10">
        <div className="flex flex-col justify-center">
          <div className="mb-3 flex items-center">
            <div className="text-dark-red flex w-80">Name:</div>{' '}
            {selectedUser.firstname} {selectedUser.lastname}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
