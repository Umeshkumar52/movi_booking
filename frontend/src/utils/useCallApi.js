import axios from "axios"
import { useEffect, useState } from "react"

export default  function useCallApi(url,method,data){
   const [result,setResult]=useState([])
   const[process,setProcess]=useState(false)
   const[success,setSuccess]=useState(false)

   async function callApi(){
       try {
        setProcess(prev=>!prev)
        let res;
        if(method=="get"){
           res= await axios.get(url,data)
        }else if(method=="post"){
           res= await axios.post(url,data)
        }else if(method=="put"){
           res= await axios.put(url,data)
        }else if(method=="delete"){
           res= await axios.delete(url,data)
        }else{
          res= await axios.patch(url,data)  
        }

        setResult(res.data.message)
         setSuccess(prev=>!prev)
         setProcess(prev=>!prev)

       } catch (error) {
         console.log(error)
         setProcess(prev=>!prev)
         toast.error("something went wrong !")
       }
   }

   useEffect(()=>{
       callApi
   },[])

   return {result,process,success}
}