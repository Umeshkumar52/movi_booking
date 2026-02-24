import { useContext, useEffect, useState } from "react";
import { EditBasicInfo } from "./MoviForms";
import instance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TheaterShow from "./moviForms/TheaterShow";
import { AuthContext } from "../context/AuthProvider";
export default function MovieHero({ movie, setMovieData }) {
  const { user } = useContext(AuthContext);
  const [updateOverViewModal, setUpdateOverViewModal] = useState(null);
  const [theaterModal, setTheaterModal] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  async function postDeleteHandler(params) {
    try {
      instance.delete(`movies/delete/${data._id}`);
      navigate(-1);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    setData(movie);
  }, [movie]);
  return (
    <>
      {updateOverViewModal && (
        <EditBasicInfo
          setMovieData={setMovieData}
          data={data}
          setUpdateOverViewModal={setUpdateOverViewModal}
        />
      )}

      {theaterModal && <TheaterShow setTheaterModal={setTheaterModal} />}

      <div className="relative w-full h-[550px] bg-gray-900 text-white overflow-hidden shadow-lg">
        {/* Backdrop Image with Blur and Overlay */}
        <div className="absolute inset-0">
          <img
            src={data?.poster || "/puspa.jpeg"}
            alt="backdrop"
            className="w-full h-full object-cover opacity-40 blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-4/5 mx-auto h-full flex items-center gap-10 p-6">
          {/* Poster Image */}
          <div className="flex-shrink-0">
            <img
              src={data?.poster || "/puspa.jpeg"}
              alt={data?.title}
              className="w-[300px] h-[450px] rounded-xl shadow-2xl object-cover border-4 border-white/10"
            />
          </div>

          {/* Movie Details */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-6xl font-extrabold mb-2 tracking-tight drop-shadow-md">
              {data?.title || "Movie Title"}
            </h1>
            <p className="text-xl text-gray-300 font-light mb-6">
              {data?.main_title || data?.title || "Subtitle / Original Title"}
            </p>

            {/* Metadata Badges */}
            <div className="flex items-center gap-4 mb-8 text-sm font-medium">
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">
                IMDb {data?.rating || "N/A"}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                {data?.year || "Year"}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                {data?.duration ? `${data.duration} min` : "Duration"}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                {data?.language || "Language"}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20 uppercase">
                {data?.status || "Status"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setUpdateOverViewModal(data)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Movie
              </button>

              {movie?.showId ? (
                <button
                  onClick={() => navigate(`show?showId=${movie?.showId}`)}
                  className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Show Theater
                </button>
              ) : (
                <button
                  onClick={() => setTheaterModal((prev) => !prev)}
                  className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Add Theater Show
                </button>
              )}

              <button
                onClick={postDeleteHandler}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
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
    </>
  );
}
