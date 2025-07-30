import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {

    const {users, getUsers, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages} = useContext(ChatContext);

    const {logout, onlineUsers} = useContext(AuthContext)
    const [input, setInput] = useState(false)

    const navigate = useNavigate()
    
    const filterUsers = input ? users.filter((user)=> user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(()=>{
        getUsers();
    },[onlineUsers])
  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
        <div className='pb-5'>
            <div className='flex justify-between items-center'>
                <img src={assets.swift_logo} alt="Not Found" className='max-w-40'/>
                <div className='py-2 group relative'>
                    <img src={assets.menu_icon} alt="Not Found" className='max-h-5 cursor-pointer'/>
                    <div className='absolute top-[90%] right-0 z-20 w-32 rounded-md p-5 bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                        <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                        <hr className='border-t my-2 border-gray-500'/>
                        <p onClick={()=> logout()} className='cursor-pointer text-sm'>Logout</p>
                    </div>
                </div>
            </div>

            <div className='flex items-center bg-[#282142] rounded-full gap-3 py-3 px-4 mt-5'>
                <img src={assets.search_icon} alt="Not Fount" className='w-3'/>
                <input onChange={(e)=> setInput(e.target.value)} type="text" placeholder='Search User...' className='bg-transparent border-none outline-none flex-1 text-white text-xs placeholder-[#c8c8c8]'/>
            </div>

        </div>

        <div className='flex flex-col'>
            {filterUsers.map((user, index)=>(
                <div onClick={()=> {setSelectedUser(user); setUnseenMessages(prev=> ({...prev, [user._id] : 0}))}} 
                key={index} className={`relative flex items-center p-2 pl-4 gap-2 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                    <img src={user?.profilePic || assets.avatar_icon} alt="Not Found" className='w-[35px] aspect-[1/1] rounded-full'/>
                    <div className='flex flex-col leading-5'>
                        <p>{user.fullName}</p>
                        {
                            onlineUsers.includes(user._id)
                            ? <span className='text-green-400 text-xs'>Online</span>
                            : <span className='text-neutral-400 text-xs'>Offline</span>
                        }
                    </div>
                    {unseenMessages[user._id] > 0 && <p className=' absolute top-4 right-4 w-5 h-5 text-xs flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
                </div>
            ))}
        </div>
    </div>
  )
}

export default Sidebar