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
 
  //  const handleToggle = (type, value) => {
  //   movidata((prev) => {
  //     const list = prev[type]||[];
  //     return {
  //       ...prev,
  //       [type]: list?.includes(value)
  //         ? list.filter((v) => v !== value)
  //         : [...list, value],
  //     };
  //   });
  // };

  function dataChangeHandler(event) {
    event.preventDefault();
    const { name, value } = event.target;
    setMovidata({
      ...movidata,
      [name]: value,
    });
  }

  async function uploadHandler(event) {
    event.preventDefault();
    const formData = new FormData();
   for (const key in movidata) {
      formData.append(key, movidata[key])
   }

    formData.append("poster", files.poster);
    formData.append("media", files.media);
    formData.append("trailerPoster", files.trailerPoster);
    formData.append("trailerMedia", files.trailerMedia);
    try {
      const res = await multiInstance.post("/movies/create", formData);
      setMovies((prev) => [...prev, res.data.message]);
      setAddNewMoviToggle(prev=>!prev)
      toast("Created Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
    }
  }

  return (
    <div className="w-screen h-screen hide-scrollbar overflow-y-auto fixed top-0 bg-white flex flex-col gap-8 items-center">
      <div className="w-full sticky z-50 top-0 flex p-4 bg-slate-200 justify-between px-6">
        <p className="text-2xl font-medium">Create Movie</p>
        <RxCross1
          onClick={() => toggle((prev) => !prev)}
          className="text-2xl"
        />
      </div>

      <div className="relative rounded-xl border-2 border-slate-200 bg-gray-100 space-y-12">
        {form === 0 ? (
          <form className="px-8 my-8  space-y-6">
            <div className="flex border-b-2 px-8 py-4 border-slate-400 items-center gap-3">
              <RiInformation2Fill className="text-3xl text-black" />
              <h1 className="text-2xl font-bold">Basic information</h1>
            </div>
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <label className="label">Film Title (Main Title)</label>
                <select value={movidata.main_title} onChange={dataChangeHandler}  name="main_title" className="input focus:outline-none border-2 rounded-lg p-2">
                   <option value="">--Select--</option>
                  <option value="holywood">Holywood</option>
                  <option value="japanise">Japanise</option>
                </select>
              </div>

              <div>
                <label className="label">Category</label>
                <select value={movidata.Category} onChange={dataChangeHandler}  name="Category" className="input">
                   <option value="">--Select--</option>
                  <option value="movie">Movie</option>
                  <option value="series">Series</option>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label">Title</label>
                <input onChange={dataChangeHandler}  value={movidata.title} name="title" className="input" placeholder="Example: Sherlock" />
              </div>

              <div>
                <label className="label">
                  Duration (min) — only for movies
                </label>
                <input onChange={dataChangeHandler}  value={movidata.duration} name="duration" type="number" className="input" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label ">Year</label>
                <input  value={movidata.year} onChange={dataChangeHandler} name="year" type="number" className="input" />
              </div>

              <div>
                <label className="label">Rating (/10)</label>
                <input  value={movidata.rating} onChange={dataChangeHandler} name="rating" type="number" step="0.1" className="input" />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label">Languages</label>
                <select value={movidata.language} onChange={dataChangeHandler} name="language" className="input">
                    <option value="">--Select--</option>
                  <option value="hindi">Hindi</option>
                   <option value="english">English</option>
                    <option value="karnatak">Karnatak</option>
                </select>
              </div>

              <div>
                <label className="label">Genres</label>
                <select  value={movidata.genres} onChange={dataChangeHandler} name="genres" className="input">
                 <option value="">--Select--</option> 
                  <option value="comedy">comedy</option>
                  <option value="romance">romance</option>
                </select>
              </div>
            </div>

            {/* Certificate */}
            {/* <div>
              <label className="label">Certificate</label>
              <select  className="input">
                <option>Select certificate</option>
              </select>
            </div> */}
        

              <div>
                <label className="label">Amount</label>
                <input value={movidata.price} onChange={dataChangeHandler} name="price" type="number"  className="input" />
              </div>
             
            {/* Storyline */}
            <div>
              <label className="label">Storyline</label>
              <textarea
               onChange={dataChangeHandler}
               value={movidata.storyline}
              name="storyline"
                rows="4"
                className="input"
                placeholder="Short description / synopsis (max 500 characters)"
              />
            </div>
            
               

            {/* Upload Section */}
            {/* <div className="grid grid-cols-2 gap-6">
              <UploadBox title="Poster Image" />
              <UploadBox title="UA Certificate (optional)" />
            </div> */}

            {/* Button */}
            <div className="flex justify-end">
              <button
                onClick={nextFormHandler}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save & Next
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
           
          />
        )}
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
