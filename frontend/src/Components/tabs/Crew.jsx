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

       async function deteleHandler(_id) {
        try {
          await instance.delete(`/movies/crew/delete/:${_id}`)
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
   
    <div className=" bg-gray-50 min-h-screen p-10">
      <div className="max-w-7xl mx-auto">

        <div className="bg-gray-100 shadow-2xl rounded-2xl  p-10">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Crew
            </h1>

            <button onClick={()=>setaddCrewModal(prev=>!prev)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md">
              <Plus size={18} />
              Add Crew
            </button>
          </div>

          {/* Table */}
          <div className="border border-indigo-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">

              {/* Table Head */}
              <thead className="bg-indigo-100">
                <tr className="text-indigo-900 font-semibold">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
            {/* {crew.length>0&&  */}
             <tbody className="divide-y divide-gray-200 bg-white">
               {
                crew.map((crew)=>( <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <img
                      src={crew?.avatar}
                      alt="actor"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-800">
                   {crew?.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                   {crew?.role}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                  {crew?.description}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-5">
                      <button onClick={()=>setUpdateCrewModal(crew)} className="text-indigo-600 hover:text-indigo-800">
                        <Pencil size={18} />
                      </button>
                      <button onClick={()=>deteleHandler(crew._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>

                ))
               }
              </tbody>
              {/* } */}

            </table>
          </div>

        </div>

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
