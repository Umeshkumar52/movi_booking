import { FaFilm } from "react-icons/fa";
import { FaPlay } from "react-icons/fa"; // Keep for backward compatibility or alternate style if needed
import { Star, Eye, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RelatedMovies({ relatedMovies }) {
  const navigate = useNavigate();

  return (
    <section className="relative px-6 md:px-16 lg:px-24 mt-24 mb-16">
      {/* Section Header */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-3xl font-semibold text-white">
          <FaFilm className="text-indigo-500 text-2xl drop-shadow-lg" />
          <span className="relative">
            More Like This
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </span>
        </h2>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {relatedMovies?.map((movie) => (
          <div
            key={movie._id}
            onClick={() => {
              window.scrollTo(0, 0); // Scroll to top when changing movie
              navigate(`/movie/details/${movie._id}`);
            }}
            className="group h-fit w-full rounded-[2.5rem] overflow-hidden bg-slate-900/40 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2"
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

              {/* Main Poster */}
              <img
                src={movie.poster}
                alt={movie.title}
                className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />

              {/* Dynamic Badges Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
              
              <div className="absolute top-4 inset-x-4 flex justify-between items-start z-20">
                <div className="flex flex-col gap-2 shadow-lg">
                  {movie.status && (
                    <span className="backdrop-blur-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-lg w-fit">
                      {movie.status}
                    </span>
                  )}
                  {movie?.premium && (
                    <span className="backdrop-blur-md bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-lg w-fit">
                      Premium
                    </span>
                  )}
                </div>
                {(movie.Category || movie.category) && (
                  <span className="backdrop-blur-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-lg">
                    {movie.Category || movie.category}
                  </span>
                )}
              </div>

              {/* Play Hover Overlay Center */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-indigo-600/90 hover:bg-indigo-500 p-4 rounded-full shadow-lg shadow-indigo-600/40 backdrop-blur-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <FaPlay className="text-white text-lg ml-1" />
                </div>
              </div>

              {/* Rating Floating Badge */}
              <div className="absolute bottom-4 right-4 backdrop-blur-md bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-yellow-400 shadow-xl group-hover:bg-yellow-400 group-hover:text-slate-950 transition-all duration-300 z-20">
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <span className="text-sm font-black">{movie?.rating || "N/A"}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-3">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400/80 font-bold truncate">
                  {movie.genre ? movie.genre.split(',')[0] : "Cinematic"}
                </p>
                <h2 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {movie.title}
                </h2>
              </div>

              <div className="flex items-center gap-4 pt-1">
                {movie.duration && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    <div className="p-1.5 bg-slate-800 rounded-lg">
                      <Clock size={12} className="text-indigo-400" />
                    </div>
                    <span className="font-medium">{movie.duration} min</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  <div className="p-1.5 bg-slate-800 rounded-lg">
                    <Eye size={12} className="text-blue-400" />
                  </div>
                  <span className="font-medium">{movie?.views || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
