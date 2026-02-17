import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AddCast, UpdateCast } from "../MoviForms";
import instance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
export default function Cast({movie_id}) {
  const [addCastModal, setAddCastModal] = useState(false);
    const [updateCastModal, setUpddateCastModal] = useState(null);
    const[actor,setActor]=useState([])
    async function getcastData(params) {
      try {
        const {data}=await instance.get(`/movies/actor/get/${movie_id}`)
        console.log(data)
        setActor(data.message)
      } catch (error) {
        toast.error(error.response.data.message)
      }
     }
     useEffect(()=>{
      getcastData()
     },[])

        async function deleteHandler(_id) {
             try {
               await instance.delete(`/movies/actor/delete/${_id}`)
               setActor(prev=>prev.filter((data)=>data._id!==_id))
             } catch (error) {
               console.log("errr")
             }
            }
    
    return (
    <>
    {/* update cast data */}
    {updateCastModal&&
      <UpdateCast setActor={setActor} updateCastModal={updateCastModal} setUpddateCastModal={setUpddateCastModal}/>
    }
      
      {/* Addd new cast */}
      {addCastModal && <AddCast setActor={setActor} movie_id={movie_id} setAddCastModal={setAddCastModal} />}

      <div className="bg-gray-50 min-h-screen p-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-100 shadow-2xl rounded-2xl p-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Cast</h1>

              <button
               onClick={()=>setAddCastModal(prev=>!prev)} 
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-md"
              >
                <Plus size={18} />
                Add Cast
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
              {/* {actor.lenght>0&&  */}
               <tbody className="divide-y divide-gray-200 bg-white">
                 {actor.map((actor)=>(<tr key={actor?._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <img
                        src={actor?.img}
                        alt="actor"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-800">
                      {actor?.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{actor?.role}</td>

                    <td className="px-6 py-4 text-gray-500">{actor?.description}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-5">
                        <button onClick={()=>setUpddateCastModal(actor)} className="text-indigo-600 hover:text-indigo-800">
                          <Pencil size={18} />
                        </button>
                        <button onClick={()=>deleteHandler(actor._id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                 ))
                 }
                </tbody>
                {/* // } */}
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Addd new cast */}
      {/* {addCastModal && <addCast setAddCastModal={setAddCastModal} />} */}
    </>
  );
}
