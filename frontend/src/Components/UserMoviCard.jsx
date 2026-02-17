import { Star, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserMoviCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/details/${movie._id}`)}
      className="w-[22rem] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 text-black"
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
          <span className="bg-green-500 text-xs px-2 py-1 rounded-md font-semibold">
           {movie.status||"active"}
          </span>
          <span className="bg-blue-600 text-xs px-2 py-1 rounded-md font-semibold">
           { movie.Category||"Movie"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold tracking-wide">{movie.title}</h2>

        <div className="flex items-center justify-between text-sm text-slate-9800">
          <div className="flex  items-center gap-1">
            <Clock size={16} />
            {movie.duration}
          </div>

          <div className="flex   items-center gap-1">
            <Eye size={16} />
            {movie?.views||50}
          </div>

          <div className="flex items-center gap-1 text-yellow-400 font-semibold">
            <Star size={16} />
            {movie.rating}
          </div>
        </div>

        <div className="text-sm text-blue-400 font-medium">{movie.genre}</div>
      </div>
    </div>
  );
}


// import { Star, Eye, Clock } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function UserMoviCard() {
//   const navigate=useNavigate()
// const movie={
//   _id:1,
//   title: "MAN vs BABY",
//   poster:
//     "https://image.tmdb.org/t/p/w500/your-image.jpg", // replace with real
//   duration: "200m",
//   views: "2002",
//   rating: "2",
//   genre: "Romance",
// };

//   return (
//     <div onClick={()=>navigate(`/movie/details/${movie._id}`)} className="w-[22rem] rounded-2xl overflow-hidden shadow-lg bg-gray-100 text-black">
//       {/* Poster */}
//       <div className="relative">
//         <img
//           src="/puspa.jpeg"
//           alt={movie.title}
//           className="w-full h-[24rem] object-cover"
//         />

//         {/* Top badges */}
//         <div className="w-full text-white px-4 absolute top-3 flex justify-between">
//           <span className="bg-green-500 text-xs px-2 py-1 rounded-md font-semibold">
//             active
//           </span>
//           <span className="bg-blue-600 text-xs px-2 py-1 rounded-md font-semibold">
//             Movie
//           </span>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-4 space-y-3">
//         <h2 className="text-xl font-bold tracking-wide">
//           {movie.title}
//         </h2>

//         <div className="flex items-center justify-between text-sm text-slate-9800">
//           <div className="flex  items-center gap-1">
//             <Clock size={16} />
//             {movie.duration}
//           </div>

//           <div className="flex   items-center gap-1">
//             <Eye size={16} />
//             {movie.views}
//           </div>

//           <div className="flex items-center gap-1 text-yellow-400 font-semibold">
//             <Star size={16} />
//             {movie.rating}
//           </div>
//         </div>

//         <div className="text-sm text-blue-400 font-medium">
//           {movie.genre}
//         </div>
//       </div>
//     </div>
//   );
// }
