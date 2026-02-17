
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SeatStructure from "./SeatStructure";
import UserSeatStructure from "./UserSeatStructure";
import { toast } from "react-toastify";
import instance from "../utils/axiosInstance";
export default function MoviDescription() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const { _id } = useParams();
  const [moviData, setMoviData] = useState({});

  async function moviDetails() {
    try {
      const data = await instance.get(
        `/movies/details?_id=${_id}`
      );
      setMoviData(data.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
    }
  }
  useEffect(() => {
    moviDetails();
  }, []);

  return (
    <div className="flex justify-center py-14">
      <div className="flex flex-col w-full lg:max-w-[60vw] rounded-lg p-10  bg-gradient-to-l from-blue-200 to-purple-100 gap-14">
        <div className="w-full flex justify-between items-center">
          <div className="rounded-xl border-2 border-slate-100 w-[60%]">
            <img
              className="w-full rounded-lg skew-x-3 h-full object-contain"
              src={moviData?.source_url}
            />
          </div>

          <ul>
            <li className="flex text-xl gap-6">
              <span className="text-2xl font-semibold">movie</span>{" "}
              <span className="italic text-slate-500 font-medium text-lg">
                {moviData?.Name}
              </span>{" "}
            </li>
            <li className="flex text-xl gap-6">
              <span className="text-2xl font-semibold">Location</span>{" "}
              <span className="italic text-slate-500 font-medium text-lg">
                {" "}
                {moviData.Location}
              </span>
            </li>
            <li className="flex text-xl gap-6">
              <span className="text-2xl font-semibold">Amount</span>{" "}
              <span className="text-green-500  font-medium text-lg">
                ${moviData?.Price}
              </span>{" "}
            </li>
              {loggedUser?.role == "admin" && (
                   <div className="flex flex-col justify-self-center gap-6">
                <div className="flex text-xl gap-16">
                  <p>
                    <span className="text-2xl font-semibold">Booked Seats</span>{" "}
                    {moviData.bookedSeats}
                  </p>{" "}
                  <p>
                    <span className="text-2xl font-semibold">Remain Seats</span>{" "}
                    {moviData.remainSeats}
                  </p>
                </div>
                <p className="text-xl">
                  <span className="text-2xl font-semibold">
                    Total Collection
                  </span>{" "}
                  <span className="text-lg text-green-400">
                    ${(moviData.Price || 0) * (moviData.bookedSeats || 0)}
                  </span>
                </p>
              </div>
              )}
          </ul>
         
        </div>

        {/* Seats structure */}
        {loggedUser?.role == "admin" ? (
          <SeatStructure
            seatsData={{
              seatScreen: moviData?.seatScreen,
              _id: moviData._id,
              bookedSeats: moviData.bookedSeats,
              remainSeats: moviData.remainSeats,
              Price: moviData.Price,
            }}
          />
        ) : (
          <UserSeatStructure
            seatsData={{
              seatScreen: moviData?.seatScreen,
              _id: moviData._id,
              bookedSeats: moviData.bookedSeats,
              remainSeats: moviData.remainSeats,
              Price: moviData.Price,
            }}
          />
        )}
      </div>
    </div>
  );
}
