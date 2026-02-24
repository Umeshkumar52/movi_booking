import { FaPlay, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaFilm } from "react-icons/fa";
export default function RelatedMovies({ relatedMovies }) {
  const navigate = useNavigate();
return(
      <section className="relative px-6 md:px-16 lg:px-24 mt-24">

      {/* Section Header */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-3xl font-semibold text-white">
          <FaFilm className="text-red-500 text-2xl" />
          <span className="relative">
            More Like This
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
          </span>
        </h2>
      </div>

      {/* Movies Grid */}
      <div className="flex flex-wrap gap-6">
        {relatedMovies.map((movie) => (
          <div
            key={movie._id}
            onClick={() => navigate(`/movie/details/${movie._id}`)}
            className="relative group cursor-pointer transition duration-300"
          >
            {/* Poster */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-[22rem] h-[480px] object-cover 
                           transition duration-500 
                           group-hover:scale-110"
              />
            </div>

            {/* Gradient Bottom Fade */}
            <div className="absolute inset-0 rounded-2xl 
                            bg-gradient-to-t from-black via-black/60 to-transparent 
                            opacity-80 group-hover:opacity-100 transition duration-300" />

            {/* Hover Glass Overlay */}
            <div className="absolute inset-0 rounded-2xl 
                            backdrop-blur-sm bg-black/40
                            opacity-0 group-hover:opacity-100 
                            transition duration-300 
                            flex flex-col items-center justify-center text-center p-4">

              {/* Play Button */}
              <div className="bg-red-600 hover:bg-red-700 
                              p-4 rounded-full 
                              shadow-lg shadow-red-600/40 
                              transition duration-300">
                <FaPlay className="text-white text-lg" />
              </div>

              {/* Title */}
              <p className="text-white text-sm font-medium mt-4 line-clamp-2">
                {movie.title}
              </p>

              {/* Rating */}
              <div className="flex items-center text-yellow-400 mt-2 text-sm font-semibold">
                <FaStar className="mr-1 text-xs" />
                {movie.rating}
              </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-3 right-3 
                            bg-black/70 backdrop-blur-md 
                            text-yellow-400 text-xs 
                            px-2 py-1 rounded-full 
                            flex items-center shadow-md">
              <FaStar className="mr-1 text-[10px]" />
              {movie.rating}
            </div>

            {/* Subtle Hover Lift */}
            <div className="absolute inset-0 rounded-2xl 
                            group-hover:shadow-2xl 
                            group-hover:shadow-red-500/20 
                            transition duration-300" />
          </div>
        ))}
      </div>
    </section>
)
}
