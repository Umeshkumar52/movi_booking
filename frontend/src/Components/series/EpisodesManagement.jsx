import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Clock, Hash, Play, MoreVertical, ArrowLeft, Video, Image as ImageIcon } from "lucide-react";
import { AddEpisodeModal, UpdateEpisodeModal } from "../seriesForms/EpisodeForms";
import instance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function EpisodesManagement({ seriesId, seasonId, onBack }) {
  const [season, setSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEpisode, setEditEpisode] = useState(null);

  const fetchSeasonDetails = async () => {
    try {
      setLoading(true);
      const { data } = await instance.get(`/movies/season/details/${seasonId}`);
      setSeason(data.message.season);
      setEpisodes(data.message.episodes);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch season details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seasonId) fetchSeasonDetails();
  }, [seasonId]);

  const deleteEpisodeHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this episode? This action cannot be undone.")) return;
    try {
      await instance.delete(`/movies/episode/delete/${id}`);
      toast.success("Episode deleted successfully");
      fetchSeasonDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete episode");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="size-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Chronicles...</p>
      </div>
    );
  }
 
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-6">
           <button 
              onClick={onBack}
              className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all active:scale-95 border border-white/5 shadow-xl group"
           >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <span className="text-sm font-black text-indigo-400 uppercase tracking-widest">Season {season?.seasonNumber}</span>
                 <span className="size-1 bg-slate-700 rounded-full" />
                 <span className="text-sm font-bold text-slate-500">{episodes.length} Episodes Total</span>
              </div>
              <h3 className="text-3xl font-black text-white">{season?.title || "Season Chronicles"}</h3>
           </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-white text-slate-950 hover:bg-indigo-50 font-black rounded-2xl transition-all shadow-2xl shadow-white/5 active:scale-95 flex items-center gap-2"
        >
          <Plus size={20} />
          Publish New Episode
        </button>
      </div>

      {/* Episodes List */}
      <div className="grid grid-cols-1 gap-4">
        {episodes && episodes.length > 0 ? (
          episodes.map((episode) => (
            <div
              key={episode._id}
              className="group relative bg-slate-800/20 border border-white/5 rounded-3xl p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-slate-800/40 hover:border-indigo-500/30 transition-all duration-300"
            >
              {/* Thumbnail with duration overlay */}
              <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
                 <video
                 controls
                  src={episode.videoUrl}
                  poster={episode.thumbnail}
                  alt={episode.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* <img
                  src={episode.thumbnail}
                  alt={episode.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                /> */}

                {/* <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="p-4 bg-white text-slate-950 rounded-full shadow-2xl">
                      <Play size={24} fill="currentColor" />
                   </div>
                </div>
                <div className="absolute bottom-3 right-3 backdrop-blur-md bg-slate-950/60 text-white px-2 py-1 rounded-md text-[10px] font-black tabular-nums border border-white/10">
                   {episode.duration} min
                </div> */}
              </div>

              {/* Episode Info */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-2.5 py-1 bg-indigo-500/10 rounded-lg">Episode {episode.episodeNumber}</span>
                   {episode.isPremium && (
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">Premium</span>
                   )}
                </div>
                <h4 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
                  {episode.title}
                </h4>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed max-w-2xl font-medium">
                  {episode.description || "No description provided for this episode."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-2 items-center justify-center pr-4">
                  <button
                    onClick={() => setEditEpisode(episode)}
                    className="p-3 bg-slate-800 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
                    title="Edit Metadata"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteEpisodeHandler(episode._id)}
                    className="p-3 bg-slate-800 hover:bg-rose-500/20 rounded-2xl text-slate-400 hover:text-rose-400 transition-all active:scale-90 border border-white/5"
                    title="Delete Episode"
                  >
                    <Trash2 size={18} />
                  </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center space-y-6 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5 shadow-inner">
            <div className="p-8 bg-slate-900 border border-white/5 rounded-full shadow-2xl relative">
               <Video size={56} className="text-slate-800" />
               <div className="absolute top-2 right-2 size-4 bg-indigo-500 rounded-full animate-ping" />
            </div>
            <div className="space-y-2">
               <h4 className="text-2xl font-black text-white">Season is Content-Less</h4>
               <p className="text-slate-500 max-w-sm mx-auto font-medium">This chapter hasn't been written yet. Start uploading high-quality episodes to bring it to life.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddEpisodeModal
          seriesId={seriesId}
          seasonId={seasonId}
          setShowModal={setShowAddModal}
          onEpisodeAdded={fetchSeasonDetails}
        />
      )}
      {editEpisode && (
        <UpdateEpisodeModal
          episode={editEpisode}
          setShowModal={() => setEditEpisode(null)}
          onEpisodeUpdated={fetchSeasonDetails}
        />
      )}
    </div>
  );
}
