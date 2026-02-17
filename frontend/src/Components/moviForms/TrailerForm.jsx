import { useState } from "react";
import axios from "axios";
import instance from "../../utils/axiosInstance";

export default function TrailerAndActorsForm({setFiles,movie_id,setForm}) {
  const [data, setData] = useState({
    trailer: null,
    thumbnail: null,
    actors: [{ name: "", role: "", image: null }],
    trailerPreview: "",
    thumbName: "No file selected",
  });

  // Handle trailer
  const handleTrailer = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((p) => ({
        ...p,
        trailer: file,
        trailerPreview: URL.createObjectURL(file),
      }));
       setFiles(prev=>({...prev,trailerMedia:file}))
    }
  };

  // Handle thumbnail
  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((p) => ({
        ...p,
        thumbnail: file,
        thumbName: file.name,
      }));
       setFiles(prev=>({...prev,trailerPoster:file}))
    }
  };

  // Actor change
  const handleActorChange = (index, field, value) => {
    const updated = [...data.actors];
    updated[index][field] = value;
    setData((p) => ({ ...p, actors: updated }));
  };

  // Add actor
  const addActor = () => {
    setData((p) => ({
      ...p,
      actors: [...p.actors, { name: "", role: "", image: null }],
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("trailer", data.trailer);
    form.append("thumbnail", data.thumbnail);
   await instance.post("")
    data.actors.forEach((a, i) => {
      form.append(`actors[${i}][name]`, a.name);
      form.append(`actors[${i}][role]`, a.role);
      form.append(`actors[${i}][image]`, a.image);
      form.append("movie_id",movie_id)
    });
   await instance.post("/movies/actor/add",form)
    // await axios.post("/api/movie/trailer-actors", form);
  };

  return (
    <form  className="w-[40vw] p-6 space-y-6 bg-gray-100 rounded-xl ">
      <h2 className="text-xl font-semibold">Trailer information</h2>

      {/* Trailer */}
      <div>
       
        <video
          src={data.trailerPreview}
          controls
          className="w-full h-60 rounded-lg bg-black"
        />
       <div className="flex flex-col ">
          <label htmlFor="trailer" className="font-medium">Trailer</label>
        <input type="file" id="trailer" accept="video/*" onChange={handleTrailer} />
       </div>
      </div>

      {/* Thumbnail */}
      <div className="flex flex-col">
          <label htmlFor="poster" className="font-medium">Trailer poster</label>
        <input type="file" id="poster" accept="image/*" onChange={handleThumb} />
        {/* <p>{data.thumbName}</p> */}
      </div>

     
      {/* Actors */}
    {/* <div className="flex flex-col gap-4">
      <label className="text-xl font-medium">Add actor details</label>
        {data.actors.map((actor, i) => (
        <div key={i} className="grid grid-cols-3 gap-3">
          <input
            placeholder="Actor Name"
            value={actor.name}
            onChange={(e) =>
              handleActorChange(i, "name", e.target.value)
            }
            className="input"
          />
          <input
            placeholder="Role"
            value={actor.role}
            onChange={(e) =>
              handleActorChange(i, "role", e.target.value)
            }
            className="input"
          />
          <div className=" flex flex-col">
            <label className="text-lg font-medium">Actor img</label>
            <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleActorChange(i, "image", e.target.files[0])
            }
          />
          </div>
        </div>
      ))}
    </div> */}

     <div className="flex justify-end pt-8 gap-16">
       {/* <button type="button" onClick={addActor} className="bg-gray-300 px-3 py-1 rounded-lg"> 
        + Add Actor
      </button>  */}

      <button onClick={()=>setForm(prev=>prev+1)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Save & next
      </button>
     </div>
    </form>
  );
}
