import { Star, Eye, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminMoviCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/details/${movie._id}`)}
      className="group h-fit w-[22rem] rounded-[2.5rem] overflow-hidden bg-slate-900/40 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2"
    >
      {/* Poster Section */}
      <div className="relative overflow-hidden aspect-[11/14] bg-slate-950">
        {/* Cinematic Blurred Background Layer */}
        <img
          src={movie.poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-3xl saturate-[1.8] brightness-[0.4] scale-150"
        />
        
        {/* Vignette Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 z-0" />

        {/* Main Poster (Fully Visible with Pop) */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        />

        {/* Dynamic Badges Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
        
        <div className="absolute top-4 inset-x-4 flex justify-between items-start z-20">
          <div className="flex flex-col gap-2">
            <span className="backdrop-blur-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-lg">
              {movie.status || "active"}
            </span>
             {movie?.premium && (
                 <span className="backdrop-blur-md bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-lg">
                    Premium
                 </span>
            )}
          </div>
          <span className="backdrop-blur-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-lg">
            {movie.Category || "Movie"}
          </span>
        </div>

        {/* Rating Floating Badge */}
        <div className="absolute bottom-4 right-4 backdrop-blur-md bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-yellow-400 shadow-xl group-hover:bg-yellow-400 group-hover:text-slate-950 transition-all duration-300 z-20">
          <Star size={14} fill="currentColor" strokeWidth={0} />
          <span className="text-sm font-black">{movie.rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400/80 font-bold">
            {movie.genre?.split(',')[0] || "Cinematic"}
          </p>
          <h2 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {movie.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2.5 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
            <div className="p-1.5 bg-slate-800 rounded-lg">
              <Clock size={14} className="text-indigo-400" />
            </div>
            <span className="font-medium">{movie.duration}</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
            <div className="p-1.5 bg-slate-800 rounded-lg">
              <Eye size={14} className="text-blue-400" />
            </div>
            <span className="font-medium">{movie?.views ||0} Views</span>
          </div>
        </div>
        
        <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
           <Calendar size={12} />
           <span>Recent Release</span>
        </div>
      </div>
    </div>
  );
}
