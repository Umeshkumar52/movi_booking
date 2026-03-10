import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carausel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  const slideLeft = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  }, [items.length]);

  const slideRight = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  }, [items.length]);

  useEffect(() => {
    if (isPaused || !items || items.length === 0) return;
    const interval = setInterval(slideRight, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slideRight, items]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  if (!items || items.length === 0) return null;

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <div 
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl group shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {items[currentIndex].type === 'video' ? (
            <video
              key={items[currentIndex].src}
              src={items[currentIndex].src}
              className="w-full h-full object-cover"
              autoPlay
             
              loop
              muted
              playsInline
              webkit-playsinline="true"
            />
          ) : (
            <img
              src={items[currentIndex].src}
              alt={items[currentIndex].title || 'Carousel Slide'}
              className="w-full h-full object-cover"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

          {/* Text Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 lg:p-20 z-10 flex flex-col justify-end">
             {items[currentIndex].badge && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 w-fit shadow-lg shadow-red-600/30">
                  {items[currentIndex].badge}
                </span>
             )}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg max-w-4xl tracking-tight">
              {items[currentIndex].title}
            </h2>
            <p className="text-lg md:text-xl text-slate-200 drop-shadow-md mb-8 max-w-2xl font-medium">
              {items[currentIndex].description}
            </p>
            {items[currentIndex].buttonText && (
               <button className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full w-fit transition-transform transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/30">
                 {items[currentIndex].buttonText}
               </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 md:left-8 flex items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); slideLeft(); }}
          className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg border border-white/10 hover:border-white/30"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 md:right-8 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); slideRight(); }}
          className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg border border-white/10 hover:border-white/30"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index
                ? "bg-white w-8 h-2.5 shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                : "bg-white/40 hover:bg-white/70 w-2.5 h-2.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carausel;
