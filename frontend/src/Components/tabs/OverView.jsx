import { useState } from "react";
import { EditBasicInfo } from "../MoviForms";

export default function Overview({data, setMovieData}) {
  const[updateOverViewModal,setUpdateOverViewModal]=useState(null)
  return (
    <>
      {/* update overview data */}
      {updateOverViewModal && (
        <EditBasicInfo
          data={data}
          setMovieData={setMovieData}
          setUpdateOverViewModal={setUpdateOverViewModal}
        />
      )}

      <div className="max-w-4xl mx-auto py-6">
        {/* Storyline Section */}
        <div className="mb-10">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
               <span className="text-blue-500">📖</span> Storyline
             </h2>
              <button
                onClick={() => setUpdateOverViewModal(data)}
                className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
              >
                ✏️ Edit
              </button>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed text-justify">
            {data?.storyline || "No storyline content available for this movie yet."}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 bg-slate-900 p-6 rounded-2xl border border-slate-800">
            {/* Category */}
            <div className="flex items-start gap-4">
                 <div className="bg-purple-900/30 p-3 rounded-lg text-purple-400 border border-purple-500/20">
                    <span className="text-xl">🎬</span>
                 </div>
                 <div>
                    <h3 className="font-semibold text-slate-100 mb-1">Category</h3>
                     <p className="text-slate-400 capitalize">{data?.category || "Movie"}</p>
                 </div>
            </div>

             {/* Language */}
            <div className="flex items-start gap-4">
                 <div className="bg-green-900/30 p-3 rounded-lg text-green-400 border border-green-500/20">
                    <span className="text-xl">🌐</span>
                 </div>
                 <div>
                    <h3 className="font-semibold text-slate-100 mb-1">Languages</h3>
                     <p className="text-slate-400">{Array.isArray(data?.language) ? data.language.join(', ') : (data?.language || "English")}</p>
                 </div>
            </div>
             
             {/* Genres */}
             <div className="col-span-full">
                 <div className="flex items-start gap-4">
                    <div className="bg-orange-900/30 p-3 rounded-lg text-orange-400 border border-orange-500/20">
                        <span className="text-xl">🏷️</span>
                    </div>
                     <div className="flex-1">
                        <h3 className="font-semibold text-slate-100 mb-3">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {(typeof data?.genres === 'string' ? data.genres.split(',') : (data?.genres || ["Comedy"])).map((genre, index) => (
                              <span key={index} className="px-4 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-sm font-medium shadow-sm">
                                {genre.trim()}
                              </span>
                          ))}
                        </div>
                     </div>
                 </div>
             </div>
        </div>
      </div>
    </>
  );
}

