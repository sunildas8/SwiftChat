import React, { useContext, useState } from 'react'
import Sidebar from '../component/Sidebar'
import ChatContain from '../component/ChatContain'
import RightSidebar from '../component/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext)

  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl h-[100%] overflow-hidden grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <Sidebar />
        <ChatContain />
        <RightSidebar />
      </div>
    </div>
  )
}

export default HomePage