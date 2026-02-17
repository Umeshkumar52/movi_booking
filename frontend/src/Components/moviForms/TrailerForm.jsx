import { useState } from "react";
import axios from "axios";
import instance from "../../utils/axiosInstance";

export default function TrailerAndActorsForm({setFiles,movie_id,setForm}) {
  const [data, setData] = useState({
    trailer: null,
    thumbnail: null,
    actors: [{ name: "", role: "", image: null }],
    trailerPreview: "",
    thumbName: "No file selected",
  });

  // Handle trailer
  const handleTrailer = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((p) => ({
        ...p,
        trailer: file,
        trailerPreview: URL.createObjectURL(file),
      }));
       setFiles(prev=>({...prev,trailerMedia:file}))
    }
  };

  // Handle thumbnail
  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((p) => ({
        ...p,
        thumbnail: file,
        thumbName: file.name,
      }));
       setFiles(prev=>({...prev,trailerPoster:file}))
    }
  };

  // Actor change
  const handleActorChange = (index, field, value) => {
    const updated = [...data.actors];
    updated[index][field] = value;
    setData((p) => ({ ...p, actors: updated }));
  };

  // Add actor
  const addActor = () => {
    setData((p) => ({
      ...p,
      actors: [...p.actors, { name: "", role: "", image: null }],
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("trailer", data.trailer);
    form.append("thumbnail", data.thumbnail);
   await instance.post("")
    data.actors.forEach((a, i) => {
      form.append(`actors[${i}][name]`, a.name);
      form.append(`actors[${i}][role]`, a.role);
      form.append(`actors[${i}][image]`, a.image);
      form.append("movie_id",movie_id)
    });
   await instance.post("/movies/actor/add",form)
    // await axios.post("/api/movie/trailer-actors", form);
  };

  return (
    <form className="p-10 space-y-8 bg-slate-900">
      <div className="pb-6 border-b border-white/5">
        <h2 className="text-3xl font-black text-white">Trailer Content</h2>
        <p className="text-slate-500 text-sm mt-1">Upload the cinematic preview and its cover.</p>
      </div>

      <div className="space-y-6">
        {/* Trailer Video */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Trailer Video</label>
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-white/5 shadow-2xl group">
            <video
              src={data.trailerPreview}
              controls
              className="w-full h-full object-contain"
            />
            {!data.trailerPreview && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                   <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                   </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">Awaiting Footage</p>
              </div>
            )}
          </div>
          
          <div className="relative group">
            <input 
              type="file" 
              id="trailer" 
              accept="video/*" 
              onChange={handleTrailer} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full bg-slate-800/50 border border-slate-700/50 group-hover:border-indigo-500/50 text-slate-400 group-hover:text-white px-4 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 border-dashed">
               <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
               </svg>
               <span className="text-xs font-black uppercase tracking-widest">{data.trailer ? data.trailer.name : "Choose Trailer Video"}</span>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Trailer Poster</label>
          <div className="relative group">
            <input 
              type="file" 
              id="poster" 
              accept="image/*" 
              onChange={handleThumb} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full bg-slate-800/50 border border-slate-700/50 group-hover:border-indigo-500/50 text-slate-400 group-hover:text-white px-4 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 border-dashed">
               <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               <span className="text-xs font-black uppercase tracking-widest">{data.thumbnail ? data.thumbnail.name : "Upload Key Art"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 gap-4">
        <button 
           type="button"
           onClick={() => setForm(prev => prev - 1)}
           className="px-8 py-4 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 hover:text-white transition-all active:scale-95"
        >
          Back
        </button>
        <button 
          onClick={() => setForm(prev => prev + 1)} 
          className="px-10 py-4 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
        >
          Continue to Media
        </button>
      </div>
    </form>
  );
}
