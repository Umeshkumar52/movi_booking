import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Ticket, Calendar, Armchair, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

const BookingSuccess = ({ isOpen, onClose, details}) => {
  // Trigger confetti when component mounts
  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [isOpen]);
   
  if (!isOpen) return null;

  // useEffect(()=>{
  //  setTimeout(() => {
  //   onClose()
  //  }, 5000);
  // },[])
 
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative max-w-md w-full bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden"
        >
          {/* Animated Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Success Icon Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="bg-cyan-500/20 p-4 rounded-full mb-6"
            >
              <CheckCircle2 size={64} className="text-cyan-400" />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }}
              className="text-3xl font-black text-white mb-2"
            >
              Woohoo!
            </motion.h2>
            <p className="text-slate-400 font-medium mb-8">Your cinematic journey begins!</p>

            {/* Ticket Details Card */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 mb-8 text-left space-y-4"
            >
              <div className="flex items-center gap-4">
                <Ticket className="text-cyan-400" size={20} />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Theater</p>
                  <p className="text-sm font-bold text-white">{details?.threaterName || "Movie Title"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <Armchair className="text-cyan-400" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Seats</p>
                    <p className="text-sm font-bold text-white">{details?.seats?.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="text-cyan-400" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Price</p>
                    <p className="text-sm font-bold text-white">${details?.totalPrice}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="group w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              {/* Go to My Tickets */}
              Go Back
              <ArrowLeft size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingSuccess;