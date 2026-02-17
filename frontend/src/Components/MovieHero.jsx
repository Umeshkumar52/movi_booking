import { useEffect, useState } from 'react';
import {EditBasicInfo} from './MoviForms'
import instance from '../utils/axiosInstance'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
export default function MovieHero({movie,setMovieData}) {
  const[updateOverViewModal,setUpdateOverViewModal]=useState(null)
  const[data,setData]=useState(null)
  const navigate=useNavigate()
   async function postDeleteHandler(params) {
      try {
        instance.delete(`movies/delete/${data._id}`)
        navigate(-1)
      } catch (error) {
        toast.error(error.response.data.message)
      }
    } 
  
  useEffect(()=>{
     setData(movie)
  },[movie])
 
  return (
   <>
    {
      updateOverViewModal&&<EditBasicInfo setMovieData={setMovieData}  data={data} setUpdateOverViewModal={setUpdateOverViewModal}/>
     }

   <div className="hero flex bg-gray-100">
      <div className="hero-left flex items-center gap-4">
        <img
        
         src={data?.poster||"/puspa.jpeg"}
          alt="poster"
          className="poster hover:scale-104"
        />

        <div className="hero-info">
          <h1>{data?.title}</h1>
          <p className="type">{data?.title||"Movie"}</p>

          <div className="badges">
            <span>{data?.duration||"200"} min</span>
            <span>{data?.year||"2002"}</span>
            <span>{data?.rating||"2"}/10</span>
            <span>Cert: UA</span>
            <span className="status">Status: {data?.status||"active"}</span>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <button onClick={()=>setUpdateOverViewModal(data)} className="btn edit hover:scale-105">Edit {data?.title}</button>
        {/* <button className="btn boost">Boost</button> */}
        <div className="sub-btns flex gap-12">
          <button onClick={()=>navigate(-1)} className="btn back px-2 ">Back</button>
          <button onClick={postDeleteHandler} className="btn delete px-2 hover:bg-red-500">Delete</button>
        </div>
      </div>
    </div>
    
   </>
  );
}
