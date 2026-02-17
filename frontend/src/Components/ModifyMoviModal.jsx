import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCloudUpload } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import formatDateTimeLocal from "../utils/formateDateTimeLocal";
import { multiInstance } from "../utils/axiosInstance";
export default function ModifyMoviModal({
  editModalData,
  _id,
  setMovies,
  setEditModal,
}) {
  const [movidata, setMovidata] = useState({
    Name: "",
    Location: "",
    Price: "",
    StartAt: "",
    EndAt: "",
    rows: "",
    cols: "",
  });
  const [file, setFile] = useState(null);

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
    formData.append("file", file);
    formData.append("Name", movidata.Name);
    formData.append("Location", movidata.Location);
    formData.append("Price", movidata.Price);
    formData.append("StartAt", movidata.StartAt);
    formData.append("EndAt", movidata.EndAt);
    formData.append("rows", movidata.rows);
    formData.append("cols", movidata.cols);

    try {
      const res = await multiInstance.put(
        `/movies/update?_id=${_id}`,
        formData,
      );

      setMovies((prev) =>
        prev.map((item) =>
          item._id == res.data.message._id ? res.data.message : item,
        ),
      );
      setMovidata(res.data.message);
      setFile(null);
      toast("Post Modify Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
    }
  }
  useEffect(() => {
    setMovidata(editModalData);
  }, []);
  return (
    <div className=" w-[100vw] h-[100vh] fixed pt-12 bg-gray-200/60 flex justify-center">
      <div className="w-[50vw] h-fit bg-white rounded-lg z-50 shadow-xl pb-16 space-y-6">
        <div className="flex p-4 bg-green-200 justify-between px-6">
          <p className="text-lg font-medium">Edit Movi</p>
          <RxCross1 onClick={() => setEditModal(null)} className="text-2xl" />
        </div>

        <form className="relative flex flex-col gap-8  px-6">
          <div className="flex gap-6">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="MoviName" className="text-base font-medium">
                Movi Name
              </label>
              <input
                type="text"
                name="Name"
                className="focus:outline-none border-2 px-3 py-2 rounded-lg border-slate-300"
                value={movidata.Name}
                onChange={dataChangeHandler}
                placeholder="Enter Movi Name..."
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="MoviName" className="text-base font-medium">
                Location
              </label>
              <input
                type="text"
                name="Location"
                className="focus:outline-none border-2 px-3 py-2 rounded-lg border-slate-300"
                value={movidata.Location}
                onChange={dataChangeHandler}
                placeholder="Location..."
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="MoviName" className="text-base font-medium">
                Price
              </label>
              <input
                type="text"
                name="Price"
                className="focus:outline-none border-2 px-3 py-2 rounded-lg border-slate-300"
                value={movidata.Price}
                onChange={dataChangeHandler}
                placeholder="Example $100"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="MoviName" className="text-base font-medium">
                Start At
              </label>
              <input
                type="datetime-local"
                name="StartAt"
                className="focus:outline-none border-2 px-3 py-2 rounded-lg border-slate-300"
                value={
                  movidata.StartAt ? formatDateTimeLocal(movidata.StartAt) : ""
                }
                onChange={dataChangeHandler}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="MoviName" className="text-base font-medium">
                End At
              </label>
              <input
                type="datetime-local"
                name="EndAt"
                className="focus:outline-none border-2 px-3 py-2 rounded-lg border-slate-300"
                value={
                  movidata.EndAt ? formatDateTimeLocal(movidata.EndAt) : ""
                }
                onChange={dataChangeHandler}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="MoviName" className="text-base font-medium">
                Seat Row Numbers
              </label>
              <input
                type="Number"
                name="rows"
                className="focus:outline-none border-2 px-3 py-2 rounded-lg border-slate-300"
                value={movidata.rows}
                onChange={dataChangeHandler}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="MoviName" className="text-base font-medium">
              Seat Column Numbers
            </label>
            <input
              type="Number"
              name="cols"
              className="focus:outline-none border-2 px-3 py-2 rounded-lg border-slate-300"
              value={movidata.cols}
              onChange={dataChangeHandler}
            />
          </div>

          <div className="flex flex-col items-center gap-6 justify-center pt-8">
            <label tittle="upload file" htmlFor="moviFile">
              <BsCloudUpload className="text-8xl" />
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              name="moviFile"
              id="moviFile"
            />
            {file && <p>File:- {file.name}</p>}
          </div>
          <div className=" flex gap-10 justify-end">
            {/* setEditModal */}
            <button
              onClick={() => setEditModal((prev) => !prev)}
              className="w-fit px-8 py-3 rounded-lg bg-indigo-700 text-white"
            >
              Cancel{" "}
            </button>
            <button
              onClick={uploadHandler}
              className="w-fit px-8 py-3 rounded-lg bg-indigo-700 text-white"
            >
              Update{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
