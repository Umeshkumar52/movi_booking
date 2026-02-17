import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { UpdateMovieMedia } from "../MoviForms";
export default function Media({data,setMovieData}) {
 const [updateMovieMediaModal,setUpdateMovieMediaModal]=useState(null)
  
 return (
    <>
   {updateMovieMediaModal&&
    <UpdateMovieMedia setMovieData={setMovieData} updateMovieMediaModal={updateMovieMediaModal}  setUpdateMovieMediaModal={setUpdateMovieMediaModal} />
   }
    <div className=" bg-gray-50 min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-100 shadow-2xl rounded-2xl p-10">

          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Media Content
              </h1>
              <h2 className="text-xl font-semibold text-gray-600 mt-3">
                Movie Video & Thumbnail
              </h2>
            </div>

            <button onClick={()=>setUpdateMovieMediaModal(data)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
              <Pencil size={18} />
              Edit
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-10">

            {/* Movie Video */}
            <div>
              <p className="text-gray-500 mb-3 font-medium">Movie Video</p>
              <div className="rounded-xl overflow-hidden border border-gray-300 bg-black">
                <video
                  controls
                  className="w-full h-[320px] object-cover"
                >
                  <source src={data?.media} type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <p className="text-gray-500 mb-3 font-medium">Thumbnail</p>
              <div className="rounded-xl overflow-hidden border border-gray-300">
                <img
                  src={data?.poster||"/puspa.jpeg"}
                  alt="thumbnail"
                  className="w-full h-[320px] object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
</>
  );
}

