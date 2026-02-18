import { useState } from "react";
import { Loader2, Film, Image as ImageIcon, Send } from "lucide-react";

export default function MediaUploadForm({ uploadHandler, setFiles, setAddNewMoviToggle, isAdding }) {
  const [media, setMedia] = useState({
    video: null,
    thumbnail: null,
    preview: "",
    thumbName: "No file selected",
  });

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia((p) => ({
        ...p,
        video: file,
        preview: URL.createObjectURL(file),
      }));
      setFiles(prev => ({ ...prev, media: file }))
    }
  };

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia((p) => ({
        ...p,
        thumbnail: file,
        thumbName: file.name,
      }));
      setFiles(prev => ({ ...prev, poster: file }))
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadHandler();
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-slate-900">
      <div className="pb-6 border-b border-white/5">
        <h2 className="text-3xl font-black text-white">Full Feature</h2>
        <p className="text-slate-500 text-sm mt-1">Final step: upload the complete movie file and main poster.</p>
      </div>

      <div className="space-y-6">
        {/* Full Movie Video */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Master File (4K/HD)</label>
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-white/5 shadow-2xl group">
            <video
              src={media.preview}
              controls
              className="w-full h-full object-contain"
            />
            {!media.preview && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                  <Film className="size-8" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">Mastering in Progress</p>
              </div>
            )}
          </div>
          
          <div className="relative group">
            <input 
              type="file" 
              id="movie" 
              accept="video/*" 
              onChange={handleVideo} 
              disabled={isAdding}
              className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            />
            <div className={`w-full bg-slate-800/50 border border-slate-700/50 ${!isAdding && 'group-hover:border-indigo-500/50 group-hover:text-white'} text-slate-400 px-4 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 border-dashed`}>
               <Send className="size-5" />
               <span className="text-xs font-black uppercase tracking-widest">{media.video ? media.video.name : "Select Feature Film"}</span>
            </div>
          </div>
        </div>

        {/* Poster */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Primary Poster Art</label>
          <div className="relative group">
            <input 
              type="file" 
              id="poster" 
              accept="image/*" 
              onChange={handleThumb} 
              disabled={isAdding}
              className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            />
            <div className={`w-full bg-slate-800/50 border border-slate-700/50 ${!isAdding && 'group-hover:border-indigo-500/50 group-hover:text-white'} text-slate-400 px-4 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 border-dashed`}>
               <ImageIcon className="size-5" />
               <span className="text-xs font-black uppercase tracking-widest">{media.thumbnail ? media.thumbnail.name : "Choose Official Poster"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          type="submit"
          disabled={isAdding}
          className="px-12 py-4 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Launching...</span>
            </>
          ) : (
            <>
              <Send className="size-5" />
              Launch to Theater
            </>
          )}
        </button>
      </div>
    </form>
  );
}
