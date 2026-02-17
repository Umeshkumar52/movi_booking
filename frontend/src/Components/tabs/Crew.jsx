import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AddCrew, UpdateCrew } from "../MoviForms";
import instance from "../../utils/axiosInstance";

export default function Crew({movie_id}) {
  const[addCrewModal,setaddCrewModal]=useState(false)
   const[updateCrewModal,setUpdateCrewModal]=useState(null)
    const[crew,setCrew]=useState([])
    async function getCrewData(params) {
      try {
        const {data}=await instance.get(`/movies/crew/getdata/${movie_id}`)
        setCrew(prev=>[...prev,...data.message])
      } catch (error) {
        console.log(error)
        // toast.error(error.response.data.message)
      }
     }
     function  updatedata(data) {
      setCrew(prev=> prev.map((item) => (item._id ==data._id ? data : item)))
     }

       async function deleteHandler(_id) {
        try {
          await instance.delete(`/movies/crew/delete/${_id}`)
          setCrew(prev=>prev.filter((data)=>data._id!==_id))
        } catch (error) {
          console.log("errr")
        }
       }
     useEffect(()=>{
      getCrewData()
     },[])
    
   return (
   <>
    <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Crew ({crew.length})</h2>
          <button
            onClick={() => setaddCrewModal((prev) => !prev)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all shadow-blue-900/20"
          >
            <Plus size={18} />
            Add Crew
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crew.map((crew) => (
            <div
              key={crew._id}
              className="group bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 hover:shadow-lg hover:shadow-black/50 transition-all items-start relative overflow-hidden hover:border-slate-700"
            >
              {/* Image */}
              <img
                src={crew?.img || "https://via.placeholder.com/150"}
                alt={crew?.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-800 flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-100 truncate">
                  {crew?.name || "Unknown Name"}
                </h3>
                <p className="text-blue-500 text-sm font-medium truncate mb-1">
                  {crew?.role || "Role"}
                </p>
                <p className="text-slate-400 text-xs line-clamp-2">
                  {crew?.description || "No description available."}
                </p>
              </div>

              {/* Actions (Visible on Hover) */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/90 p-1 rounded-lg shadow-sm border border-slate-700">
                <button
                  onClick={() => setUpdateCrewModal(crew)}
                  className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-500/10"
                   title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteHandler(crew._id)}
                  className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10"
                   title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
           {crew.length === 0 && (
             <div className="col-span-full text-center py-10 text-slate-500">
                No crew members added yet.
             </div>
          )}
        </div>
    </div>
   
    {/*update modal */}
    {
      updateCrewModal&&<UpdateCrew updatedata={updatedata} setCrewData={setCrew} updateCrewData={updateCrewModal} movie_id={movie_id} setUpdateCrewModal={setUpdateCrewModal}/>
    }

    {/*update modal */}
    {
      addCrewModal&&<AddCrew movie_id={movie_id} setCrewData={setCrew} setaddCrewModal={setaddCrewModal}/>
    }
   </>
  );
}
