import React, { useState } from "react";
import axios from "axios";
import instance from "../../utils/axiosInstance";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function TheaterShow({setTheaterModal}){
  const{_id}=useParams()
  const [formData, setFormData] = useState({
    name: "",
    screenNumber: "",
    totalRows: "",
    seatsPerRow: "",
    date: "",
    time: "",
    VIP_seats:"",
    price: {
      REGULAR: "",
      VIP: "",
      COUPLE:""
    }
  });
console.log(_id)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["REGULAR", "VIP", "COUPLE"].includes(name)) {
      setFormData({
        ...formData,
        price: {
          ...formData.price,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
     const res= await instance.post(
        `/movies/theater-show/create?movieId=${_id}`,formData
       
      );
     toast.success("✅ Theater & Show Created Successfully!")
      setFormData({
        name: "",
        screenNumber: "",
        totalRows: "",
        seatsPerRow: "",
        movieId: "",
        VIP_seats:"",
        date: "",
        time: "",
        price: { REGULAR: "", VIP: "", COUPLE: "" }
      });

    } catch (err) {
      toast.error(err.response?.data?.message)
    }

    setLoading(false);
  };

  return (
  <div className="fixed top-0 h-screen w-screen z-50">
      <div className="min-h-screen bg-gray-950/90 text-white flex justify-center items-center p-6">
      <div className="bg-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl p-8">
      <button className="flex justify-self-end hover:text-red-600">  <RxCross1 onClick={()=>setTheaterModal(prev=>!prev)} className="text-3xl"/></button>
        <h2 className="text-3xl font-bold mb-6 text-center">
          🎬 Create Theater & Show
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Theater Info */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Theater Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="screenNumber"
              type="number"
              placeholder="Screen Number"
              value={formData.screenNumber}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="totalRows"
              type="number"
              placeholder="Total Rows"
              value={formData.totalRows}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="seatsPerRow"
              type="number"
              placeholder="Seats Per Row"
              value={formData.seatsPerRow}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {/* Show Info */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="VIP_seats"
              placeholder="Row number of VIP_seats"
              value={formData.VIP_seats}
              onChange={handleChange}
              required
              className="input col-span-2"
            />
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Seat Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="REGULAR"
                type="number"
                placeholder="Regular Price"
                value={formData.price.REGULAR}
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="VIP"
                type="number"
                placeholder="VIP Price"
                value={formData.price.VIP}
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="COUPLE"
                type="number"
                placeholder="Couple Price"
                value={formData.price.COUPLE}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 py-3 rounded-xl font-semibold"
          >
            {loading ? "Creating..." : "Create Theater & Show"}
          </button>

          {message && (
            <div className="text-center mt-4 text-sm">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  </div>
  );
}
