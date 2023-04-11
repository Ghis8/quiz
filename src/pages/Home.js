import React, {useState, useEffect, useRef } from 'react'
import {BsPersonCircle} from 'react-icons/bs'
import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, documentId, getDocs,deleteDoc,updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import {AiOutlineEdit} from 'react-icons/ai'
import {AiOutlineArrowLeft,AiOutlinePlusSquare} from 'react-icons/ai'
import {FaTrash} from 'react-icons/fa'

function Home() {
    const [user,setUser]=useState('')
    const [createQuiz,setCreateQuiz]=useState(false)
    const [takeQuiz,setTakeQuiz]=useState(true)
    const [question,setQuestion]=useState({
        qst:'',
        ans:[],
        correctAns:''
    })
    const [editQuiz,setEditQuiz]=useState(false)
    const [selected,setSelected]=useState(false)
    const [choosedQuiz,setChoosedQuiz]=useState(null)
    const navigate=useNavigate()
    const [val,setVal]=useState({
        title:'',
        description:'',
        time:0,
        numberOfQuestions:'',
        questions:[]
    })
    const questionRef=useRef()
    const answersRef=useRef()
    const correctAnsRef=useRef()



    const [quizzes,setQuizzes]=useState(null)
    const [score,setScore]=useState(0)
    const [currentQuestion,setCurrentQuestion]=useState(0)
    let questionCount=0;
    const quizRef=collection(db,'quiz')
    const getQuizzes=async()=>{
        try {
            const data=await getDocs(quizRef)
            const filteredData=data.docs.map(doc=>({...doc.data(),id:doc.id}))
            setQuizzes(filteredData)
        } catch (error) {
            console.log(error)
        }
    }
    const quizCreation=(e)=>{
        e.preventDefault()
        console.log(val)

    }
    useEffect(()=>{
        getQuizzes()
        const str=JSON.parse(localStorage.getItem('user'))
        setUser(str)
        
    },[])
    
  return (
    <div className='h-screen scrollbar-hide'>
        {/* Navbar */}
        <div className='flex items-center justify-between sticky top-0 z-10 bg-black text-white py-4 px-5 shadow-md'>
            <span className='text-2xl font-bold'>Quiz App</span>
            <div className='flex items-center space-x-16'>
                <div className='flex items-center space-x-5'>
                    <span onClick={()=>{
                        setCreateQuiz(true)
                        setTakeQuiz(false)
                    }} className={createQuiz?'text-blue-600 font-semibold  cursor-pointer':'text-gray-600  hover:text-blue-300 cursor-pointer'}>Create Quiz</span>
                    <span onClick={()=>{
                        setTakeQuiz(true)
                        setCreateQuiz(false)
                        }} className={takeQuiz?'text-blue-600 font-semibold  cursor-pointer':'text-gray-600  hover:text-blue-300 cursor-pointer'}>Take Quiz</span>
                </div>
                <div onClick={()=>{
                    signOut(auth)
                    navigate('/')
                    }} className='flex items-center space-x-2  cursor-pointer'>
                    <span className='text-gray-400'>{user}</span>
                    <BsPersonCircle className='text-2xl text-blue-600'/>
                </div>
            </div>
        </div>
        
        {/* End of navbar */}

        {
            createQuiz ? (
                <div className='mt-2 mx-5 overflow-y-auto scrollbar-hide w-2/4 py-5 h-5/6'>
                    <span className=' font-semibold text-2xl'>Create A Quiz</span>
                    <form className='mt-5 flex flex-col space-y-5'>
                        <div className='flex items-center space-x-5'>
                            <span>Title:</span>
                            <input type="text" className='border py-2 indent-2 rounded-md w-2/4' onChange={(e)=>setVal({...val,title:e.target.value})} placeholder='Quiz Title' />
                        </div>
                        <div className='flex items-center space-x-5'>
                            <span>Quiz Description:</span>
                            <textarea className='border py-2 w-2/4 indent-2 rounded-md' onChange={(e)=>setVal({...val,description:e.target.value})} placeholder='Quiz Description'/>
                        </div>
                        <div className='flex items-center space-x-5'>
                            <span>Quiz Time:</span>
                            <input type="number" onChange={(e)=>setVal({...val,time:Number(e.target.value)})}  className='w-1/6 border py-2 indent-2 rounded-md' placeholder='in min' />
                        </div>
                        <div className='flex items-center space-x-5 pb-5 border-b-2'>
                            <span>Number of Questions:</span>
                            <input type="number" onChange={(e)=>setVal({...val,numberOfQuestions:Number(e.target.value)})} className='w-1/6 border py-2 indent-2 rounded-md' />
                        </div>

                        <div className='pb-5 border-b-2'>
                            <span className='text-2xl'>Question Form</span>
                            <div className='flex items-center mt-5 space-x-5'>
                                <span>Question:</span>
                                <input type="text" ref={questionRef} onChange={(e)=>setQuestion({...question,qst:e.target.value})} className='border py-2 indent-2 rounded-md w-2/4' placeholder='Question' />
                            </div>
                            <div className='flex items-center mt-5 space-x-5'>
                                <span>Answers:</span>
                                <input type="text" ref={answersRef} onChange={(e)=>setQuestion({...question,ans:e.target.value.split(',')})} className='border py-2 indent-2 rounded-md w-2/4' placeholder='Answers separated with commas(,)' />
                            </div>
                            <div className='flex items-center mt-5 space-x-5'>
                                <span>Correct Answer:</span>
                                <input type="text" ref={correctAnsRef} onChange={(e)=>setQuestion({...question,correctAns:e.target.value})} className='border py-2 indent-2 rounded-md w-2/4' placeholder='correct answer' />
                            </div>
                            <button onClick={(e)=>{
                                    e.preventDefault()
                                    val.questions.push(question)
                                    questionCount+=1
                                    questionRef.value=''
                                    answersRef.value=''
                                    correctAnsRef.value=''
                                    alert('question added successfully!')
                                    }} className='bg-blue-500 text-white py-1 cursor-pointer rounded-md hover:bg-blue-400 px-6 mt-5 ml-16'>Add</button>
                            
                        </div>

                        <button onClick={quizCreation} className='py-1 w-2/6 rounded-md text-white hover:bg-blue-400 bg-blue-600'>Create Quiz</button>
                    </form>
                </div>
            ):
            editQuiz ? (
                <div className='h-5/6 scrollbar-hide mt-5 px-2 my-5'>
                    <AiOutlineArrowLeft className='text-xl mb-2 cursor-pointer' onClick={()=>setEditQuiz(false)}/>
                    <div className='flex items-center space-x-2 px-3'>
                        <span className='text-gray-500'>Quiz Title:</span>
                        <span>{choosedQuiz?.title}</span>
                    </div>
                    <div className=''>
                        <span className='text-gray-500 px-3'>Quiz Description:</span>
                        <span>{choosedQuiz?.description}</span>
                    </div>
                    {
                        choosedQuiz?.questions?.map((question,index)=>(
                            <div className='flex flex-col space-y-1 mt-2 mb-3' key={index}>
                                <div className='flex items-center space-x-10'>
                                    <span className='ml-2 capitalize font-medium'><span className='text-red-500'>*</span><span className='text-gray-500'>Question {index+1}</span> : {question?.question}</span>
                                    <FaTrash className='text-red-600 cursor-pointer hover:scale-125'/>
                                </div>
                                <span className='ml-3 text-gray-400'>Answers:</span>
                                <div className='flex flex-col space-y-1 ml-5'>
                                    {   
                                        question.answers.map((answer,i)=>(
                                            <div className='py-1 px-2 border w-2/4 flex items-center justify-between rounded-md cursor-pointer'>
                                                <span className='' key={i}>{i+1}. {answer}</span>
                                               <FaTrash className='text-red-600 hover:scale-105'/>
                                            </div>
                                            
                                        ))
                                        
                                    }
                                    <div className='flex items-center space-x-2'>
                                        <span className='text-sm font-semibold'>Add Answer</span>
                                        <AiOutlinePlusSquare className='text-xl text-blue-600 cursor-pointer font-bold'/>
                                    </div>
                                    
                                </div>

                            </div>
                        ))
                    }
                    <div className='flex items-center ml-3 mt-4 space-x-3'>
                        <span className='font-semibold'>Add Question</span>
                         <AiOutlinePlusSquare className='cursor-pointer hover:scale-110 text-2xl text-blue-600 font-bold'/>
                    </div>
                   
                    
                </div>
            ):
            <div className='h-5/6 scrollbar-hide'>
                {
                    quizzes?.length >0 ?(
                        <div className='flex flex-col mt-2 mx-5 h-5/6 scrollbar-hide space-y-2'>
                            {
                                quizzes?.map((quiz,i)=>(
                                <div onClick={()=>{
                                    setChoosedQuiz({...quiz})
                                    setSelected(true)
                                    setTimeout(()=>{
                                    
                                    },1000)
                                    
                                }} key={i} className='relative flex cursor-pointer justify-between py-2 bg-gray-200 px-2 rounded-md'>
                                    <div className='flex flex-col space-y-1'>
                                    <span className='text-xl font-semibold text-blue-400'>{quiz?.title}</span>
                                    <span className='text-sm text-gray-600'>{quiz?.description}</span>
                                    </div>
                                    <div className=''>
                                    <AiOutlineEdit onClick={()=>{
                                        setChoosedQuiz({...quiz})
                                        setEditQuiz(true)
                                        }} className='text-blue-400 text-2xl cursor-pointer hover:scale-125'/>
                                    </div>
                                    <span className='absolute bottom-1 right-2 text-xs text-gray-500'>author</span>
                                </div>
                                ))
                            }
                        </div>
                    ):
                    (
                        <div className='flex items-center justify-center mt-60'>
                            <span className='text-2xl text-gray-500'>No Quiz Awailable</span>
                        </div>
                    )
                }
                
            </div>   
            
        }

        {/* Footer */}

        <div className='flex items-center justify-center py-2 bg-black text-white sticky bottom-0 z-10'>
            <span>Done by &copy;Ghis</span>
        </div>
        {/* End of footer */}
    </div>
  )
}

export default Home