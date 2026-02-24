import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCloudUpload } from "react-icons/bs";
import { toast } from "react-toastify";
import { RiInformation2Fill } from "react-icons/ri";
import { Loader2, Send, Image as ImageIcon, Plus } from "lucide-react";
import { multiInstance } from "../utils/axiosInstance";
import MediaForm from "../Components/moviForms/MediaForm";
import TrailerForm from "../Components/moviForms/TrailerForm";
export default function AddMovi({ toggle, setAddNewMoviToggle, setMovies }) {
  const [movidata, setMovidata] = useState({
    main_title: "",
    title: "",
    Category: "movie",
    duration: "",
    year: "",
    releaseDate: "",
    rating: "",
    language: "hindi",
    genres: "",
    storyline: "",
    premium: false,
    price: "",
    totalSeasons: 0,
    totalEpisodes: 0,
    isCompleted: false,
  });
  const genresList = [
    "Action",
    "Comedy",
    "Romantic",
    "Drama",
    "Thriller",
    "Horror",
  ];
  const languagesList = ["English", "Tamil", "Hindi", "Malayalam", "Telugu"];
  const [files, setFiles] = useState({
    poster: null,
    media: null,
    trailerPoster: null,
    trailerMedia: null,
  });
  const [form, setForm] = useState(0);

  function nextFormHandler(event) {
    event.preventDefault();
    setForm((prev) => prev + 1);
  }

  function fileChangeHandler(event) {
    event.preventDefault();
    const { name } = event.target;
    const value = event.target.files[0];
    setFiles({
      ...files,
      [name]: value,
    });
  }

  const [isAdding, setIsAdding] = useState(false);

  function dataChangeHandler(event) {
    const { name, value, type, checked } = event.target;
    if(name==="rating"&&value>10){
      alert("Enter rating between 1 to 10")
      return
    }
    setMovidata({
      ...movidata,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function uploadHandler(event) {
    event?.preventDefault();

    // Basic validation
    if (!files.poster) {
      return toast.error("Please upload the official poster art");
    }
    if (!files.media && movidata.Category === "movie") {
      return toast.error("Please upload the movie master file");
    }

    setIsAdding(true);
    const formData = new FormData();
    for (const key in movidata) {
      formData.append(key, movidata[key]);
    }

    formData.append("poster", files.poster);
    if (files.media) formData.append("media", files.media);
    if (files.trailerPoster)
      formData.append("trailerPoster", files.trailerPoster);
    if (files.trailerMedia) formData.append("trailerMedia", files.trailerMedia);

    try {
      const res = await multiInstance.post("/movies/create", formData);
      setMovies((prev) => [res.data.message, ...prev]);
      setAddNewMoviToggle(false);
      toast.success(
        `${movidata.Category === "movie" ? "Movie" : "Series"} Created Successfully`,
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create content.",
      );
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="w-screen h-screen hide-scrollbar overflow-y-auto fixed inset-0 z-[2000] bg-slate-950 flex flex-col items-center">
      {/* Premium Glass Header */}
      <div className="w-full sticky z-[2001] top-0 flex p-6 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 justify-between items-center px-10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <RiInformation2Fill className="text-2xl text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white tracking-tight">
            Create Cinematic Masterpiece
          </p>
        </div>
        <button
          onClick={() => toggle((prev) => !prev)}
          className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all active:scale-90"
        >
          <RxCross1 className="text-2xl" />
        </button>
      </div>

      <div className="w-full max-w-4xl px-6 py-12">
        <div className="relative rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
          {form === 0 ? (
            // Basic information page
            <form className="p-10 space-y-8">
              <div className="pb-6 border-b border-white/5 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black text-white">
                    Basic Information
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Provide the core identity of your {movidata.Category}.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-2xl border border-white/5">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-2">
                    Premium
                  </span>
                  <input
                    type="checkbox"
                    name="premium"
                    checked={movidata.premium}
                    onChange={dataChangeHandler}
                    className="size-5 rounded-lg border-white/10 bg-slate-900 checked:bg-indigo-500 transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Poster Art Upload */}
              <div className="flex justify-center pb-8 border-b border-white/5">
                <div className="w-full max-w-[200px] flex flex-col items-center gap-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                    Official Poster Art
                  </label>
                  <label className="relative group cursor-pointer w-full aspect-[2/3] rounded-3xl overflow-hidden border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 transition-all bg-slate-800/30">
                    {files.poster ? (
                      <img
                        src={URL.createObjectURL(files.poster)}
                        className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                        alt="Poster Preview"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                        <ImageIcon className="size-10 mb-2 opacity-20" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">
                          Select Poster
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      name="poster"
                      accept="image/*"
                      onChange={fileChangeHandler}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <Plus className="text-white size-8" />
                    </div>
                  </label>
                  {files.poster && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setFiles((p) => ({ ...p, poster: null }));
                      }}
                      className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors"
                    >
                      Change Art
                    </button>
                  )}
                </div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                    Film Industry
                  </label>
                  <select
                    value={movidata.main_title}
                    onChange={dataChangeHandler}
                    name="main_title"
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 appearance-none transition-all"
                  >
                    <option value="" className="bg-slate-900">
                      -- Select Industry --
                    </option>
                    <option value="hollywood" className="bg-slate-900">
                      Hollywood
                    </option>
                    <option value="horror" className="bg-slate-900">
                      Horror
                    </option>
                    <option value="bollywood" className="bg-slate-900">
                      Bollywood
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                    Category
                  </label>
                  <select
                    value={movidata.Category}
                    onChange={dataChangeHandler}
                    name="Category"
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 appearance-none transition-all font-bold text-indigo-400"
                  >
                    <option value="movie" className="bg-slate-900">
                      Movie
                    </option>
                    <option value="series" className="bg-slate-900">
                      Series (TV Show)
                    </option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                    Title
                  </label>
                  <input
                    onChange={dataChangeHandler}
                    value={movidata.title}
                    name="title"
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 placeholder-slate-600 transition-all"
                    placeholder={
                      movidata.Category === "movie"
                        ? "e.g. Inception"
                        : "e.g. Breaking Bad"
                    }
                  />
                </div>

                {movidata.Category === "movie" ? (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                      Duration (Min)
                    </label>
                    <input
                      onChange={dataChangeHandler}
                      value={movidata.duration}
                      name="duration"
                      type="number"
                      placeholder="120"
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 transition-all"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                        Seasons
                      </label>
                      <input
                        onChange={dataChangeHandler}
                        value={movidata.totalSeasons}
                        name="totalSeasons"
                        type="number"
                        disabled
                        className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                        Episodes
                      </label>
                      <input
                        onChange={dataChangeHandler}
                        value={movidata.totalEpisodes}
                        name="totalEpisodes"
                        disabled
                        type="number"
                        className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                    Release Year
                  </label>
                  <input
                    value={movidata.year}
                    onChange={dataChangeHandler}
                    name="year"
                    type="number"
                    placeholder="2024"
                    maxLength={4}
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                    Exact Date
                  </label>
                  <input
                    value={movidata.releaseDate}
                    onChange={dataChangeHandler}
                    name="releaseDate"
                    type="date"
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 transition-all [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                    Rating (/10)
                  </label>
                  <input
                  name="rating"
                    type="number"
                    maxLength={1}
                    value={movidata.rating}
                    onChange={dataChangeHandler}
                    placeholder="1-9 only"
                    step="0.1"
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 transition-all"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                    Primary Language
                  </label>
                  <select
                    value={movidata.language}
                    onChange={dataChangeHandler}
                    name="language"
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 appearance-none transition-all"
                  >
                    <option value="hindi" className="bg-slate-900">
                      Hindi
                    </option>
                    <option value="english" className="bg-slate-900">
                      English
                    </option>
                    <option value="tamil" className="bg-slate-900">
                      Tamil
                    </option>
                    <option value="telugu" className="bg-slate-900">
                      Telugu
                    </option>
                    <option value="malayalam" className="bg-slate-900">
                      Malayalam
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                    Genre
                  </label>
                  <select
                    value={movidata.genres}
                    onChange={dataChangeHandler}
                    name="genres"
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 appearance-none transition-all"
                  >
                    <option value="" className="bg-slate-900">
                      -- Select Genre --
                    </option>
                    <option value="comedy" className="bg-slate-900">
                      Comedy
                    </option>
                    <option value="romance" className="bg-slate-900">
                      Romantic
                    </option>
                    <option value="action" className="bg-slate-900">
                      Action
                    </option>
                    <option value="thriller" className="bg-slate-900">
                      Thriller
                    </option>
                    <option value="horror" className="bg-slate-900">
                      Horror
                    </option>
                    <option value="drama" className="bg-slate-900">
                      Drama
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {movidata.premium && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold ml-1">
                      Premium Access Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold">
                        $
                      </span>
                      <input
                        value={movidata.price}
                        onChange={dataChangeHandler}
                        name="price"
                        type="number"
                        placeholder="19.99"
                        className="w-full bg-amber-500/5 border border-amber-500/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 rounded-2xl pl-8 pr-4 py-3 transition-all"
                      />
                    </div>
                  </div>
                )}

                {movidata.Category === "series" && (
                  <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-white/5 mt-auto">
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                        Series Status
                      </p>
                      <p className="text-sm font-medium text-slate-300 ml-1">
                        Is this series concluded?
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="isCompleted"
                      checked={movidata.isCompleted}
                      onChange={dataChangeHandler}
                      className="size-6 rounded-lg border-white/10 bg-slate-900 checked:bg-green-500 transition-all cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Storyline */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                  Storyline
                </label>
                <textarea
                  onChange={dataChangeHandler}
                  value={movidata.storyline}
                  name="storyline"
                  rows="4"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 placeholder-slate-600 transition-all resize-none"
                  placeholder="Draft the cinematic vision..."
                />
              </div>

              {/* Action */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={nextFormHandler}
                  disabled={movidata.Category === "series" && form === 0}
                  className={`px-10 py-4 ${movidata.Category === "series" ? "bg-slate-800 text-slate-500 cursor-not-allowed hidden" : "bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold"} rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95`}
                >
                  Save & Next Step
                </button>
                {movidata.Category === "series" && (
                  <button
                    onClick={uploadHandler}
                    disabled={isAdding}
                    className="px-10 py-4 bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-green-500/20 active:scale-95 flex items-center gap-2"
                  >
                    {isAdding ? <Loader2 className="animate-spin" /> : <Send />}
                    Create Series Base
                  </button>
                )}
              </div>
            </form>
          ) : form === 1 ? (
            <TrailerForm setFiles={setFiles} setForm={setForm} />
          ) : (
            <MediaForm
              uploadHandler={uploadHandler}
              setFiles={setFiles}
              setAddNewMoviToggle={setAddNewMoviToggle}
              isAdding={isAdding}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function UploadBox({ title }) {
  return (
    <div>
      <label className="label mb-2 block">{title}</label>
      <div className="border-2 border-dashed border-gray-400 rounded-xl h-40 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
        Click to upload
      </div>
    </div>
  );
}
