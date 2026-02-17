import { useContext, useEffect, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import instance from '../utils/axiosInstance'
import { AuthContext } from '../context/AuthProvider'
import { generateToken } from '../utils/firebase'
function Register() {
  const navigate=useNavigate()
    const [permission, setPermission] = useState(false);
    const {setUser}=useContext(AuthContext)
const[userData,setUserData]=useState({
  FullName:"",
  Email:"",
  Password:""
})

function userDataChangeHandler(event){
event.preventDefault()
const{name,value}=event.target
setUserData({
  ...userData,
  [name]:value
})
}

// register handler function
async function registerHandler(event){
event.preventDefault()
try {
    const {data}=await instance.post("/auth/signup",userData)
     if (permission) {
            generateToken();
          }
    setUser({
          _id: data.message?._id,
          role:data.message?.role,
        })
   
    localStorage.setItem("user",JSON.stringify({_id:data.message._id,role:data.message.role}))
if(data.message.role==="admin"){
  navigate("/")
}else if(data.message.role==="user"){
    navigate("/")
}
setUserData({
  Name:"",
  Email:"",
  Password:""
})
} catch (error) {
  toast.error(error?.response?.data?.message||"Something went wrong !")
}}
  
  // firebese messing generate token
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setPermission((prev) => !prev);
      }
    });
  }, []);

  return (
<div className="w-[100vw] h-[100vh] bg-gray-300 flex items-center justify-center">
   <div className="w-full lg:max-w-[30vw] bg-white rounded-lg pt-10 pb-16 px-10  flex flex-col items-center justify-center">
     <h2 className="text-2xl font-medium">Register</h2>
  <form onSubmit={registerHandler} className="w-full space-y-4">
    <div className="flex flex-col gap-2 items-start">
      <label htmlFor="Name" className="text-base font-medium">Name </label>
      <input  type="text" name="FullName" onChange={userDataChangeHandler} value={userData.Name} className="w-full focus:outline-none border-2 text-base border-gray-300 rounded-lg p-3" placeholder="Enter Your Full Name..."/>
    </div>

     <div className="flex flex-col gap-2 items-start">
      <label htmlFor="Email" className="text-base font-medium">Email </label>
      <input  type="email" name="Email" onChange={userDataChangeHandler} value={userData.Email} className="w-full focus:outline-none border-2 text-base border-gray-300 rounded-lg p-3" placeholder="E-mail..."/>
    </div>

     <div className="flex flex-col gap-2 items-start">
      <label htmlFor="Password" className="text-base font-medium">Password </label>
      <input  type="password" name="Password" onChange={userDataChangeHandler} value={userData.Password} className="w-full focus:outline-none border-2 text-base border-gray-300 rounded-lg p-3" placeholder="Password..."/>
    </div>
     <p className=' font-medium'>Already have have an account<Link className='text-indigo-500 italic' to="/login">Loging</Link></p>
        <button type="submit" className="bg-indigo-600 flex justify-self-end rounded-lg text-lg mt-8 px-8 py-2 text-white">Register</button>
  </form>
   </div>

</div>
  
  )
}

export default Register