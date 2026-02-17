import { useState } from "react";
import axios from "axios";

export default function MediaUploadForm({uploadHandler,setFiles,setAddNewMoviToggle}) {
  const [media, setMedia] = useState({
    video: null,
    thumbnail: null,
    preview: "",
    thumbName: "No file selected",
  });

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia((p) => ({
        ...p,
        video: file,
        preview: URL.createObjectURL(file),
      }));
      setFiles(prev=>({...prev,media:file}))
    }
  };

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia((p) => ({
        ...p,
        thumbnail: file,
        thumbName: file.name,
      }));
      setFiles(prev=>({...prev,poster:file}))
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    uploadHandler()
    // const form = new FormData();
    // form.append("video", media.video);
    // form.append("thumbnail", media.thumbnail);
    // // setForm(0)
    // setAddNewMoviToggle(prev=>!prev)
    // await axios.post("/api/movie/media", form);
  };

  return (
    <form className="w-[40vw] p-6 bg-gray-100 rounded-xl space-y-6">
      <h2 className="text-xl font-semibold">Media Upload</h2>

      <video
        src={media.preview}
        controls
        className="w-full h-60 rounded-lg bg-black"
      />
      <div className="flex flex-col">
        <label htmlFor="movie" className="text-lg font-medium">upload movie</label>
      <input type="file" id="movie" accept="video/*" onChange={handleVideo} />
      </div>

      <div className="flex flex-col">
         <label htmlFor="poster" className="text-lg font-medium">thumnail</label>
        <input type="file" id="poster" accept="image/*" onChange={handleThumb} />
        {/* <p>{media.thumbName}</p> */}
      </div>

     <div className="flex justify-end pt-8">
       <button onClick={uploadHandler} className="bg-blue-600 text-white px-6 py-2 rounded">
        Submit
      </button>
     </div>
    </form>
  );
}
