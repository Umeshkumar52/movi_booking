import { useContext, useEffect, useState } from "react";
import { EditSeriesBasicInfo } from "../seriesForms/SeriesMetadataForms";
import instance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  ArrowLeft,
  Star,
  Calendar,
  Layers,
  PlayCircle,
  Globe,
  Tv,
} from "lucide-react";
import { subscriptionHandler } from "../../utils/subScriptionHandler";
import { AuthContext } from "../../context/AuthProvider";
import TheaterShow from "../moviForms/TheaterShow";

export default function SeriesHero({ series, setSeriesData }) {
  const { user, setUser } = useContext(AuthContext);
  const [updateOverViewModal, setUpdateOverViewModal] = useState(null);
  const [data, setData] = useState(null);
  const [theaterModal, setTheaterModal] = useState(false);
  const [payment, setPayment] = useState(false);
  const navigate = useNavigate();

  async function postDeleteHandler() {
    if (
      !window.confirm(
        "Are you sure you want to delete this series and all associated seasons/episodes?",
      )
    )
      return;
    try {
      await instance.delete(`movies/delete/${data._id}`);
      toast.success("Series deleted successfully");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete series");
    }
  }

  async function paymentHandler() {
    try {
      subscriptionHandler(setPayment);
    } catch (error) {
      toast.error("Failed to load payment");
    }
  }

  async function notificationHandler() {
    try {
      if (payment) {
        await instance.post(`/notification/send`, {
          recieverId: user?._id,
          title: `Congratulations 🍿 Tickets Booked successfully`,
          body: ` "It's showtime! 🎬 Your seats are reserved. Tap to view your digital ticket."`,
        });
        setUser((prev) => ({ ...prev, subscription: "active" }));

        setPayment(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  if (!series) return null;

  useEffect(() => {
    setData(series);
  }, [series]);
  useEffect(() => {
    notificationHandler();
  }, [payment]);

  return (
    <>
      {updateOverViewModal && (
        <EditSeriesBasicInfo
          setSeriesData={setSeriesData}
          data={data}
          setUpdateOverViewModal={setUpdateOverViewModal}
        />
      )}

      {theaterModal && <TheaterShow setTheaterModal={setTheaterModal} />}

      <div className="relative w-full h-[600px] bg-slate-950 text-white overflow-hidden shadow-2xl">
        {/* Backdrop Image - Multi-layered for premium feel */}
        <div className="absolute inset-0">
          <img
            src={data?.poster}
            alt="backdrop"
            className="w-full h-full object-cover blur-xs transform "
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[1400px] mx-auto h-full flex flex-col md:flex-row items-center gap-12 px-8 py-12">
          {/* Poster Image with Glass Effect */}
          <div className="flex-shrink-0 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src={data?.poster}
              alt={data?.title}
              className="relative w-[280px] h-[420px] rounded-[2.5rem] shadow-2xl object-cover border border-white/10"
            />
            {data?.premium && (
              <div className="absolute top-6 left-6 backdrop-blur-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl">
                Premium
              </div>
            )}
          </div>

          {/* Series Details */}
          <div className="flex-1 flex flex-col justify-center text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border ${data?.isCompleted ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}
              >
                {data?.isCompleted ? "Completed" : "In Progress"}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Series
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-2 tracking-tight bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
              {data?.title}
            </h1>
            <p className="text-xl text-slate-400 font-medium mb-8 max-w-2xl">
              {data?.main_title || "Official Series Dashboard"}
            </p>

            {/* Metadata Badges Grid */}
            <div className="flex flex-wrap items-center gap-4 mb-10 justify-center md:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md transition-all hover:bg-slate-900 hover:border-indigo-500/30">
                <Star size={16} fill="#fb7185" className="text-rose-400" />
                <span className="text-sm font-black text-slate-200">
                  IMDb {data?.rating || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
                <Calendar size={16} className="text-indigo-400" />
                <span className="text-sm font-bold text-slate-300">
                  {data?.year}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
                <Layers size={16} className="text-purple-400" />
                <span className="text-sm font-bold text-slate-300">
                  {data?.totalSeasons} Seasons
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
                <PlayCircle size={16} className="text-blue-400" />
                <span className="text-sm font-bold text-slate-300">
                  {data?.totalEpisodes} Episodes
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
                <Globe size={16} className="text-emerald-400" />
                <span className="text-sm font-bold text-slate-300 tracking-wide uppercase">
                  {data?.language}
                </span>
              </div>
            </div>

            {/* Premium Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-end md:justify-start">
              {user?.role === "admin" && (
                <button
                  onClick={() => setUpdateOverViewModal(data)}
                  className="group relative px-8 py-4 bg-white text-slate-950 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <Edit size={20} />
                  Edit Metadata
                </button>
              )}

              {user?.role === "admin" && (
                <button
                  onClick={postDeleteHandler}
                  className="px-8 py-4 bg-slate-900 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <Trash2 size={20} />
                  Terminate Series
                </button>
              )}

              {user?.role === "user" && user?.subscription !== "active" && (
                <button
                  onClick={paymentHandler}
                  className="px-8 py-4 bg-slate-900 text-yellow-500 border border-rose-500/20 hover:bg-yellow-500-500 hover:text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <Tv /> Buy Subscription
                </button>
              )}
              <button
                onClick={() => navigate(-1)}
                className="group p-4 bg-slate-900 text-slate-400 border border-white/5 hover:border-slate-700 rounded-2xl transition-all active:scale-95 shadow-xl"
              >
                <ArrowLeft
                  size={24}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
