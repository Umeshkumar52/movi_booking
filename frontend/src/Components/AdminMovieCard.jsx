import { Star, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminMoviCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/details/${movie._id}`)}
      className="w-[22rem] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:scale-105 transition-transform duration-300 cursor-pointer"
    >
      {/* Poster */}
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-[24rem] object-cover"
        />

        {/* Top badges */}
        <div className="w-full text-white px-4 absolute top-3 flex justify-between">
          <span className="bg-green-600/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md font-semibold shadow-lg">
           {movie.status||"active"}
          </span>
          <span className="bg-blue-600/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md font-semibold shadow-lg">
           { movie.Category||"Movie"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold tracking-wide text-white truncate">{movie.title}</h2>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex  items-center gap-1">
            <Clock size={16} className="text-indigo-400" />
            {movie.duration}
          </div>

          <div className="flex   items-center gap-1">
            <Eye size={16} className="text-blue-400" />
            {movie?.views||50}
          </div>

          <div className="flex items-center gap-1 text-yellow-400 font-semibold">
            <Star size={16} fill="currentColor" />
            {movie.rating}
          </div>
        </div>

        <div className="text-sm text-blue-400 font-medium">{movie.genre}</div>
      </div>
    </div>
  );
}
