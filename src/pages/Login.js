import React,{useEffect, useState} from 'react'
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai'
import {auth} from '../config/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate=useNavigate()
    const [val,setVal]=useState({
        email:'',
        password:''
    })
    const handleLogin=async(e)=>{
        e.preventDefault()
        await signInWithEmailAndPassword(auth,val.email,val.password)
        .then(res=>{
            localStorage.setItem('user',JSON.stringify(res.user.email))
            if(res.user.email) navigate('/home')
        })
        .catch(err=>console.log(err))
    }
    useEffect(()=>{
        localStorage.removeItem('user')
    },[])   
  return (
    <form className='w-2/4 bg-gray-50 shadow-md py-5 mt-14 mx-auto flex flex-col space-y-5 text-center' onSubmit={handleLogin} >
        <span className='text-2xl font-semibold text-blue-500 uppercase'>Quiz App</span>
        <input type="text" placeholder='Email Address' name='email' onChange={(e)=>setVal({...val,[e.target.name]:e.target.value})} className='sm:w-3/4 md:w-2/4 border py-2 indent-2 mx-auto rounded-md shadow-md outline-none'/>
        <div className='relative'>
            <input type="password" placeholder='Password' name='password' onChange={(e)=>setVal({...val,[e.target.name]:e.target.value})} className='sm:w-3/4 md:w-2/4 border py-2 indent-2 mx-auto rounded-md shadow-md outline-none'/>
            
        </div>
        <button type='submit' className='w-1/4 bg-blue-600 rounded-md py-2 mx-auto hover:bg-blue-400 text-white cursor-pointer'>Login</button>
    </form>
  )
}

export default Login