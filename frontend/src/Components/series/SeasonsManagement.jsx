import { useContext, useState } from "react";
import { Plus, Edit, Trash2, Calendar, Hash, PlayCircle, MoreVertical, Layers } from "lucide-react";
import { AddSeasonModal, UpdateSeasonModal } from "../seriesForms/SeasonForms";
import instance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import {AuthContext} from '../../context/AuthProvider'
export default function SeasonsManagement({ seriesId, seasons, refreshData, onManageEpisodes }) {
  const{user} =useContext(AuthContext)
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSeason, setEditSeason] = useState(null);

  const deleteSeasonHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this season? All associated episodes will be lost.")) return;
    try {
      await instance.delete(`/movies/season/delete?_id=${id}`);
      toast.success("Season deleted successfully");
      refreshData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete season");
    }
  };

  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Add Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-8">
        <div>
          <h3 className="text-2xl font-black text-white">Season Chronicles</h3>
          <p className="text-slate-500 text-sm">Manage the chapters of your cinematic journey</p>
        </div>
       {user?.role==="admin"&& <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Season
        </button>}
      </div>

      {/* Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {seasons && seasons.length > 0 ? (
          seasons.map((season) => (
            <div
              key={season._id}
              className="group relative bg-slate-800/20 border border-white/5 rounded-[2rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5"
            >
              {/* Season Banner */}
              <div className="relative aspect-[21/9] overflow-hidden">
                <img
                  src={season.banner}
                  alt={`Season ${season.seasonNumber}`}
                  className="w-full h-full aspect-video transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                <div className="absolute top-4 left-4 backdrop-blur-md bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                  Season {season.seasonNumber}
                </div>
              </div>

              {/* Season Content */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {season.title || `Season ${season.seasonNumber}`}
                    </h4>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {season.description || "No description provided for this chapter."}
                    </p>
                  </div>
                 {user?.role==="admin"&& <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditSeason(season)}
                      className="p-2 bg-slate-800 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
                      title="Edit Season"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteSeasonHandler(season._id)}
                      className="p-2 bg-slate-800 hover:bg-rose-500/20 rounded-xl text-slate-400 hover:text-rose-400 transition-all active:scale-90"
                      title="Delete Season"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-400">
                    <div className="p-1.5 bg-slate-800/50 rounded-lg">
                      <PlayCircle size={14} className="text-blue-400" />
                    </div>
                    <span className="font-bold">{season.totalEpisodes || 0} Episodes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-400">
                    <div className="p-1.5 bg-slate-800/50 rounded-lg">
                      <Calendar size={14} className="text-indigo-400" />
                    </div>
                    <span className="font-bold">{season.releaseDate ? new Date(season.releaseDate).getFullYear() : 'TBD'}</span>
                  </div>
                </div>

                {/* Episode Management Link */}
                <button 
                   onClick={() => onManageEpisodes(season._id)}
                   className="w-full mt-2 py-3 bg-white/5 hover:bg-indigo-600 border border-white/5 hover:border-indigo-500 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  { user?.role==="admin"? "Management Episodes":"Show Episodes"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="p-6 bg-slate-900 border border-white/5 rounded-full shadow-inner">
               <Layers size={48} className="text-slate-700" />
            </div>
            <div className="space-y-2">
               <h4 className="text-xl font-bold text-white">No Seasons Found</h4>
               <p className="text-slate-500 max-w-sm mx-auto">This series is currently empty. Start by adding a debut season to organize your content.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddSeasonModal
          seriesId={seriesId}
          setShowModal={setShowAddModal}
          onSeasonAdded={refreshData}
        />
      )}
      {editSeason && (
        <UpdateSeasonModal
          season={editSeason}
          setShowModal={() => setEditSeason(null)}
          onSeasonUpdated={refreshData}
        />
      )}
    </div>
  );
}
