import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../utils/axiosInstance";

export default function Theater() {
  const{movieId}=useParams()
  const navigate=useNavigate()
  const [view, setView] = useState("home");

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(["A3", "B4"]);
//   const [layout, setLayout] = useState([]);
// const [bookedSeats, setBookedSeats] = useState([]);
  const seatPrice = 12;

  useEffect(() => {
    setMovies([
      {
        _id: "1",
        title: "John Wick 4",
        genre: "Action, Thriller",
        rating: 4.5,
        duration: "2h 45m",
        description: "An ex-hitman returns to face powerful enemies.",
        poster:
          "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
      },
      {
        _id: "2",
        title: "Dune",
        genre: "Sci-Fi",
        rating: 4.3,
        duration: "2h 35m",
        description: "A noble family becomes embroiled in war.",
        poster:
          "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      },
    ]);
  }, []);

  async function theaterData(){
    try {
      // setLayout(data.layout);
      // setBookedSeats(data.bookedSeats);
    } catch (error) {
      
    }
  }
  async function MovieShow() {
   try {
    const show=await instance.get(`/movies/show/get?${movieId}`)
   } catch (error) {
    
   }
  }

  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 8;

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId],
    );
  };

  const totalPrice = selectedSeats.length * seatPrice;

  const confirmBooking = () => {
    alert(
      `Booking Confirmed!\nMovie: ${selectedMovie.title}\nSeats: ${selectedSeats.join(
        ", ",
      )}\nTotal: $${totalPrice}`,
    );

    setBookedSeats([...bookedSeats, ...selectedSeats]);
    setSelectedSeats([]);
    setView("home");
  };
   
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header
        onClick={() => setView("home")}
        className="bg-slate-800 px-8 py-4 text-2xl font-bold cursor-pointer shadow-md"
      >
        🎬 Movie Booking
      </header>

      <div className="p-10 max-w-7xl mx-auto">
        <>
          <button
            onClick={() => navigate(-1)}
            className="text-yellow-400 mb-6"
          >
            ← Back
          </button>

          <h2 className="text-3xl font-bold mb-6">Select Seats</h2>

          <div className="bg-yellow-400 text-black text-center py-2 rounded-full mb-8 shadow-lg">
            SCREEN
          </div>

          <div className="flex flex-col items-center gap-4">
            {rows.map((row) => (
              <div key={row} className="flex gap-3 items-center">
                <span className="w-6">{row}</span>
                {[...Array(seatsPerRow)].map((_, i) => {
                  const seatId = `${row}${i + 1}`;
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      className={`w-9 h-9 flex items-center justify-center text-xs rounded-md transition cursor-pointer
                          ${
                            isBooked
                              ? "bg-gray-600 cursor-not-allowed"
                              : isSelected
                                ? "bg-green-500"
                                : "bg-yellow-400 text-black hover:scale-110"
                          }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            ))}

               {/* {layout.map((rowObj) => (
  <div key={rowObj.row} className="flex gap-2">
    <span>{rowObj.row}</span>

    {[...Array(rowObj.seats)].map((_, i) => {
      const seatId = `${rowObj.row}${i + 1}`;
      const isBooked = bookedSeats.includes(seatId);
      const isSelected = selectedSeats.includes(seatId);

      return (
        <div
          key={seatId}
          onClick={() => toggleSeat(seatId)}
          className={`w-8 h-8 rounded 
            ${isBooked ? "bg-gray-600" : 
              isSelected ? "bg-green-500" : 
              "bg-yellow-400"}
          `}
        >
          {i + 1}
        </div>
      );
    })}
  </div>
))} */}
          </div>

          {/* Summary */}
          <div className="mt-10 bg-slate-800 p-6 rounded-xl max-w-md mx-auto shadow-lg">
            <p>
              Selected:{" "}
              {selectedSeats.length ? selectedSeats.join(", ") : "None"}
            </p>
            <p className="mt-2 font-semibold">Total: ${totalPrice}</p>

            <button
              disabled={!selectedSeats.length}
              onClick={confirmBooking}
              className="mt-4 w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold disabled:opacity-40"
            >
              Confirm Booking
            </button>
          </div>
        </>
      </div>
    </div>
  );
}
