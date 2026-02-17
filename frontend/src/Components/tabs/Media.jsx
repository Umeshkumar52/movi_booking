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
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Media Content</h2>
          <p className="text-gray-500 text-sm">Manage movie video and thumbnail</p>
        </div>
        <button
          onClick={() => setUpdateMovieMediaModal(data)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-lg transition-colors"
        >
          <Pencil size={18} />
          Edit Media
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Movie Video */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-700">Main Video</p>
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-sm">
            <video
              key={data?.media}
              controls
              className="w-full h-full object-contain"
            >
              <source src={data?.media} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-700">Thumbnail Poster</p>
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm relative group">
            <img
              src={data?.poster || "/puspa.jpeg"}
              alt="thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

