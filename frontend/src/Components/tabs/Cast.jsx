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
      {updateCastModal && (
        <UpdateCast
          setActor={setActor}
          updateCastModal={updateCastModal}
          setUpddateCastModal={setUpddateCastModal}
        />
      )}

      {/* Addd new cast */}
      {addCastModal && (
        <AddCast
          setActor={setActor}
          movie_id={movie_id}
          setAddCastModal={setAddCastModal}
        />
      )}

      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cast ({actor.length})</h2>
          <button
            onClick={() => setAddCastModal((prev) => !prev)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all"
          >
            <Plus size={18} />
            Add Cast
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actor.map((actor) => (
            <div
              key={actor?._id}
              className="group bg-white border border-gray-100 rounded-xl p-4 flex gap-4 hover:shadow-md transition-all items-start relative overflow-hidden"
            >
              {/* Image */}
              <img
                src={actor?.img || "https://via.placeholder.com/150"}
                alt={actor?.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">
                  {actor?.name || "Unknown Name"}
                </h3>
                <p className="text-blue-600 text-sm font-medium truncate mb-1">
                  {actor?.role || "Role"}
                </p>
                <p className="text-gray-500 text-xs line-clamp-2">
                  {actor?.description || "No description available."}
                </p>
              </div>

              {/* Actions (Visible on Hover) */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm">
                <button
                  onClick={() => setUpddateCastModal(actor)}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteHandler(actor._id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {actor.length === 0 && (
             <div className="col-span-full text-center py-10 text-gray-400">
                No cast members added yet.
             </div>
          )}
        </div>
      </div>
    </>
  );
}
