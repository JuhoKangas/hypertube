import React from 'react'
//import { useNavigate } from 'react-router-dom'

const Landing = () => {
  //const navigate = useNavigate()
  return (
    <div className='flex flex-col h-screen bg-cover bg-landing-bg'>
      <p className='text-white font-montserrat text-center font-bold mt-16 p-5 text-4xl'>
        Watch the Latest Movies on Hypertube
      </p>
      <div className='flex flex-row'>
        <div className='flex'>
          <button className='w-28 bg-red-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline font-montserrat'>Log in</button>
        </div>
        <div>
          <button className='w-28 bg-red-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline font-montserrat'>Sign up</button>
        </div>
      </div>
    </div>
  )
}

export default Landing
