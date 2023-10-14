import React from 'react'

const UserProfile = ({params}: any) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>UserProfile {params.id}</div>
  )
}

export default UserProfile