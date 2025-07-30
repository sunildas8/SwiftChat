import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () =>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio});
      navigate('/');
    }
  }

  

  return (
    <div className='flex items-center justify-center min-h-screen bg-cover bg-no-repeat'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-1 border-gray-500 flex justify-between items-center rounded-lg max-sm:flex-col-reverse'>
        <form onSubmit={handleSubmit} className='flex flex-1 flex-col gap-5 p-10'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="Not Found" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
            upload profile image
          </label>

          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Your Name' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>

          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='Write a profile bio' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>

          <button type='submit' className='py-2 bg-gradient-to-r from-purple-400 to-violet-600 rounded-full text-lg text-white cursor-pointer'>Save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.big_icon} alt="Not Found" />
      </div>
    </div>
  )
}

export default ProfilePage