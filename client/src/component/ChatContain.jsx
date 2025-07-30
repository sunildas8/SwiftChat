import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils.js'
import { ChatContext } from '../../context/ChatContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const ChatContain = () => {

  const {messages, selectedUser, setSelectedUser, sendMessages, getMessages} = useContext(ChatContext)
  const {authUser, onlineUsers} = useContext(AuthContext)
  
  const scrollEnd = useRef()
  const [input, setInput] = useState('')

  // Handle sending messages
  const handleSendMessage = async (e)=>{
    e.preventDefault();
    if(input.trim() === "") return null;
    await sendMessages({text: input.trim()});
    setInput("");
  }

  // Handle sending an image
  const handleSendImage = async (e)=>{
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file")
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async ()=>{
      await sendMessages({image: reader.result})
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(()=>{
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  useEffect(()=>{
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({behavior : "smooth"})
    }
  },[messages])

  return selectedUser ? (
    <div className='relative overflow-y-scroll h-full backdrop-blur-lg'>
      {/* -----Header----- */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-600'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="Not Found" className='w-8 rounded-full'/>
        <p className='flex items-center flex-1 text=lg text-white gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="Not Found" className='md:hidden max-w-7'/>
        <img src={assets.help_icon} alt="Not Found" className='max-md:hidden max-w-5'/>
      </div>
      {/* -----Chat area----- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index)=>(
            <div key={index} className={`flex justify-end items-end gap-2 ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
              {msg.image ? (
                <img src={msg.image} alt="Not Found" className='max-w-[200px] border border-gray-700 overflow-hidden rounded-lg mb-8'/>
              ) : (
                <p className={`max-w-[230px] p-2 md:text-sm font-light rounded-lg break-all bg-violet-500/30 mb-8 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
              )}
              <div className='text-center text-xs'>
                <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon  : selectedUser?.profilePic || assets.avatar_icon} alt="Not Found" className='w-7 rounded-full'/>
                <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          ))}
          <div ref={scrollEnd}></div>
      </div>
      {/* --------bottom-areea------- */}
      <div className='flex items-center absolute right-0 left-0 bottom-0 gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-500/12 px-3 rounded-full'>
          <input onChange={(e)=> setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder='Send a message...' className='flex-1 border-none p-3 text-sm rounded-lg outline-none text-white placeholder-gray-400'/>
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Not Found" className='w-5 mr-2 cursor-pointer'/>
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="Not Found" className='w-7 cursor-pointer'/>
      </div>

    </div>
  ) : (
    <div className='flex flex-col justify-center items-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.chat_icon} alt="Not Found" className='max-w-16'/>
      <p className='text-white text-lg font-medium'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContain