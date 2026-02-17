import { useEffect, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "react-router-dom";
import instance, { multiInstance } from "../utils/axiosInstance";
export const EditBasicInfo = ({
  setData,
  data,
  setMovieData,
  setUpdateOverViewModal,
}) => {
  const [formData, setFormData] = useState({
    category: "Movie",
    main_title: "",
    title: "",
    year: "",
    duration: "",
    // certificate: "UA",
    rating: "",
    genres: [],
    languages: [],
    storyline: "",
    poster: null,
    preview: "",
  });
  console.log(formData);
  const genresList = [
    "Action",
    "Comedy",
    "Romantic",
    "Drama",
    "Thriller",
    "Horror",
  ];
  const languagesList = ["English", "Tamil", "Hindi", "Malayalam", "Telugu"];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle genre/language toggle
  const handleToggle = (type, value) => {
    setFormData((prev) => {
      const list = prev[type] || [];
      return {
        ...prev,
        [type]: list?.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  };

  // Image upload preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        poster: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }

    const {data: responseData} = await instance.put(`movies/update/basics/${data._id}`, updatedData);
    //  setData(formData)
    setMovieData((prev) => ({ ...prev, ...responseData.message }));
    setUpdateOverViewModal(null);
  };

  useEffect(() => {
    setFormData(data);
  }, []);
  console.log(formData, data);
  return (
    <div className="fixed inset-0 z-50 bg-white/80 flex items-center justify-center">
      {/* Scroll wrapper with top/bottom space */}
      <div className="hide-scrollbar w-full h-full overflow-y-auto py-16 px-4">
        <div className="flex justify-center">
          <form className=" w-[700px] border-2 border-slate-300 bg-gray-100 shadow-2xl rounded-xl p-8">
            <RxCross1
              className="absolute top-4 right-4 text-3xl hover:text-red-600 cursor-pointer"
              onClick={() => setUpdateOverViewModal((prev) => !prev)}
            />
            <h2 className="text-2xl font-semibold mb-6">Edit Basic Info</h2>

            {/* Poster */}
            <div className="flex justify-center mb-6">
              <label className="cursor-pointer">
                <img
                  src={
                    formData.preview ||
                    data.poster ||
                    "https://via.placeholder.com/150"
                  }
                  alt="poster"
                  className="w-40 h-56 object-cover rounded-lg"
                />
                {/* <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImage}
                /> */}
              </label>
            </div>

            {/* Category + Main Title */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                <option>Movie</option>
                <option>Series</option>
              </select>

              <input
                name="main_title"
                placeholder="Main Title (Optional)"
                value={formData.main_title}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Title */}
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="input mb-4"
            />

            {/* Year + Duration */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                name="year"
                type="number"
                placeholder="Year"
                value={formData.year}
                onChange={handleChange}
                className="input"
              />
              <input
                name="duration"
                type="number"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Certificate + Rating */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* <select
            name="certificate"
            value={formData.certificate}
            onChange={handleChange}
            className="input"
          >
            <option>U</option>
            <option>UA</option>
            <option>A</option>
          </select> */}

              <input
                name="rating"
                type="number"
                placeholder="Rating"
                value={formData.rating}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Genres */}
            <div className="mb-4">
              <p className="mb-2 font-medium">Genres</p>
              <div className="flex flex-wrap gap-2">
                {genresList.map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleToggle("genres", g)}
                    className={`px-4 py-1 rounded-full border ${
                      formData?.genres?.includes(g)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-4">
              <p className="mb-2 font-medium">Languages</p>
              <div className="flex flex-wrap gap-2">
                {languagesList.map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => handleToggle("languages", l)}
                    className={`px-4 py-1 rounded-full border ${
                      formData.languages?.includes(l)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Storyline */}
            <textarea
              name="storyline"
              rows="4"
              placeholder="Storyline"
              value={formData.storyline}
              onChange={handleChange}
              className="input mb-6"
            />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 mb-10 rounded-lg"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// update movi media

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
    videoPreview: "", // existing or new preview
    thumbName: "No file selected.",
  });

  // Simulate existing video from backend
  // Replace with your backend URL
  const existingVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  // Handle video change
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

  // Handle thumbnail
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

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("media", media.videoFile);
    formData.append("poster", media.thumbnail);
    const { data } = await multiInstance.patch(
      `/movies/update/media/${_id}`,
      formData,
    );
    console.log(data);
    setMovieData((prev) => ({
      ...prev,
      media: data.message.media,
      poster: data.message.poster,
    }));
    setUpdateMovieMediaModal(null);
  };

  return (
    <div className="fixed top-0 h-screen w-screen z-50 bg-white/80 flex justify-center items-center  ">
      <div className="absolute z-50 p-10 flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-[650px] z-50 shadow-2xl bg-gray-100 rounded-xl  p-8"
        >
          <h2 className="text-2xl font-semibold mb-6">Update Movie Media</h2>

          {/* Video Preview Box */}
          <div className="border-2 border-dashed rounded-xl p-4 mb-6">
            <div className="bg-gray-900 z-10 rounded-lg overflow-hidden">
              <video
                controls
                className="w-full  h-64 object-cover"
                src={
                  media.videoPreview ||
                  updateMovieMediaModal?.media ||
                  existingVideoUrl
                }
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">📄</div>
                <span className="font-medium">Existing Movie</span>
              </div>

              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="text-blue-600 font-medium"
              >
                Change
              </button>

              <input
                type="file"
                hidden
                ref={fileRef}
                accept="video/*"
                onChange={handleVideoChange}
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="mb-8">
            <p className="mb-2 font-medium">Thumbnail</p>

            <div className="flex items-center gap-4">
              <label className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer">
                Browse...
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleThumbChange}
                />
              </label>

              <span className="text-gray-600">{media.thumbName}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setUpdateMovieMediaModal((prev) => !prev)}
              type="button"
              className="px-5 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// update trailer data

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
    videoPreview: "", // existing or new preview
    thumbName: "No file selected.",
  });

  // Simulate existing video from backend
  // Replace with your backend URL
  const existingVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  // Handle video change
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

  // Handle thumbnail
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

  // Submit to backend
  const handleSubmit =async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("trailerMedia", media.videoFile);
    formData.append("trailerPoster", media.thumbnail);
    const { data } =await multiInstance.patch(
      `/movies/update/trailer/${_id}`,
      formData,
    );
    setMovieData((prev) => ({ ...prev,trailer:data.message.trailer }));
    setUpdateTrailerModal(prev=>!prev);
  };

  return (
    <div className="fixed top-0 h-screen w-screen z-50 bg-white/80 flex justify-center items-center  ">
      <div className="absolute z-50 p-10 flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-[650px] z-50 shadow-2xl bg-gray-100 rounded-xl  p-8"
        >
          <h2 className="text-2xl font-semibold mb-6">Update Trailer media</h2>

          {/* Video Preview Box */}
          <div className="border-2 border-dashed rounded-xl p-4 mb-6">
            <div className="bg-gray-900 z-10 rounded-lg overflow-hidden">
              <video
                controls
                className="w-full  h-64 object-cover"
                src={media.videoPreview || data?.media || existingVideoUrl}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">📄</div>
                <span className="font-medium">Existing Trailer</span>
              </div>

              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="text-blue-600 font-medium"
              >
                Change
              </button>

              <input
                type="file"
                hidden
                ref={fileRef}
                accept="video/*"
                onChange={handleVideoChange}
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="mb-8">
            <p className="mb-2 font-medium">Thumbnail</p>

            <div className="flex items-center gap-4">
              <label className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer">
                Browse...
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleThumbChange}
                />
              </label>

              <span className="text-gray-600">{media.thumbName}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setUpdateTrailerModal((prev) => !prev)}
              type="button"
              className="px-5 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// add cast data

