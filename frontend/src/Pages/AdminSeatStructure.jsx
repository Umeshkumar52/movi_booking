import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Armchair, ChevronLeft, Info, Calendar, Clock, Ticket } from "lucide-react";
import { toast } from "react-toastify";
import instance from "../utils/axiosInstance";
import handlePayment from "../utils/handlePayment";
import { IndianRupee } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";
import { formatDate, convertTo12Hour } from "../utils/convertToHours";

export default function SeatBooking() {
  const [searchParams] = useSearchParams();
  const show_id = searchParams.get("showId");

  const { user } = useContext(AuthContext);
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
  const [seatsData, setSeatsData] = useState(null);

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seatData = layout.find((s) => `${s.row}${s.number}` === seatId);
    return sum + (priceMap[seatData?.type] || 12);
  }, 0);

  // Fetch show/theater data
  async function MovieShow() {
    try {
      setLoading(true);

      const { data } = await instance.get(
        `/movies/show/details/${show_id}`,
      );
      setSeatsData(data?.message[0]);
      console.log(data?.message[0]);
      setTheaterName(data?.message[0].theater[0]?.name);
      setShowId(data?.message[0].showId);
      setLayout(data?.message[0].theater[0].layout || []);
      setBookedSeats((prev) => [...prev, ...(data?.message[0].bookedSeats || [])]);
      setPriceMap(data?.message[0].price);

    } catch (error) {
      toast.error("Something went wrong");
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
      recieverId: user?._id,
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
    <div className="min-h-screen w-screen z-50 fixed inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-slate-200 overflow-auto pb-40 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#020617]/80 border-b border-white/5 px-6 py-5 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-cyan-500/10 transition group"
        >
          <ChevronLeft className="text-cyan-400 group-hover:-translate-x-1 transition-transform" size={26} />
        </button>

        <div className="text-center">
          <h1 className="text-xl font-black tracking-widest uppercase bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
            Live Seat Status
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-[0.2em] uppercase mt-1">
            {threaterName || "Premium Screen"}
          </p>
        </div>

        <button className="p-2 rounded-full hover:bg-white/5 transition text-slate-500 hover:text-cyan-400">
          <Info size={22} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        
        {/* TOP STATUS BAR (Optional quick stats) */}
        {!loading && seatsData && (
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">{seatsData?.totalBookedTickets || 0}</span> Booked
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">{seatsData?.remainingSeats || 0}</span> Available
            </div>
          </div>
        )}

        {/* SCREEN SECTION */}
        <div className="flex flex-col items-center mt-4">
          <div className="w-[85%] h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_30px_rgba(34,211,238,0.8)]" />
          <div className="w-[95%] h-24 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-[50%] blur-3xl -mt-4 pointer-events-none" />
          <span className="mt-4 text-cyan-400/50 font-black tracking-[0.8em] text-[10px] uppercase drop-shadow">
            Screen
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* SEATS GRID CONTAINER */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 shadow-2xl backdrop-blur-sm overflow-hidden">
            <div className="w-full overflow-x-auto hide-scrollbar pb-6 flex flex-col items-center gap-6">
              {Object.keys(groupedRows).sort().map((rowLabel) => (
                <div key={rowLabel} className="flex items-center gap-8 group/row">
                  <span className="text-xs font-black text-slate-700 group-hover/row:text-slate-400 transition-colors w-4 text-center">
                    {rowLabel}
                  </span>

                  <div className="flex gap-3">
                    {groupedRows[rowLabel]
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => {
                        const seatId = `${seat.row}${seat.number}`;
                        const isBooked = bookedSeats.includes(seatId);
                        
                        // Styling Logic for Admin View (Read Only)
                        const iconStyle = isBooked
                          ? "text-slate-700 opacity-60 drop-shadow-none" // Booked (Grey out)
                          : seat.type === "VIP"
                            ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] group-hover:text-amber-400" // Vacant VIP (Amber Glow)
                            : "text-slate-400 drop-shadow-[0_0_5px_rgba(148,163,184,0.3)] group-hover:text-white"; // Vacant Regular (Slate Bright)

                        return (
                          <div
                            key={seatId}
                            className="relative flex flex-col items-center transition-all duration-300 group cursor-default"
                            title={`Seat: ${seatId} | Type: ${seat.type} | Status: ${isBooked ? 'Booked' : 'Available'}`}
                          >
                            <Armchair
                              size={32}
                              className={`transition-all duration-300 ${iconStyle}`}
                              fill={isBooked ? "currentColor" : "none"}
                              strokeWidth={isBooked ? 1 : 1.5}
                            />
                            <span className={`absolute -bottom-5 text-[9px] font-bold tracking-wider ${isBooked ? "text-slate-700" : "text-slate-500 group-hover:text-cyan-400 transition-colors"}`}>
                              {seat.number}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE DASHBOARD PANELS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SHOW INFO CARD */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full group-hover:bg-indigo-500/20 transition-all" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-5 flex items-center gap-2">
                <Ticket size={14} /> Session Details
              </h3>

              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-wider">Date</p>
                  </div>
                  <p className="font-bold text-sm text-slate-200">
                    {formatDate(seatsData?.date || "2026-02-27T00:00:00.000Z")}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-wider">Time</p>
                  </div>
                  <p className="font-bold text-sm text-slate-200">
                    {convertTo12Hour(seatsData?.time || "18:14")}
                  </p>
                </div>
              </div>
            </div>

            {/* REVENUE & STATS CARD */}
            <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/40 backdrop-blur-xl border border-cyan-500/20 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(6,182,212,0.1)] relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full group-hover:bg-cyan-500/30 transition-all" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-6 flex items-center gap-2">
                 Live Statistics
              </h3>

              <div className="space-y-6 relative z-10">
                {/* Revenue Highlight */}
                <div className="flex items-center justify-between border-b border-white/5 pb-5">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Total Revenue</p>
                  <p className="text-3xl font-black text-white flex justify-center items-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    <IndianRupee size={24} className="mr-1 text-cyan-400" />
                    {seatsData?.totalRevenue || 0}
                  </p>
                </div>

                {/* Sub Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total</p>
                    <p className="text-lg font-black text-slate-200">{seatsData?.totalSeats || 0}</p>
                  </div>

                  <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10">
                    <p className="text-[9px] text-emerald-500/70 uppercase tracking-widest font-bold mb-1">Booked</p>
                    <p className="text-lg font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{seatsData?.totalBookedTickets || 0}</p>
                  </div>

                  <div className="bg-cyan-500/5 rounded-xl p-3 border border-cyan-500/10">
                    <p className="text-[9px] text-cyan-500/70 uppercase tracking-widest font-bold mb-1">Empty</p>
                    <p className="text-lg font-black text-cyan-400">{seatsData?.remainingSeats || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LEGEND CARD */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">
                Pricing Legend
              </h3>

              <div className="space-y-4 text-xs font-medium">
                <div className="flex justify-between items-center group/legend">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Armchair size={18} className="text-slate-400 group-hover/legend:text-white transition-colors" />
                    Regular Segment
                  </div>
                  <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-full text-[10px]">₹ {seatsData?.price?.REGULAR || '-'}</span>
                </div>

                <div className="flex justify-between items-center group/legend">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Armchair size={18} className="text-blue-400 group-hover/legend:text-blue-300 transition-colors" />
                    Couple Segment
                  </div>
                  <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-full text-[10px]">₹ {seatsData?.price?.COUPLE || '-'}</span>
                </div>

                <div className="flex justify-between items-center group/legend">
                  <div className="flex items-center gap-3 text-amber-500">
                    <Armchair size={18} className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] group-hover/legend:text-amber-400 transition-colors" />
                    VIP Segment
                  </div>
                  <span className="font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-[10px]">₹ {seatsData?.price?.VIP || '-'}</span>
                </div>
                
                <div className="h-px w-full bg-white/5 my-2" />

                <div className="flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Armchair size={18} className="text-slate-700" fill="currentColor" />
                    Occupied Seat
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Unavailable</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
} 