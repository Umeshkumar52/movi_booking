import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Armchair, ChevronLeft, Info } from "lucide-react";
import { toast } from "react-toastify";
import instance from "../utils/axiosInstance";
import handlePayment from "../utils/handlePayment";
import BookingSuccess from "../Components/BookingSuccess";
import { IndianRupee, Tv } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";
import { formatDate,convertTo12Hour } from "../utils/convertToHours";
export default function SeatBooking() {
   const [searchParams] = useSearchParams();
  const show_id = searchParams.get("showId");

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
const[seatsData,setSeatsData]=useState(null)
  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seatData = layout.find((s) => `${s.row}${s.number}` === seatId);
    return sum + (priceMap[seatData?.type] || 12);
  }, 0);

  // Fetch show/theater data
  async function MovieShow() {
    try {
      setLoading(true);
     
           const {data} = await instance.get(
        `/movies/show/details/${show_id}`,
      );
      setSeatsData(data?.message[0])
      console.log(data?.message[0])
      setTheaterName(data?.message[0].theater[0]?.name);
      setShowId(data?.message[0].showId);
      setLayout(data?.message[0].theater[0].layout || []);
      setBookedSeats((prev) => [...prev, ...(data?.message[0].bookedSeats || [])]);
      setPriceMap(data?.message[0].price);
     
    } catch (error) {
      toast.error( "Something went wrong");
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
  }, [show_id]);

  useEffect(() => {
    if (payment) {
      handleBooking();
    }
  }, [payment]);

  return (
    <>
    return (
  <div className="min-h-screen w-screen z-50 fixed inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-slate-200 overflow-auto pb-40">

    {/* HEADER */}
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 px-6 py-5 flex items-center justify-between">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full hover:bg-cyan-500/10 transition"
      >
        <ChevronLeft className="text-cyan-400" size={26} />
      </button>

      <div className="text-center">
        <h1 className="text-xl font-bold tracking-widest uppercase bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Select Your Seats
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {threaterName}
        </p>
      </div>

      <Info className="text-slate-500" size={20} />
    </header>

    <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">

      {/* SCREEN DESIGN */}
      <div className="flex flex-col items-center">
        <div className="w-[70%] h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_25px_rgba(34,211,238,0.7)]" />
        <div className="w-[80%] h-20 bg-cyan-500/10 rounded-[50%] blur-3xl -mt-4" />
        <span className="mt-3 text-cyan-400/60 tracking-[0.5em] text-xs uppercase">
          Screen
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">

        {/* SEATS GRID */}
        <div className="lg:col-span-2 flex flex-col items-center space-y-6">

          {Object.keys(groupedRows).sort().map((rowLabel) => (
            <div key={rowLabel} className="flex items-center gap-6">
              <span className="text-sm font-semibold text-slate-500 w-6">
                {rowLabel}
              </span>

              <div className="flex gap-3">
                {groupedRows[rowLabel]
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => {
                    const seatId = `${seat.row}${seat.number}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <button
                        key={seatId}
                        disabled={isBooked}
                        // onClick={() => toggleSeat(seatId)}
                        className={`relative group transition-all duration-300
                          ${isBooked && "opacity-30 cursor-not-allowed"}
                          ${isSelected && "scale-110"}
                        `}
                      >
                        <Armchair
                          size={30}
                          className={`
                            ${isBooked ? "text-slate-700" :
                              isSelected ? "text-cyan-400 drop-shadow-[0_0_15px_#22d3ee]" :
                              seat.type === "VIP"
                                ? "text-amber-500 group-hover:text-amber-400"
                                : "text-slate-500 group-hover:text-white"}
                          `}
                          fill={isSelected ? "currentColor" : "none"}
                        />
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-400">
                          {seat.number}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="space-y-8">

          {/* DATE & TIME CARD */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm uppercase tracking-widest text-slate-400">
              Show Info
            </h3>

            <div className="flex justify-between">
              <div>
                <p className="text-slate-500 text-xs">Date</p>
                <p className="font-semibold">
                  {formatDate(seatsData?.date||
"2026-02-27T00:00:00.000Z")}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-xs">Time</p>
                <p className="font-semibold">
                  {convertTo12Hour(seatsData?.time||"18:14")}
                </p>
              </div>
            </div>
          </div>

          {/* LEGEND */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm uppercase tracking-widest text-slate-400">
              Seat Types
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-slate-500 rounded-full" />
                  Regular
                </div>
                <span>₹ {seatsData?.price?.REGULAR}</span>
              </div>

               <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-slate-500 rounded-full" />
                  Couple
                </div>
                <span>₹ {seatsData?.price?.COUPLE}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  VIP
                </div>
                <span>₹ {seatsData?.price?.VIP}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-500">
                <div className="w-3 h-3 bg-slate-700 rounded-full" />
                Occupied
              </div>
            </div>
          </div>

          {/* STATS CARD */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-2xl p-6 shadow-lg">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-4">
              Booking Stats
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-500">Booked</p>
                <p className="text-lg font-bold">{seatsData?.totalBookedTickets || 0}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Remaining</p>
                <p className="text-lg font-bold">{seatsData?.remainingSeats || 0}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Total Seats</p>
                <p className="text-lg font-bold">{seatsData?.totalSeats || 0}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Revenue</p>
                <p className="text-lg font-bold text-cyan-400 flex justify-center items-center">
                  <IndianRupee size={16} />
                  {seatsData?.totalRevenue || 0}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
);
     
    </>
  );
}


 {/* <div className="min-h-screen overflow-auto w-screen z-50 fixed top-0 bg-[#020617] text-slate-200 font-sans pb-32">
        {/* Cinematic Header */}
        // <header className="sticky top-0 flex items-center justify-between px-8 py-6 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
        //   <button
        //     onClick={() => navigate(-1)}
        //     className="p-2 hover:bg-white/10 rounded-full transition-all"
        //   >
        //     <ChevronLeft size={24} className="text-cyan-400" />
        //   </button>
        //   <div className="text-center">
        //     <h1 className="text-lg font-bold tracking-widest uppercase">
        //       Experience Selection
        //     </h1>
        //     <p className="text-[10px] text-slate-500 font-medium tracking-[0.2em]">
        //       PREMIUM THEATER SCREEN 01
        //     </p>
        //   </div>
        //   <Info size={20} className="text-slate-600" />
        // </header>

//         <main className="w-full h-[90vh] pb-[6rem] flex flex-col justify-center gap-6 overflow-scroll mx-auto mt-12 px-6">
//           {/* Curved Glow Screen */}
//           <div className="relative  flex flex-col items-center">
//             <div className="w-[80%] h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>
//             <div className="w-[90%] h-20 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-[50%] blur-2xl -mt-2"></div>
//             <p className="text-[10px] tracking-[0.6em] text-cyan-500/50 uppercase font-black mt-2">
//               Screen
//             </p>
//           </div>
//           <div className="flex flex-col lg:flex-row justify-evenly">
//           {/* Dynamic Seats Grid */}
//           <div className="hide-scrollbar flex flex-col items-center gap-6 overflow-x-auto pb-8">
//             {Object.keys(groupedRows)
//               .sort()
//               .map((rowLabel) => (
//                 <div key={rowLabel} className="flex items-center gap-8 group">
//                   <span className="w-4 text-[11px] font-black text-slate-700 group-hover:text-slate-400 transition-colors">
//                     {rowLabel}
//                   </span>
//                   <div className="flex gap-3">
//                     {groupedRows[rowLabel]
//                       .sort((a, b) => a.number - b.number)
//                       .map((seat) => {
//                         const seatId = `${seat.row}${seat.number}`;
//                         const isBooked = bookedSeats.includes(seatId);
//                         const isSelected = selectedSeats.includes(seatId);

//                         const iconStyle = isBooked
//                           ? "text-slate-800"
//                           : isSelected
//                             ? "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] scale-110"
//                             : seat.type === "VIP"
//                               ? "text-amber-500/80 hover:text-amber-400"
//                               : "text-slate-600 hover:text-slate-300";

//                         return (
//                           <button
//                             key={seatId}
//                             disabled={isBooked}
//                             // onClick={() => toggleSeat(seatId)}
//                             className="relative flex flex-col items-center transition-all duration-300 transform active:scale-90"
//                           >
//                             <Armchair
//                               size={28}
//                               className={iconStyle}
//                               fill={isSelected ? "currentColor" : "none"}
//                               strokeWidth={isSelected ? 1.5 : 2}
//                             />
//                             <span
//                               className={`text-[8px] mt-1 font-bold ${isSelected ? "text-cyan-400" : "text-slate-700"}`}
//                             >
//                               {seat.number}
//                             </span>
//                           </button>
//                         );
//                       })}
//                   </div>
//                 </div>
//               ))}
//           </div>

//         <div className="flex flex-col gap-8" >
             
//              {/* date and time */}
//              <div className="flex gap-8">
//               <div className=" flex flex-col gap-4">
//                <p>Date</p>
//                <span>14 july 2026</span>
//               </div>
//                <div className=" flex flex-col gap-4">
//                <p>Time</p>
//                <span>07 :40 AM</span>
//               </div>
//              </div>

//           {/* Legend */}
//           <div className="flex justify-center gap-8 mt-12 text-[10px] font-bold uppercase tracking-widest text-slate-500">
//            <div className="flex gap-2 justify-center items-center">
//              <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-slate-600 rounded-full" /> Regular
             
//             </div>
//              <span>{seatsData?.price?.REGULAR}</span>
//            </div>
//           <div className="flex gap-2 justify-center items-center">
//               <div className="flex  items-center gap-2">
//               <div className="w-2 h-2 bg-amber-500 rounded-full" />
//               VIP
//             </div>
//             <p>{seatsData?.price.VIP}</p>
//           </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-slate-800 rounded-full" /> Occupied
//             </div>
//             {/* <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee] rounded-full" />{" "}
//               Selected
//             </div> */}
//           </div>

//           {/* Bottom Floating Checkout Bar */}
//           <div className="w-full flex justify-center items-center">
//             <footer className="w-full bottom-6 flex items-center justify-between  max-w-xl bg-slate-900/90 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
//               <div className="pl-4  flex flex-col justify-center items-center">
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">
//                   Selected Seats
//                 </p>
//                 <h2 className="text-white text-lg font-black truncate max-w-[150px]">
//                  {seatsData?.
// totalBookedTickets
// ||0}
//                 </h2>
//               </div>
//               <div className="pl-4  flex flex-col justify-center items-center">
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">
//                   Total Seats
//                 </p>
//                 <h2 className="text-white text-lg font-black truncate max-w-[150px]">
//                  {seatsData?.
// totalSeats
// ||0}
//                 </h2>
//               </div>
//               <div className="px-8 flex flex-col justify-center items-center ">
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">
//                   Selected Seats
//                 </p>
//                 <h2 className="text-white text-lg font-black truncate max-w-[150px]">
//                  {seatsData?.
// remainingSeats
// ||0}
//                 </h2>
//               </div>
//                 <div className="flex-1">
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">
//                   Collected Amount
//                 </p>
//                 <h2 className="text-cyan-400 flex items-center text-2xl font-black">
//                   <IndianRupee />
//                   {seatsData?.totalRevenue||0}
//                 </h2>
//               </div>
             
//             </footer>
//           </div>
//          </div>
//           </div>
//         </main>
      // </div> 