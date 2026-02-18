import { useState } from "react";
import { createPortal } from "react-dom";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { Loader2, Send, ImageIcon, Video } from "lucide-react";
import { multiInstance } from "../../utils/axiosInstance";

export const AddEpisodeModal = ({ seriesId, seasonId, setShowModal, onEpisodeAdded }) => {
  const [formData, setFormData] = useState({
    episodeNumber: "",
    title: "",
    description: "",
    duration: "",
    video: null,
    thumbnail: null,
    videoPreview: "",
    thumbnailPreview: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
        [`${name}Preview`]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.episodeNumber || !formData.title || !formData.video || !formData.thumbnail || !formData.duration) {
      return toast.warning("Episode number, title, video, thumbnail, and duration are required");
    }

    setIsAdding(true);
    const data = new FormData();
    data.append("series", seriesId);
    data.append("season", seasonId);
    data.append("episodeNumber", formData.episodeNumber);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("duration", formData.duration);
    data.append("video", formData.video);
    data.append("thumbnail", formData.thumbnail);

    try {
      const response = await multiInstance.post(`/movies/episode/add`, data);
      onEpisodeAdded(response.data.message);
      toast.success("Episode published successfully");
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
            className="relative w-full max-w-3xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300"
          >
            <button
              type="button"
              className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
              onClick={() => setShowModal(false)}
            >
              <RxCross1 size={24} />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">New Broadcast</h2>
              <p className="text-slate-500 font-medium">Deploy a new episode to the cinematic cluster</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Episode Code</label>
                <input
                  name="episodeNumber"
                  type="number"
                  placeholder="e.g. 1"
                  value={formData.episodeNumber}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Runtime (Min)</label>
                <input
                  name="duration"
                  type="number"
                  placeholder="e.g. 45"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Episode Title</label>
                <input
                  name="title"
                  placeholder="e.g. The Awakening"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Episode Narrative</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Briefly describe the events in this chapter..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-600 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Episode Master File</label>
                <div className="relative group cursor-pointer aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 transition-all bg-slate-800/30">
                  {formData.videoPreview ? (
                    <video src={formData.videoPreview} className="w-full h-full object-cover" controls />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                      <Video className="size-10 mb-2 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Video</span>
                    </div>
                  )}
                  <input
                    name="video"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Episode Thumbnail</label>
                <div className="relative group cursor-pointer aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 transition-all bg-slate-800/30">
                  {formData.thumbnailPreview ? (
                    <img src={formData.thumbnailPreview} className="w-full h-full object-cover" alt="thumbnail preview" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                      <ImageIcon className="size-10 mb-2 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Thumbnail</span>
                    </div>
                  )}
                  <input
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
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
                  <span>Transmitting File...</span>
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  <span>Publish Episode</span>
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

export const UpdateEpisodeModal = ({ episode, setShowModal, onEpisodeUpdated }) => {
  const [formData, setFormData] = useState({
    episodeNumber: episode.episodeNumber,
    title: episode.title,
    description: episode.description || "",
    duration: episode.duration || "",
    video: null,
    thumbnail: null,
    videoPreview: episode.video || "",
    thumbnailPreview: episode.thumbnail || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
        [`${name}Preview`]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const data = new FormData();
    data.append("series", episode.series);
    data.append("season", episode.season);
    data.append("episodeNumber", formData.episodeNumber);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("duration", formData.duration);
    if (formData.video) data.append("video", formData.video);
    if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);

    try {
      const response = await multiInstance.put(`/movies/episode/update?_id=${episode._id}`, data);
      onEpisodeUpdated(response.data.message);
      toast.success("Episode updated successfully");
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
            className="relative w-full max-w-3xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300"
          >
            <button
              type="button"
              className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
              onClick={() => setShowModal(false)}
            >
              <RxCross1 size={24} />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Sync Broadcast</h2>
              <p className="text-slate-500 font-medium">Coordinate updates across the cinematic cluster</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Episode Code</label>
                <input
                  name="episodeNumber"
                  type="number"
                  value={formData.episodeNumber}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Runtime (Min)</label>
                <input
                  name="duration"
                  type="number"
                  placeholder="e.g. 45"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Episode Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Episode Narrative</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-600 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Update Master File</label>
                <div className="relative group cursor-pointer aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 transition-all bg-slate-800/30">
                  {formData.videoPreview ? (
                    <video src={formData.videoPreview} className="w-full h-full object-cover" controls />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                      <Video className="size-10 mb-2 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Video</span>
                    </div>
                  )}
                  <input
                    name="video"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Update Thumbnail</label>
                <div className="relative group cursor-pointer aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 transition-all bg-slate-800/30">
                  {formData.thumbnailPreview ? (
                    <img src={formData.thumbnailPreview} className="w-full h-full object-cover" alt="thumbnail preview" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                      <ImageIcon className="size-10 mb-2 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Thumbnail</span>
                    </div>
                  )}
                  <input
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
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
                  <span>Syncing Cluster...</span>
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  <span>Publish Changes</span>
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
