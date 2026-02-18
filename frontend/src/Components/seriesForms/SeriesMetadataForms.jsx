import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { Loader2, Lock, Globe, CheckCircle2, Circle } from "lucide-react";
import { multiInstance } from "../../utils/axiosInstance";

export const EditSeriesBasicInfo = ({
  data,
  setSeriesData,
  setUpdateOverViewModal,
}) => {
  const [formData, setFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const genresList = ["Action", "Comedy", "Romantic", "Drama", "Thriller", "Horror"];
  const languagesList = ["English", "Tamil", "Hindi", "Malayalam", "Telugu"];

  useEffect(() => {
    if (data) {
      setFormData({ 
      ...data,
      releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString().split('T')[0] : ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBoolean = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.year) {
      return toast.warning("Title and Year are required");
    }

    setIsUpdating(true);
    const updatedData = new FormData();
    
    const allowedFields = [
      'main_title', 'title', 'year', 'releaseDate', 'rating', 
      'genres', 'language', 'storyline', 'isCompleted', 'premium', 'price'
    ];

    allowedFields.forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null) {
        let value = formData[key];
        if (typeof value === 'boolean') {
          updatedData.append(key, value.toString());
        } else {
          updatedData.append(key, value);
        }
      }
    });

    if (formData.poster instanceof File) {
      updatedData.append("poster", formData.poster);
    }

    try {
      const { data: responseData } = await multiInstance.put(`movies/update/basics/${data._id}`, updatedData);
      setSeriesData((prev) => ({ ...prev, ...responseData.message }));
      setUpdateOverViewModal(null);
      toast.success("Series metadata updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[2000] bg-slate-950/90 backdrop-blur-sm">
      <div className="hide-scrollbar w-full h-full overflow-y-auto">
        <div className="flex min-h-full items-start justify-center pt-24 pb-16 px-4">
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300"
          >
            <button
              type="button"
              className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
              onClick={() => setUpdateOverViewModal(null)}
            >
              <RxCross1 size={24} />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Refine Series Identity</h2>
              <p className="text-slate-500 font-medium">Update the core metadata of your cinematic series</p>
            </div>

            {/* Poster Preview */}
            <div className="flex justify-center mb-10">
              <label className="cursor-pointer group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <img
                  src={formData.preview || data.poster || "https://via.placeholder.com/150"}
                  alt="poster"
                  className="relative w-44 h-64 object-cover rounded-3xl border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData(prev => ({
                        ...prev,
                        poster: file,
                        preview: URL.createObjectURL(file)
                      }));
                    }
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Archive Type</label>
                <div className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-400 p-4 rounded-2xl font-bold text-center">
                  Series Edition
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Production Hub</label>
                <select
                  name="main_title"
                  value={formData.main_title}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                >
                  <option value="">Select Industry</option>
                  <option value="holywood">Hollywood</option>
                  <option value="bollywood">Bollywood</option>
                  <option value="japanise">Japanese</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Series Master Title</label>
              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold placeholder-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Launch Year</label>
                <input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold px-4"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">IMDb Rating</label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold px-4"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Release Date</label>
                <input
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold px-4 [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Core Genre</label>
                <select
                  name="genres"
                  value={formData.genres}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                >
                  <option value="">Select Genre</option>
                  {genresList.map(g => <option key={g} value={g.toLowerCase()}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Primary Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                >
                  <option value="">Select Language</option>
                  {languagesList.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Production Status</label>
                <div 
                  onClick={() => toggleBoolean("isCompleted")}
                  className={`h-[60px] rounded-2xl border transition-all cursor-pointer flex items-center justify-between px-6 ${formData.isCompleted ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border border-slate-700/50 text-slate-400'}`}
                >
                  <div className="flex items-center gap-3">
                    {formData.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    <span className="text-xs font-black uppercase tracking-widest">{formData.isCompleted ? "Completed" : "In Progress"}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${formData.isCompleted ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Access Tier</label>
                <div 
                  onClick={() => toggleBoolean("premium")}
                  className={`h-[60px] rounded-2xl border transition-all cursor-pointer flex items-center justify-between px-6 ${formData.premium ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-slate-800/50 border border-slate-700/50 text-slate-400'}`}
                >
                  <div className="flex items-center gap-3">
                    {formData.premium ? <Lock size={18} /> : <Globe size={18} />}
                    <span className="text-xs font-black uppercase tracking-widest">{formData.premium ? "Premium" : "Standard"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {formData.premium && (
                      <input 
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="$"
                        className="w-16 bg-transparent border-b border-amber-500/30 focus:border-amber-500 text-center text-sm font-bold focus:outline-none"
                      />
                    )}
                    <div className={`w-3 h-3 rounded-full ${formData.premium ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-10">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Series Storyline</label>
              <textarea
                name="storyline"
                rows="4"
                placeholder="Storyline"
                value={formData.storyline}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-600 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white py-5 rounded-2xl font-black shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Syncing Cluster...</span>
                </>
              ) : (
                "Publish Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
