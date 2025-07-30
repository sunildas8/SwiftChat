import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])

  // Get all the images from the messages set them to state

  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  },[messages])

  return selectedUser && (
    <div className={`bg-[8185B2]/10 w-full relative text-white overflow-y-hidden ${selectedUser ? "max-md:hidden" : ""}`}>
       <div className='flex flex-col items-center pt-16 mx-auto text-xs font-light gap-2'>
          <img src={selectedUser.profilePic || assets.avatar_icon} alt="Not Found" className='w-20 aspect-[1/1] rounded-full'/>
          <h1 className='flex items-center mx-auto px-10 font-medium text-xl gap-2'>
            {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
            {selectedUser.fullName}
          </h1>
          <p className='px-10 mx-auto'>{selectedUser.bio}</p>
       </div>

       <hr className='border-[#ffffff50] my-4'/>

      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='max-h-[200px] mt-2 overflow-y-hidden grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url, index)=>(
            <div key={index} onClick={()=>window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="Not Found" className='h-full rounded-md'/>
            </div>
          ))}
      </div>
     </div>

    <div onClick={()=> logout()} className='absolute bottom-5 left-1/2 transform -translate-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none font-light text-sm py-2 px-20 rounded-full cursor-pointer'>
      Logout
    </div>
    
    </div>
  )
}

export default RightSidebar