import { useContext, useEffect, useRef, useState } from "react";
import SeriesHero from "../Components/series/SeriesHero";
import Cast from "../components/tabs/Cast";
import Crew from "../components/tabs/Crew";
import SeasonsManagement from "../Components/series/SeasonsManagement";
import EpisodesManagement from "../Components/series/EpisodesManagement";
import { Outlet, useParams } from "react-router-dom";
import instance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { Users, Star, Tv, Info } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";
// sk-e183daa71fe94568ad587ce36658cd55
export default function UserSeriesDetails() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [seriesData, setSeriesData] = useState(null);
  const [seasonsData, setSeasonsData] = useState([]);
  const [activeSeasonId, setActiveSeasonId] = useState(null); // Track season for episode management
  const { _id } = useParams();
  const containerRef = useRef(null);
  async function getSeries() {
    try {
      const { data } = await instance.get(`/movies/series/details/${_id}`);
      setSeriesData(data.message.series);
      setSeasonsData(data.message.seasons);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch series");
    }
  }

  function checkSubscriptionExpiry(tabs) {
    if (seriesData.premium) {
       const currentDate = new Date();
      const expireyDate = new Date(user?.subscription?.ExpireAt || "");
      if (tabs !== "seasons") {
        setActiveTab(tabs);
        return;
      } else if (
        expireyDate < currentDate ||
        user?.subscription?.Status === "expire"
      ) {
        alert(`Your subscription has been expired, You cant not access !`);
        return;
      } else {
        setActiveTab(tabs);
      }
    } else {
      setActiveTab(tabs);
    }
  }

  useEffect(() =>{
    getSeries();
  }, [_id]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "seasons", label: "Seasons Management", icon: Tv },
    { id: "cast", label: "Series Cast", icon: Users },
    { id: "crew", label: "Series Crew", icon: Star },
  ];

  const renderTab = () => {
    if (!seriesData) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">
                    Storyline
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-lg font-medium">
                    {seriesData.storyline || "No storyline provided."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {seriesData.genres?.split(",").map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-slate-800 border border-white/5 rounded-lg text-xs font-bold text-slate-400"
                        >
                          {genre.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">
                      Release Date
                    </h3>
                    <p className="text-slate-300 font-bold">
                      {new Date(seriesData.releaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-[2rem] border border-white/5 p-6 h-fit space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                      Pricing
                    </span>
                    <span
                      className={`text-sm font-black ${seriesData.premium ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {seriesData.premium ? `$${seriesData.price}` : "FREE"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                      Views
                    </span>
                    <span className="text-sm font-black text-slate-200">
                      {seriesData.views || 0} Total
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                      Language
                    </span>
                    <span className="text-sm font-black text-slate-200 uppercase">
                      {seriesData.language}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "seasons":
        return activeSeasonId ? (
          <EpisodesManagement
            seriesId={_id}
            seasonId={activeSeasonId}
            onBack={() => setActiveSeasonId(null)}
          />
        ) : (
          <SeasonsManagement
            seriesId={_id}
            seasons={seasonsData}
            refreshData={getSeries}
            onManageEpisodes={setActiveSeasonId}
          />
        );
      case "cast":
        return <Cast movie_id={seriesData?._id} />;
      case "crew":
        return <Crew movie_id={seriesData?._id} />;
      default:
        return null;
    }
  };

  if (!seriesData)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="size-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );

  console.log(seriesData);
  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-950 pb-20 selection:bg-indigo-500/30"
    >
      <SeriesHero setSeriesData={setSeriesData} series={seriesData} />

      {/* Dynamic Tab Navigation */}
      <div className="max-w-[1400px] mx-auto mt-12 px-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  // if(tab.id==="seasons"&&user.role==="user"){
                  checkSubscriptionExpiry(tab.id);
                  // }
                }}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-y-[-2px]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <Icon size={18} strokeWidth={2.5} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="mt-8 bg-slate-900/40 backdrop-blur-sm rounded-[2.5rem] border border-white/5 min-h-[500px] p-8 lg:p-12 shadow-inner">
          {renderTab()}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
