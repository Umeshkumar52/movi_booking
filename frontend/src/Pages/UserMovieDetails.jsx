import { useContext, useEffect, useState } from "react";
import MovieTabs from "../Components/MoviTabs";
import Overview from "../components/tabs/Overview";
import Media from "../components/tabs/Media";
import Trailers from "../components/tabs/Trailers";
import Cast from "../components/tabs/Cast";
import Crew from "../components/tabs/Crew";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthProvider";
import RelatedMovies from "../Components/RelatedMovies";
import { Outlet } from "react-router-dom";
export default function MovieDetails() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [movieData, setMovieData] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const { _id } = useParams();
  const navigate = useNavigate();

  async function getMovi() {
    try {
      const { data } = await instance.get(`/movies/details?_id=${_id}`);
      console.log(data);

      setMovieData(data.message.currentMovie);
      setRelatedMovies(data.message.relatedMovies);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }
  useEffect(() => {
    getMovi();
  }, [_id]);
  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview setMovieData={setMovieData} data={movieData} />;
      case "media":
        return (
          <Media
            setMovieData={setMovieData}
            data={{ media: movieData?.media, poster: movieData?.poster }}
          />
        );
      case "trailers":
        return (
          <Trailers setMovieData={setMovieData} data={movieData?.trailer} />
        );
      case "cast":
        return <Cast movie_id={movieData?._id} />;
      case "crew":
        return <Crew movie_id={movieData?._id} />;
      default:
        return <Overview data={movieData} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* <TheaterShow/> */}
      <div className="relative w-full h-[650px] bg-gray-900 text-white overflow-hidden shadow-lg">
        <div className="absolute inset-0">
          {movieData?.trailer?.media ? (
            <video
              src={movieData.trailer.media}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              style={{ pointerEvents: "none" }}
            />
          ) : (
            <img
              src={movieData?.poster}
              alt="backdrop"
              className="w-full h-full object-cover blur-md"
            />
          )}
          {/* Gradients for text readability and smooth transition to content below */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-0" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-4/5 mx-auto h-full flex items-center gap-10 p-6">
          {/* Poster Image */}
          <div className="flex-shrink-0">
            <img
              src={movieData?.poster || "/puspa.jpeg"}
              alt={movieData?.title}
              className="w-[300px] h-[450px] rounded-xl  scale-115 shadow-2xl object-cover border-4 border-white/10"
            />
          </div>

          {/* Movie Details */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-6xl font-extrabold mb-2 tracking-tight drop-shadow-md">
              {movieData?.title || "Movie Title"}
            </h1>
            <p className="text-xl text-gray-300 font-light mb-6">
              {movieData?.main_title ||
                movieData?.title ||
                "Subtitle / Original Title"}
            </p>

            {/* Metadata Badges */}
            <div className="flex items-center gap-4 mb-8 text-sm font-medium">
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">
                IMDb {movieData?.rating || "N/A"}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                {movieData?.year || "Year"}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                {movieData?.duration ? `${movieData.duration} min` : "Duration"}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                {movieData?.language || "Language"}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20 uppercase">
                {movieData?.status || "Status"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-8 mt-4">
              {movieData?.premium && user?.role === "user" && (
                <button
                  onClick={() => navigate("booking")}
                  className="
    px-8 py-3
    bg-red-600
    text-white
    font-semibold
    rounded-xl
    shadow-lg
    animate-pulse
    hover:animate-none
    hover:bg-red-500
    hover:scale-105
    active:scale-95
    transition-all duration-300
    flex items-center gap-2
  "
                >
                  🎬 Book Now
                </button>
              )}

              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <MovieTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-4/5 mx-auto mt-8 bg-slate-900/50 rounded-xl shadow-sm border border-slate-800 min-h-[400px] p-6 text-slate-200">
        {renderTab()}
      </div>
      {/* related movies */}
      {relatedMovies.length > 0 && (
        <RelatedMovies relatedMovies={relatedMovies} />
      )}
      <Outlet />
    </div>
  );
}
