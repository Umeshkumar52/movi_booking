import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Armchair, ChevronLeft, Info } from "lucide-react";
import { toast } from "react-toastify";
import instance from "../utils/axiosInstance";
import handlePayment from "../utils/handlePayment";
import BookingSuccess from "../Components/BookingSuccess";
import { IndianRupee, Tv } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";
export default function SeatBooking() {
  const { _id } = useParams();
  const{user}=useContext(AuthContext)
  const navigate = useNavigate();
  const [layout, setLayout] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceMap, setPriceMap] = useState(null);
  const [showId, setShowId] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [threaterName, setTheaterName] = useState("");
  const [payment, setPayment] = useState(null);

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seatData = layout.find((s) => `${s.row}${s.number}` === seatId);
    return sum + (priceMap[seatData?.type] || 12);
  }, 0);

  // Fetch show/theater data
  async function MovieShow() {
    try {
      setLoading(true);
      if(user.role==="admin"){
           const {data} = await instance.get(
        `/movies/show/details/${_id}`,
      );
       setTheaterName(data.message.theater[0]?.name);
      setShowId(data.message.showId);
      setLayout(data.message.theater[0].layout || []);
      setBookedSeats((prev) => [...prev, ...(data.message.bookedSeats || [])]);
      setPriceMap(data.message.price);
      }else{
      const { data } = await instance.get(
        `/movies/theater/show/screen?movieId=${_id}`,
      );
       setTheaterName(data.message.theater?.name);
      setShowId(data.message.showId);
      setLayout(data.message.theater.layout || []);
      setBookedSeats((prev) => [...prev, ...(data.message.bookedSeats || [])]);
      setPriceMap(data.message.price);
    }
     
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function PaymentHandler() {
    try {
      await handlePayment(setPayment, totalPrice);
    } catch (error) {
      toast.error("Failed to load Payment");
    }
  }

  const groupedRows = layout.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId],
    );
  };

  const close = () => {
    setBookingSuccess((prev) => !prev);
    setSelectedSeats([]);
  };

  async function handleBooking() {
    await instance.post("/movies/booking/create", {
      showId,
      seats: selectedSeats,
      razorpay_payment_id: payment.razorpay_payment_id,
      paymentStatus: "SUCCESS",
    });
    setBookedSeats((prev) => [...prev, ...selectedSeats]);
    setBookingSuccess((prev) => !prev);
    await instance.post(`/notification/send`, {
      recieverId:user?._id,
      title: `Congratulations 🍿 Tickets Booked successfully`,
      body: ` "It's showtime! 🎬 Your seats are reserved. Tap to view your digital ticket."`,
    });
    
  }

    useEffect(() => {
    MovieShow();
  }, [_id]);

  useEffect(() => {
    if (payment) {
      handleBooking();
    }
  }, [payment]);

  return (
    <>
      {bookingSuccess&&
      <BookingSuccess
        isOpen={bookingSuccess}
        onClose={close}
        details={{ threaterName, totalPrice, seats: selectedSeats }}
      />
      }
      <div className="min-h-screen overflow-auto w-screen z-50 fixed top-0 bg-[#020617] text-slate-200 font-sans pb-32">
        {/* Cinematic Header */}
        <header className="sticky top-0 flex items-center justify-between px-8 py-6 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <ChevronLeft size={24} className="text-cyan-400" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-widest uppercase">
              Experience Selection
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-[0.2em]">
              PREMIUM THEATER SCREEN 01
            </p>
          </div>
          <Info size={20} className="text-slate-600" />
        </header>

        <main className="w-full h-[90vh] pb-[6rem] flex flex-col justify-center gap-6 overflow-scroll mx-auto mt-12 px-6">
          {/* Curved Glow Screen */}
          <div className="relative  flex flex-col items-center">
            <div className="w-[80%] h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>
            <div className="w-[90%] h-20 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-[50%] blur-2xl -mt-2"></div>
            <p className="text-[10px] tracking-[0.6em] text-cyan-500/50 uppercase font-black mt-2">
              Screen
            </p>
          </div>

          {/* Dynamic Seats Grid */}
          <div className="hide-scrollbar flex flex-col items-center gap-6 overflow-x-auto pb-8">
            {Object.keys(groupedRows)
              .sort()
              .map((rowLabel) => (
                <div key={rowLabel} className="flex items-center gap-8 group">
                  <span className="w-4 text-[11px] font-black text-slate-700 group-hover:text-slate-400 transition-colors">
                    {rowLabel}
                  </span>
                  <div className="flex gap-3">
                    {groupedRows[rowLabel]
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => {
                        const seatId = `${seat.row}${seat.number}`;
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        const iconStyle = isBooked
                          ? "text-slate-800"
                          : isSelected
                            ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] scale-110"
                            : seat.type === "VIP"
                              ? "text-amber-500/80 hover:text-amber-400"
                              : "text-slate-600 hover:text-slate-300";

                        return (
                          <button
                            key={seatId}
                            disabled={isBooked}
                            onClick={() => toggleSeat(seatId)}
                            className="relative flex flex-col items-center transition-all duration-300 transform active:scale-90"
                          >
                            <Armchair
                              size={28}
                              className={iconStyle}
                              fill={isSelected ? "currentColor" : "none"}
                              strokeWidth={isSelected ? 1.5 : 2}
                            />
                            <span
                              className={`text-[8px] mt-1 font-bold ${isSelected ? "text-cyan-400" : "text-slate-700"}`}
                            >
                              {seat.number}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-12 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-600 rounded-full" /> Regular
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full" /> VIP
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-800 rounded-full" /> Occupied
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee] rounded-full" />{" "}
              Selected
            </div>
          </div>

          {/* Bottom Floating Checkout Bar */}
          <div className="w-full flex justify-center items-center">
            <footer className=" bottom-6 flex items-center justify-between  w-[92%] max-w-xl bg-slate-900/90 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
              <div className="pl-4">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">
                  Selected Seats
                </p>
                <h2 className="text-white text-lg font-black truncate max-w-[150px]">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </h2>
              </div>
              <div className="h-10 w-[1px] bg-white/10 mx-4"></div>
              <div className="flex-1">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">
                  Payable Amount
                </p>
                <h2 className="text-cyan-400 flex items-center text-2xl font-black">
                  <IndianRupee />
                  {totalPrice}
                </h2>
              </div>
              <button
                onClick={PaymentHandler}
                disabled={selectedSeats.length === 0}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 disabled:opacity-10 disabled:grayscale"
              >
                Confirm
              </button>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
