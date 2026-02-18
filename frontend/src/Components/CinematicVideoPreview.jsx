import React, { useState, useRef, useEffect } from "react";
import { Play, Maximize, ExternalLink, Clock, Volume2, VolumeX } from "lucide-react";

export default function CinematicVideoPreview({ 
  videoUrl, 
  thumbnail, 
  duration, 
  className = "" 
}) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Auto-play blocked:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedPos = (x / rect.width);
      videoRef.current.currentTime = clickedPos * videoRef.current.duration;
    }
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const handlePiP = async (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.error("PiP error:", err);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 group/vid ${className}`}
    >
      {/* Layer 0: Cinematic Blurred Background Layer */}
      <img
        src={thumbnail}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-3xl saturate-[1.8] brightness-[0.4] scale-150 z-0"
      />
      
      {/* Vignette Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 z-0" />

      {/* Layer 1: Static Thumbnail (Contained) */}
      <img
        src={thumbnail}
        alt="Preview Thumbnail"
        className={`absolute inset-0 w-full h-full aspect-video transition-opacity duration-500 z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${isHovered ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Layer 2: Hover Video Preview (Contained) */}
      <video
        ref={videoRef}
        src={videoUrl}
        muted={isMuted}
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
      />

      {/* Custom Overlays */}
      <div className={`absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-40'}`} />
      
      {/* Advanced Controls Overlay (Top Right) */}
      <div className={`absolute top-4 right-4 flex items-center gap-2.5 transition-all duration-500 z-20 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <button 
          onClick={toggleMute}
          className="p-2.5 bg-slate-950/60 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-indigo-600 transition-all group/tool active:scale-90"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button 
          onClick={handlePiP}
          className="p-2.5 bg-slate-950/60 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-indigo-600 transition-all group/tool active:scale-90"
          title="Split Side View"
        >
          <ExternalLink size={16} />
        </button>
        <button 
          onClick={handleFullscreen}
          className="p-2.5 bg-slate-950/60 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-indigo-600 transition-all group/tool active:scale-90"
          title="Large Screen"
        >
          <Maximize size={16} />
        </button>
      </div>

      {/* Progress Bar (Bottom) - Enhanced Visibility */}
      <div 
        onClick={handleSeek}
        className={`absolute bottom-0 left-0 right-0 h-2 bg-white/10 cursor-pointer transition-all duration-500 z-20 group/seek ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <div 
          className="h-full bg-indigo-500 relative transition-all duration-150 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 bg-white rounded-full scale-0 group-hover/seek:scale-100 transition-transform shadow-2xl z-30 ring-4 ring-indigo-500/30" />
        </div>
      </div>

      {/* Play Icon Overlay (Center) */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 pointer-events-none ${isHovered ? 'opacity-0 scale-150' : 'opacity-100 scale-100'}`}>
        <div className="p-5 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <Play size={32} fill="currentColor" className="ml-1" />
        </div>
      </div>

      {/* Duration Badge */}
      {duration && (
        <div className={`absolute bottom-5 right-5 backdrop-blur-xl bg-slate-950/70 text-white px-3 py-1.5 rounded-xl text-[10px] font-black tabular-nums border border-white/10 flex items-center gap-2 transition-all duration-500 ${isHovered ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <Clock size={12} className="text-indigo-400" />
          {duration.toUpperCase()}
        </div>
      )}
    </div>
  );
}
