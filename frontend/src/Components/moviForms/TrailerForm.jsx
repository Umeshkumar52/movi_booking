import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, ArrowRight, ArrowLeft, Upload, Image as ImageIcon, Video } from "lucide-react";
import instance from "../../utils/axiosInstance";

export default function TrailerAndActorsForm({setFiles, movie_id, setForm}) {
  const [data, setData] = useState({
    trailer: null,
    thumbnail: null,
    actors: [{ name: "", role: "", image: null }],
    trailerPreview: "",
    thumbName: "No file selected",
  });
  const [isUpdating, setIsUpdating] = useState(false);

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

  return (
    <div className="p-10 space-y-8 bg-slate-900">
      <div className="pb-6 border-b border-white/5">
        <h2 className="text-3xl font-black text-white">Trailer Content</h2>
        <p className="text-slate-500 text-sm mt-1">Upload the cinematic preview and its cover.</p>
      </div>

      <div className="space-y-6">
        {/* Trailer Video */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Trailer Video</label>
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-white/5 shadow-2xl group">
            <video
              src={data.trailerPreview}
              controls
              className="w-full h-full object-contain"
            />
            {!data.trailerPreview && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                   <Video className="size-8" />
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
               <Upload className="size-5" />
               <span className="text-xs font-black uppercase tracking-widest">{data.trailer ? data.trailer.name : "Choose Trailer Video"}</span>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Trailer Poster</label>
          <div className="relative group">
            <input 
              type="file" 
              id="poster" 
              accept="image/*" 
              onChange={handleThumb} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full bg-slate-800/50 border border-slate-700/50 group-hover:border-indigo-500/50 text-slate-400 group-hover:text-white px-4 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 border-dashed">
               <ImageIcon className="size-5" />
               <span className="text-xs font-black uppercase tracking-widest">{data.thumbnail ? data.thumbnail.name : "Upload Key Art"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 gap-4">
        <button 
           type="button"
           onClick={() => setForm(prev => prev - 1)}
           className="px-8 py-4 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 hover:text-white transition-all active:scale-95 flex items-center gap-2"
        >
          <ArrowLeft className="size-5" />
          Back
        </button>
        <button 
          onClick={() => {
            if (!data.trailer || !data.thumbnail) {
              return toast.warning("Please upload both trailer and poster");
            }
            setForm(prev => prev + 1);
          }} 
          className="px-10 py-4 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
        >
          Continue to Media
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
