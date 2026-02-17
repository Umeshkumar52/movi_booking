import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCloudUpload } from "react-icons/bs";
import { toast } from "react-toastify";
import { RiInformation2Fill } from "react-icons/ri";
import { multiInstance } from "../utils/axiosInstance";
import MediaForm from "../Components/moviForms/MediaForm";
import TrailerForm from "../Components/moviForms/TrailerForm";
export default function AddMovi({ toggle, setAddNewMoviToggle, setMovies }) {
  const [movidata, setMovidata] = useState({
    main_title: "",
    title: "",
    Category: "",
    duration: "",
    year: "",
    rating: "",
    language:"",
    genres: "",
    storyline: "",
    price: "",
  });
   const genresList = ["Action", "Comedy", "Romantic", "Drama", "Thriller", "Horror"];
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
    event.preventDefault();
    const { name, value } = event.target;
    setMovidata({
      ...movidata,
      [name]: value,
    });
  }

  async function uploadHandler(event) {
    event?.preventDefault();
    
    // Basic validation
    if (!files.poster || !files.media) {
      return toast.error("Please upload both the movie file and poster art");
    }

    setIsAdding(true);
    const formData = new FormData();
    for (const key in movidata) {
      formData.append(key, movidata[key]);
    }

    formData.append("poster", files.poster);
    formData.append("media", files.media);
    formData.append("trailerPoster", files.trailerPoster);
    formData.append("trailerMedia", files.trailerMedia);
    
    try {
      const res = await multiInstance.post("/movies/create", formData);
      setMovies((prev) => [res.data.message,...prev]);
      setAddNewMoviToggle(false);
      toast.success("Movie Created Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create movie. Check file sizes and try again.");
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
          <p className="text-2xl font-black text-white tracking-tight">Create Cinematic Masterpiece</p>
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
            <form className="p-10 space-y-8">
              <div className="pb-6 border-b border-white/5">
                <h1 className="text-3xl font-black text-white">Basic Information</h1>
                <p className="text-slate-500 text-sm mt-1">Provide the core identity of your movie.</p>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Film Industry</label>
                  <select 
                    value={movidata.main_title} 
                    onChange={dataChangeHandler}  
                    name="main_title" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 appearance-none transition-all"
                  >
                     <option value="" className="bg-slate-900">-- Select Industry --</option>
                    <option value="holywood" className="bg-slate-900">Hollywood</option>
                    <option value="japanise" className="bg-slate-900">Japanese</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Category</label>
                  <select 
                    value={movidata.Category} 
                    onChange={dataChangeHandler}  
                    name="Category" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 appearance-none transition-all"
                  >
                     <option value="" className="bg-slate-900">-- Select Category --</option>
                    <option value="movie" className="bg-slate-900">Movie</option>
                    <option value="series" className="bg-slate-900">Series</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Title</label>
                  <input 
                    onChange={dataChangeHandler}  
                    value={movidata.title} 
                    name="title" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 placeholder-slate-600 transition-all" 
                    placeholder="e.g. Inception" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Duration (Min)</label>
                  <input 
                    onChange={dataChangeHandler}  
                    value={movidata.duration} 
                    name="duration" 
                    type="number" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 transition-all" 
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Release Year</label>
                  <input  
                    value={movidata.year} 
                    onChange={dataChangeHandler} 
                    name="year" 
                    type="number" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Rating (/10)</label>
                  <input  
                    value={movidata.rating} 
                    onChange={dataChangeHandler} 
                    name="rating" 
                    type="number" 
                    step="0.1" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 transition-all" 
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Primary Language</label>
                  <select 
                    value={movidata.language} 
                    onChange={dataChangeHandler} 
                    name="language" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 appearance-none transition-all"
                  >
                    <option value="" className="bg-slate-900">-- Select Language --</option>
                    <option value="hindi" className="bg-slate-900">Hindi</option>
                    <option value="english" className="bg-slate-900">English</option>
                    <option value="karnatak" className="bg-slate-900">Kannada</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Genre</label>
                  <select  
                    value={movidata.genres} 
                    onChange={dataChangeHandler} 
                    name="genres" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl px-4 py-3 appearance-none transition-all"
                  >
                    <option value="" className="bg-slate-900">-- Select Genre --</option> 
                    <option value="comedy" className="bg-slate-900">Comedy</option>
                    <option value="romance" className="bg-slate-900">Romance</option>
                    <option value="action" className="bg-slate-900">Action</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Base Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input 
                    value={movidata.price} 
                    onChange={dataChangeHandler} 
                    name="price" 
                    type="number"  
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl pl-8 pr-4 py-3 transition-all" 
                  />
                </div>
              </div>
             
              {/* Storyline */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">Storyline</label>
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
                  className="px-10 py-4 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                >
                  Save & Next Step
                </button>
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
