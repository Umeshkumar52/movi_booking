import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Plus, Send, Lock, Globe, CheckCircle2, Circle } from "lucide-react";
import instance, { multiInstance } from "../utils/axiosInstance";

export const EditBasicInfo = ({
  data,
  setMovieData,
  setUpdateOverViewModal,
}) => {
  const [formData, setFormData] = useState({});
  const genresList = ["Action", "Comedy", "Romantic", "Drama", "Thriller", "Horror"];
  const languagesList = ["English", "Tamil", "Hindi", "Malayalam", "Telugu"];
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
       if(name==="rating"&&value>10){
      alert("Enter rating between 1 to 10")
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const updatedData = new FormData();
    const allowedFields = [
       'main_title', 'title', 'Category', 'year', 'duration', 
       'rating', 'price', 'genres', 'language', 'storyline', 'releaseDate'
    ];
    allowedFields.forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null) {
        updatedData.append(key, formData[key]);
      }
    });
    if (formData.poster instanceof File) {
      updatedData.append("poster", formData.poster);
    }

    try {
      const {data: responseData} = await multiInstance.put(`movies/update/basics/${data._id}`, updatedData);
      setMovieData((prev) => ({ ...prev, ...responseData.message }));
      setUpdateOverViewModal(null);
      toast.success("Details updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    setFormData({ ...data });
  }, [data]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return createPortal(
    <div className="fixed z-[2000] inset-0 bg-slate-950/90 backdrop-blur-sm">
      <div className="hide-scrollbar w-full h-full overflow-y-auto">
        <div className="flex min-h-full items-start justify-center pt-24 pb-16 px-4">
          <form className="relative w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300">
            <button
              type="button"
              className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
              onClick={() => setUpdateOverViewModal(null)}
            >
              <RxCross1 size={24} />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Edit Production Details</h2>
              <p className="text-slate-500 font-medium">Update the cinematic metadata of your masterpiece</p>
            </div>

            <div className="flex justify-center mb-10">
              <label className="cursor-pointer group relative">
                <img
                  src={formData.preview || data.poster || "https://via.placeholder.com/150"}
                  alt="poster"
                  className="w-40 h-56 object-cover rounded-2xl border border-white/10 transition-transform group-hover:scale-[1.02]"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Category</label>
                <select
                  name="Category"
                  value={formData.Category || formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                >
                  <option value="movie">Movie</option>
                  <option value="series">Series</option>
                </select>
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
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Official Master Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold placeholder-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Launch Year</label>
                <input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Film Duration (Min)</label>
                <input
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">IMDb Rating</label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Access Price</label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
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

            <div className="space-y-2 mb-10">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Master Storyline</label>
              <textarea
                name="storyline"
                rows="4"
                value={formData.storyline}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-slate-600 resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white py-5 rounded-2xl font-black shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Syncing Changes...</span>
                </>
              ) : (
                "Update Production Specs"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const UpdateMovieMedia = ({
  setMovieData,
  updateMovieMediaModal,
  setUpdateMovieMediaModal,
}) => {
  const fileRef = useRef();
  const { _id } = useParams();
  const [media, setMedia] = useState({
    videoFile: null,
    thumbnail: null,
    videoPreview: "",
    thumbName: "No file selected.",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const existingVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia((prev) => ({
        ...prev,
        videoFile: file,
        videoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleThumbChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia((prev) => ({
        ...prev,
        thumbnail: file,
        thumbName: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!media.videoFile && !media.thumbnail) return toast.info("No changes to update");
    setIsUpdating(true);
    const formData = new FormData();
    if (media.videoFile) formData.append("media", media.videoFile);
    if (media.thumbnail) formData.append("poster", media.thumbnail);
    try {
      const { data } = await multiInstance.patch(`/movies/update/media/${_id}`, formData);
      setMovieData((prev) => ({ ...prev, media: data.message.media, poster: data.message.poster }));
      setUpdateMovieMediaModal(null);
      toast.success("Media updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Media update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return createPortal(
    <div className="fixed z-[2000] inset-0 bg-slate-950/90 backdrop-blur-sm">
      <div className="hide-scrollbar w-full h-full overflow-y-auto">
        <div className="flex min-h-full items-start justify-center pt-24 pb-16 px-4">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300"
          >
            <button
              type="button"
              className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
              onClick={() => setUpdateMovieMediaModal(null)}
            >
              <RxCross1 size={24} />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Update Visual Sequence</h2>
              <p className="text-slate-500 font-medium">Coordinate the primary video master and key art</p>
            </div>

            <div className="space-y-4 mb-8">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Master Video File</label>
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-white/10 shadow-2xl group">
                <video
                  src={media.videoPreview || updateMovieMediaModal?.media || existingVideoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="relative group">
                <input type="file" hidden ref={fileRef} accept="video/*" onChange={handleVideoChange} />
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-400 p-4 rounded-2xl hover:border-indigo-500/50 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  Change Video Master
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Key Art / Thumbnail</label>
              <div className="flex items-center gap-4">
                <label className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 px-6 py-3 rounded-2xl cursor-pointer transition-all font-bold text-xs uppercase tracking-widest">
                  Browse Art
                  <input type="file" hidden accept="image/*" onChange={handleThumbChange} />
                </label>
                <span className="text-slate-400 text-sm font-medium">{media.thumbName}</span>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setUpdateMovieMediaModal(null)}
                className="px-8 py-4 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-10 py-4 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
              >
                {isUpdating ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                Sync Media
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const UpdateTrailer = ({
  setMovieData,
  data,
  setUpdateTrailerModal,
}) => {
  const fileRef = useRef();
  const { _id } = useParams();
  const [media, setMedia] = useState({
    videoFile: null,
    thumbnail: null,
    videoPreview: "",
    thumbName: "No file selected.",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const existingVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia((prev) => ({
        ...prev,
        videoFile: file,
        videoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleThumbChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia((prev) => ({
        ...prev,
        thumbnail: file,
        thumbName: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!media.videoFile && !media.thumbnail) return toast.info("No changes to update");
    setIsUpdating(true);
    const formData = new FormData();
    if (media.videoFile) formData.append("trailerMedia", media.videoFile);
    if (media.thumbnail) formData.append("trailerPoster", media.thumbnail);
    try {
      const { data } = await multiInstance.patch(`/movies/update/trailer/${_id}`, formData);
      setMovieData((prev) => ({ ...prev, trailer: data.message.trailer }));
      setUpdateTrailerModal(prev => !prev);
      toast.success("Trailer updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Trailer update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return createPortal(
    <div className="fixed z-[2000] inset-0 bg-slate-950/90 backdrop-blur-sm">
      <div className="hide-scrollbar w-full h-full overflow-y-auto">
        <div className="flex min-h-full items-start justify-center pt-24 pb-16 px-4">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300"
          >
            <button
              type="button"
              className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
              onClick={() => setUpdateTrailerModal(null)}
            >
              <RxCross1 size={24} />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Refine Promo Trailer</h2>
              <p className="text-slate-500 font-medium">Update the promotional sequence for your cinematic series</p>
            </div>

            <div className="space-y-4 mb-8">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Trailer Video</label>
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-white/10 shadow-2xl group">
                <video src={media.videoPreview || data?.media || existingVideoUrl} controls className="w-full h-full object-contain" />
              </div>
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-400 p-4 rounded-2xl hover:border-indigo-500/50 transition-all font-bold text-xs uppercase tracking-widest"
              >
                Change Trailer Footage
              </button>
              <input type="file" hidden ref={fileRef} accept="video/*" onChange={handleVideoChange} />
            </div>

            <div className="space-y-4 mb-10">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Trailer Key Art</label>
              <div className="flex items-center gap-4">
                <label className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 px-6 py-3 rounded-2xl cursor-pointer transition-all font-bold text-xs uppercase tracking-widest">
                  Browse Poster
                  <input type="file" hidden accept="image/*" onChange={handleThumbChange} />
                </label>
                <span className="text-slate-400 text-sm font-medium">{media.thumbName}</span>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setUpdateTrailerModal(null)}
                className="px-8 py-4 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-10 py-4 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
              >
                {isUpdating ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                Sync Trailer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const AddCrew = ({ setCrewData, movie_id, setaddCrewModal }) => {
  const [crew, setCrew] = useState({ name: "", role: "", description: "", image: null, imageName: "No file selected." });
  const [isUpdating, setIsUpdating] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 50) return;
    setCrew(prev => ({ ...prev, [name]: value }));
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setCrew(prev => ({ ...prev, image: file, imageName: file.name }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crew.name || !crew.role) return toast.warning("Name and Role are required");
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("name", crew.name);
    formData.append("role", crew.role);
    formData.append("description", crew.description);
    if (crew.image) formData.append("avatar", crew.image);
    formData.append("movie_id", movie_id);
    try {
      const { data } = await multiInstance.post("/movies/crew/add", formData);
      setCrewData(prev => [data.message, ...prev]);
      setaddCrewModal(false);
      toast.success("Crew member added successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add crew");
    } finally { setIsUpdating(false); }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return createPortal(
    <div className="fixed z-[2000] inset-0 bg-slate-950/90 backdrop-blur-sm">
      <div className="hide-scrollbar w-full h-full overflow-y-auto">
        <div className="flex min-h-full items-start justify-center pt-24 pb-16 px-4">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300"
          >
            <button type="button" className="absolute top-8 right-8 text-slate-400 hover:text-white" onClick={() => setaddCrewModal(false)}>
              <RxCross1 size={24} />
            </button>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Recruit New Crew</h2>
              <p className="text-slate-500 font-medium">Expand your production team with new talent</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Name</label>
                <input name="name" value={crew.name} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Role</label>
                <input name="role" value={crew.role} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Bio (Max 50 Chars)</label>
                <textarea name="description" value={crew.description} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" rows="3" />
              </div>
              <div className="space-y-4 mb-10">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Avatar Art</label>
                <div className="flex items-center gap-4">
                  <label className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-6 py-3 rounded-2xl cursor-pointer font-bold text-xs uppercase tracking-widest">
                    Select Avatar
                    <input type="file" hidden accept="image/*" onChange={handleImage} />
                  </label>
                  <span className="text-slate-400 text-sm">{crew.imageName}</span>
                </div>
              </div>
            </div>
            <button type="submit" disabled={isUpdating} className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-5 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 mt-8">
              {isUpdating ? <Loader2 className="animate-spin" /> : <Plus />} Recruit Member
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const AddCast = ({ setActor, movie_id, setAddCastModal }) => {
  const [crew, setCrew] = useState({ name: "", role: "", description: "", image: null, imageName: "No file selected." });
  const [isUpdating, setIsUpdating] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 50) return;
    setCrew(prev => ({ ...prev, [name]: value }));
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setCrew(prev => ({ ...prev, image: file, imageName: file.name }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crew.name || !crew.role) return toast.warning("Name and Role are required");
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("name", crew.name);
    formData.append("role", crew.role);
    formData.append("description", crew.description);
    if (crew.image) formData.append("avatar", crew.image);
    formData.append("movie_id", movie_id);
    try {
      const { data } = await multiInstance.post("/movies/actor/add", formData);
      setActor(prev => [data.message, ...prev]);
      setAddCastModal(false);
      toast.success("Cast member added successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add cast");
    } finally { setIsUpdating(false); }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return createPortal(
    <div className="fixed z-[2000] inset-0 bg-slate-950/90 backdrop-blur-sm">
      <div className="hide-scrollbar w-full h-full overflow-y-auto">
        <div className="flex min-h-full items-start justify-center pt-24 pb-16 px-4">
          <form className="relative w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300">
            <button type="button" className="absolute top-8 right-8 text-slate-400 hover:text-white" onClick={() => setAddCastModal(false)}>
              <RxCross1 size={24} />
            </button>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Enlist New Cast</h2>
              <p className="text-slate-500 font-medium">Introduce new characters to your series narrative</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Name</label>
                <input name="name" value={crew.name} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Role</label>
                <input name="role" value={crew.role} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Bio (Max 50 Chars)</label>
                <textarea name="description" value={crew.description} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" rows="3" />
              </div>
              <div className="space-y-4 mb-10">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Headshot / Avatar</label>
                <div className="flex items-center gap-4">
                  <label className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-6 py-3 rounded-2xl cursor-pointer font-bold text-xs uppercase tracking-widest">
                    Select File
                    <input type="file" hidden accept="image/*" onChange={handleImage} />
                  </label>
                  <span className="text-slate-400 text-sm">{crew.imageName}</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={handleSubmit} disabled={isUpdating} className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-5 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 mt-8">
              {isUpdating ? <Loader2 className="animate-spin" /> : <Plus />} Enlist Character
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const UpdateCrew = ({ updatedata, setCrewData, updateCrewData, setUpdateCrewModal }) => {
  const [crew, setCrew] = useState({ _id: "", name: "", role: "", description: "", image: null, imageName: "No file selected." });
  const [isUpdating, setIsUpdating] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 50) return;
    setCrew(prev => ({ ...prev, [name]: value }));
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setCrew(prev => ({ ...prev, image: file, imageName: file.name }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("name", crew.name);
    formData.append("role", crew.role);
    formData.append("description", crew.description);
    if (crew.image instanceof File) formData.append("avatar", crew.image);
    formData.append("_id", crew._id);
    try {
      const { data } = await multiInstance.put(`/movies/crew/update?_id=${crew._id}`, formData);
      updatedata(data.message);
      setUpdateCrewModal(null);
      toast.success("Crew member updated successfully");
    } catch (error) { toast.error(error?.response?.data?.message || "Update failed");
    } finally { setIsUpdating(false); }
  };

  useEffect(() => { setCrew(updateCrewData); }, []);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return createPortal(
    <div className="fixed z-[2000] inset-0 bg-slate-950/90 backdrop-blur-sm">
      <div className="hide-scrollbar w-full h-full overflow-y-auto">
        <div className="flex min-h-full items-start justify-center pt-24 pb-16 px-4">
          <form onSubmit={handleSubmit} className="relative w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300">
            <button type="button" className="absolute top-8 right-8 text-slate-400 hover:text-white" onClick={() => setUpdateCrewModal(null)}>
              <RxCross1 size={24} />
            </button>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Update Crew Details</h2>
              <p className="text-slate-500 font-medium">Refine personnel information for your production</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Name</label>
                <input name="name" value={crew.name} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Role</label>
                <input name="role" value={crew.role} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Bio (Max 50 Chars)</label>
                <textarea name="description" value={crew.description} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" rows="3" />
              </div>
              <div className="space-y-4 mb-10">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Avatar Art</label>
                <div className="flex items-center gap-4">
                  <label className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-6 py-3 rounded-2xl cursor-pointer font-bold text-xs uppercase tracking-widest">
                    Change Avatar
                    <input type="file" hidden accept="image/*" onChange={handleImage} />
                  </label>
                  <span className="text-slate-400 text-sm">{crew.imageName}</span>
                </div>
              </div>
            </div>
            <button type="submit" disabled={isUpdating} className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-5 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 mt-8">
              {isUpdating ? <Loader2 className="animate-spin" /> : "Update Member"}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const UpdateCast = ({ movie_id, updateCastModal, setActor, setUpddateCastModal }) => {
  const [crew, setCrew] = useState({ _id: "", name: "", role: "", description: "", image: null, imageName: "No file selected." });
  const [isUpdating, setIsUpdating] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 50) return;
    setCrew(prev => ({ ...prev, [name]: value }));
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setCrew(prev => ({ ...prev, image: file, imageName: file.name }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("name", crew.name);
    formData.append("role", crew.role);
    formData.append("description", crew.description);
    if (crew.image instanceof File) formData.append("avatar", crew.image);
    formData.append("_id", crew._id);
    try {
      const { data } = await multiInstance.put(`/movies/actor/update?_id=${updateCastModal._id}`, formData);
      setActor(prev => prev.map(item => (item._id == updateCastModal._id ? data.message : item)));
      setUpddateCastModal(null);
      toast.success("Cast member updated successfully");
    } catch (error) { toast.error(error?.response?.data?.message || "Update failed");
    } finally { setIsUpdating(false); }
  };
  useEffect(() => { setCrew(updateCastModal); }, []);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return createPortal(
    <div className="fixed z-[2000] inset-0 bg-slate-950/90 backdrop-blur-sm">
      <div className="hide-scrollbar w-full h-full overflow-y-auto">
        <div className="flex min-h-full items-start justify-center pt-24 pb-16 px-4">
          <form onSubmit={handleSubmit} className="relative w-full max-w-2xl bg-slate-900 border border-white/10 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 animate-in fade-in zoom-in-95 duration-300">
            <button type="button" className="absolute top-8 right-8 text-slate-400 hover:text-white" onClick={() => setUpddateCastModal(null)}>
              <RxCross1 size={24} />
            </button>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2">Update Cast Profile</h2>
              <p className="text-slate-500 font-medium">Refine actor information for your series character</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Name</label>
                <input name="name" value={crew.name} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Role</label>
                <input name="role" value={crew.role} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Bio (Max 50 Chars)</label>
                <textarea name="description" value={crew.description} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" rows="3" />
              </div>
              <div className="space-y-4 mb-10">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black ml-1">Headshot / Avatar</label>
                <div className="flex items-center gap-4">
                  <label className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-6 py-3 rounded-2xl cursor-pointer font-bold text-xs uppercase tracking-widest">
                    Update Photo
                    <input type="file" hidden accept="image/*" onChange={handleImage} />
                  </label>
                  <span className="text-slate-400 text-sm">{crew.imageName}</span>
                </div>
              </div>
            </div>
            <button type="submit" disabled={isUpdating} className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-5 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 mt-8">
              {isUpdating ? <Loader2 className="animate-spin" /> : "Update Member"}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
