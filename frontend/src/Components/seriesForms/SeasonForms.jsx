import { useState } from "react";
import { createPortal } from "react-dom";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { Loader2, Send, ImageIcon } from "lucide-react";
import { multiInstance } from "../../utils/axiosInstance";

export const AddSeasonModal = ({ seriesId, setShowModal, onSeasonAdded }) => {
  const [formData, setFormData] = useState({
    seasonNumber: "",
    title: "",
    description: "",
    releaseDate: "",
    totalEpisodes: "",
    banner: null,
    bannerPreview: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        banner: file,
        bannerPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.seasonNumber || !formData.title || !formData.banner) {
      return toast.warning("Season number, title, and banner are required");
    }

    setIsAdding(true);
    const data = new FormData();
    data.append("series", seriesId);
    data.append("seasonNumber", formData.seasonNumber);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("releaseDate", formData.releaseDate);
    data.append("totalEpisodes", formData.totalEpisodes);
    data.append("banner", formData.banner);

    try {
      const response = await multiInstance.post(`/movies/season/add`, data);
      onSeasonAdded(response.data.message);
      toast.success("Season created successfully");
      setShowModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Creation failed");
    } finally {
      setIsAdding(false);
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
              onClick={() => setShowModal(false)}
            >
              <RxCross1 size={24} />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Expand the Universe</h2>
              <p className="text-slate-500 font-medium">Add a new season to your cinematic collection</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Season Number</label>
                <input
                  name="seasonNumber"
                  type="number"
                  placeholder="e.g. 1"
                  value={formData.seasonNumber}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Season Title</label>
                <input
                  name="title"
                  placeholder="e.g. Genesis"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold placeholder-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Launch Date</label>
                <input
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Total Episodes</label>
                <input
                  name="totalEpisodes"
                  type="number"
                  placeholder="e.g. 10"
                  value={formData.totalEpisodes}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Season Description</label>
              <textarea
                name="description"
                rows="3"
                placeholder="The journey continues..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-600 resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-3 mb-10">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Official Banner Art</label>
              <div className="relative group cursor-pointer w-full aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 transition-all bg-slate-800/30">
                {formData.bannerPreview ? (
                  <img src={formData.bannerPreview} className="w-full h-full object-cover group-hover:opacity-50 transition-all duration-500" alt="banner preview" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                    <ImageIcon className="size-10 mb-2 opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Banner 16:9</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white py-5 rounded-2xl font-black shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Creating Season...</span>
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  <span>Publish Season</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const UpdateSeasonModal = ({ season, setShowModal, onSeasonUpdated }) => {
  const [formData, setFormData] = useState({
    seasonNumber: season.seasonNumber,
    title: season.title,
    description: season.description || "",
    releaseDate: season.releaseDate ? new Date(season.releaseDate).toISOString().split("T")[0] : "",
    totalEpisodes: season.totalEpisodes || "",
    banner: null,
    bannerPreview: season.banner || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        banner: file,
        bannerPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const data = new FormData();
    data.append("seasonNumber", formData.seasonNumber);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("releaseDate", formData.releaseDate);
    data.append("totalEpisodes", formData.totalEpisodes);
    if (formData.banner) {
      data.append("banner", formData.banner);
    }

    try {
      const response = await multiInstance.put(`/movies/season/update?_id=${season._id}`, data);
      onSeasonUpdated(response.data.message);
      toast.success("Season updated successfully");
      setShowModal(false);
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
              onClick={() => setShowModal(false)}
            >
              <RxCross1 size={24} />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Adjust Season</h2>
              <p className="text-slate-500 font-medium">Refine the metadata of this seasonal edition</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Season Number</label>
                <input
                  name="seasonNumber"
                  type="number"
                  value={formData.seasonNumber}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Season Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold placeholder-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Launch Date</label>
                <input
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Total Episodes</label>
                <input
                  name="totalEpisodes"
                  type="number"
                  value={formData.totalEpisodes}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Season Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-600 resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-3 mb-10">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Update Banner Art</label>
              <div className="relative group cursor-pointer w-full aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 transition-all bg-slate-800/30">
                {formData.bannerPreview ? (
                  <img src={formData.bannerPreview} className="w-full h-full object-cover group-hover:opacity-50 transition-all duration-500" alt="banner preview" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                    <ImageIcon className="size-10 mb-2 opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Banner 16:9</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white py-5 rounded-2xl font-black shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Propagating Changes...</span>
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  <span>Update Season</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
