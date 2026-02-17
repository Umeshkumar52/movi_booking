import { useState } from "react";
import { EditBasicInfo } from "../MoviForms";

export default function Overview({data}) {
  const[updateOverViewModal,setUpdateOverViewModal]=useState(null)
  return (
   <>
   {/* update overview data */}
     {
      updateOverViewModal&&<EditBasicInfo data={data}  setUpdateOverViewModal={setUpdateOverViewModal}/>
     }

    <div className="min-h-screen z-0 bg-gray-50 p-6">
      <div className="bg-gray-100 shadow-2xl text-white rounded-2xl p-10 relative flex gap-16">
        
        {/* Edit Button */}
        <button onClick={()=>setUpdateOverViewModal(data)} className="absolute right-8 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-sm font-semibold">
          ✏️ Edit {data?.title|| "MAN vs Baby"}
        </button>

        {/* LEFT SECTION */}
        <div className="flex-1 space-y-10">
          <h1 className="text-4xl font-bold text-blue-400">Overview</h1>

          {/* Storyline */}
          <div>
            <p className="text-gray-600 font-medium text-xl">Storyline</p>
            <p className="mt-2 text-black text-lg">{data?.storyline}</p>
          </div>

          {/* Category & Language */}
          <div className="flex gap-32">
            <div>
              <p className="text-gray-600 font-medium flex items-center gap-2">
                🎬 Category
              </p>
              <p className="mt-1 text-black text-lg">{data?.category||"movie"}</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium flex items-center gap-2">
                🌐 Languages
              </p>
              <p className="mt-1 text-black text-lg">{data?.language||"English"}</p>
            </div>
          </div>

          {/* Genres */}
          <div>
            <p className="text-gray-600 font-medium flex items-center gap-2">
              🏷 Genres
            </p>
            <span className="inline-block mt-3  bg-indigo-600 px-5 py-2 rounded-full text-sm">
             { data?.genres||"Comedy"}
            </span>
          </div>
        </div>

        {/* RIGHT POSTER */}
        <div className="pt-16 w-[25vw] pr-12">
          <img
            src={data?.poster}
            alt="poster"
            className="rounded-2xl "
          />
          <p className="text-center text-gray-600 font-medium mt-3 text-sm">
            Click poster to enlarge
          </p>
        </div>
      </div>
    </div>
   </>
  );
}