export const AddCrew = ({ setCrewData, movie_id, setaddCrewModal }) => {
  const [crew, setCrew] = useState({
    name: "",
    role: "",
    description: "",
    image: null,
    imageName: "No file selected.",
  });

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description" && value.length > 50) return;

    setCrew((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCrew((prev) => ({
        ...prev,
        image: file,
        imageName: file.name,
      }));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", crew.name);
    formData.append("role", crew.role);
    formData.append("description", crew.description);
    formData.append("avatar", crew.image);
    formData.append("movie_id", movie_id);
    console.log("Sending 👉", crew);

    const { data } = await multiInstance.post("/movies/crew/add", formData);
    setCrewData((prev) => [...prev, data.message]);
    setaddCrewModal((prev) => !prev);
  };

  return (
    <div className="fixed top-0 w-screen min-h-screen bg-white/80 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[600px] bg-gray-100 rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-8">Add New Crew</h2>

        {/* Name */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={crew.name}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Role */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Role</label>
          <input
            type="text"
            name="role"
            placeholder="Enter role"
            value={crew.role}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Description (optional, max 50 chars)
          </label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={crew.description}
            onChange={handleChange}
            className="input"
            rows="3"
          />
          <p className="text-sm text-gray-500 mt-1">
            {crew.description.length}/50
          </p>
        </div>

        {/* Image */}
        <div className="mb-8">
          <label className="block mb-2 font-medium">Image</label>
          <div className="flex items-center gap-4">
            <label className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer">
              Browse...
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>
            <span className="text-gray-600">{crew.imageName}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setaddCrewModal((prev) => !prev)}
            type="button"
            className="px-5 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

// Add new cast

export const AddCast = ({ setActor, movie_id, setAddCastModal }) => {
  const [crew, setCrew] = useState({
    name: "",
    role: "",
    description: "",
    image: null,
    imageName: "No file selected.",
  });

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description" && value.length > 50) return;

    setCrew((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCrew((prev) => ({
        ...prev,
        image: file,
        imageName: file.name,
      }));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", crew.name);
    formData.append("role", crew.role);
    formData.append("description", crew.description);
    formData.append("avatar", crew.image);
    formData.append("movie_id", movie_id);
  // console.log(crew.image)
    const { data } = await multiInstance.post("/movies/actor/add", formData);
    // console.log("Sending 👉", formData);
    setActor((prev) => [...prev, data.message]);
    setAddCastModal((prev) => !prev);
    
  };

  return (
    <div className="fixed top-0 w-screen min-h-screen bg-white/80 flex items-center justify-center">
      <form className="w-[600px] bg-gray-100 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-8">Add New Cast</h2>

        {/* Name */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={crew.name}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Role */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Role</label>
          <input
            type="text"
            name="role"
            placeholder="Enter role"
            value={crew.role}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Description (optional, max 50 chars)
          </label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={crew.description}
            onChange={handleChange}
            className="input"
            rows="3"
          />
          <p className="text-sm text-gray-500 mt-1">
            {crew.description.length}/50
          </p>
        </div>

        {/* Image */}
        <div className="mb-8">
          <label className="block mb-2 font-medium">Image</label>
          <div className="flex items-center gap-4">
            <label className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer">
              Browse...
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>
            <span className="text-gray-600">{crew.imageName}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setAddCastModal((prev) => !prev)}
            type="button"
            className="px-5 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

// update cast data

export const UpdateCrew = ({
  updatedata,
  setCrewData,
  updateCrewData,
  setUpdateCrewModal,
}) => {
  const [crew, setCrew] = useState({
    _id: "",
    name: "",
    role: "",
    description: "",
    image: null,
    imageName: "No file selected.",
  });

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description" && value.length > 50) return;

    setCrew((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCrew((prev) => ({
        ...prev,
        image: file,
        imageName: file.name,
      }));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", crew.name);
    formData.append("role", crew.role);
    formData.append("description", crew.description);
    formData.append("avatar", crew.image);
    formData.append("_id", crew._id);
    const { data } = await multiInstance.put(
      `/movies/crew/update?_id=${crew._id}`,
      formData,
    );
    
   updatedata(data.message)
    setUpdateCrewModal(null);
  };

  useEffect(() => {
    setCrew(updateCrewData);
  }, []);
  console.log(crew)

  return (
    <div className="fixed top-0 w-screen min-h-screen bg-white/80 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[600px] bg-gray-100 rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-8">Update Crew</h2>

        {/* Name */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={crew.name}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Role */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Role</label>
          <input
            type="text"
            name="role"
            placeholder="Enter role"
            value={crew.role}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Description (optional, max 50 chars)
          </label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={crew.description}
            onChange={handleChange}
            className="input"
            rows="3"
          />
          <p className="text-sm text-gray-500 mt-1">
            {crew.description.length}/50
          </p>
        </div>

        {/* Image */}
        <div className="mb-8">
          <label className="block mb-2 font-medium">Image</label>
          <div className="flex items-center gap-4">
            <label className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer">
              Browse...
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>
            <span className="text-gray-600">{crew.imageName}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setUpdateCrewModal((prev) => !prev)}
            type="button"
            className="px-5 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

// Update existing cast

export const UpdateCast = ({
  movie_id,
  updateCastModal,
  setActor,
  setUpddateCastModal,
}) => {
  const [crew, setCrew] = useState({
    _id: "",
    name: "",
    role: "",
    description: "",
    image: null,
    imageName: "No file selected.",
  });

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description" && value.length > 50) return;

    setCrew((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCrew((prev) => ({
        ...prev,
        image: file,
        imageName: file.name,
      }));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", crew.name);
    formData.append("role", crew.role);
    formData.append("description", crew.description);
    formData.append("avatar", crew.image);
    formData.append("_id", crew._id);
    console.log("Sending 👉", crew);

    const { data } = await multiInstance.put(
      `/movies/actor/update?_id=${updateCastModal._id}`,
      formData,
    );
    setActor((prev) =>
      prev.map((item) =>
        item._id == updateCastModal._id ? data.message : item,
      ),
    );
    setUpddateCastModal(null);
  };
  useEffect(() => {
    setCrew(updateCastModal);
  }, []);

  return (
    <div className="fixed top-0 w-screen min-h-screen bg-white/80 flex items-center justify-center">
      <form className="w-[600px] bg-gray-100 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-8">Update Cast</h2>

        {/* Name */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={crew.name}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Role */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Role</label>
          <input
            type="text"
            name="role"
            placeholder="Enter role"
            value={crew.role}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Description (optional, max 50 chars)
          </label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={crew.description}
            onChange={handleChange}
            className="input"
            rows="3"
          />
          <p className="text-sm text-gray-500 mt-1">
            {crew.description.length}/50
          </p>
        </div>

        {/* Image */}
        <div className="mb-8">
          <label className="block mb-2 font-medium">Image</label>
          <div className="flex items-center gap-4">
            <label className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer">
              Browse...
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>
            <span className="text-gray-600">{crew.imageName}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setUpddateCastModal(null)}
            type="button"
            className="px-5 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};
