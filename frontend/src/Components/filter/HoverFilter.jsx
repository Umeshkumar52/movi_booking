import React, { useState } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  Film,
  Activity,
  Globe,
  Tag,
  Calendar,
  Crown,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const INITIAL_FILTERS = {
  Category: "",
  status: "",
  language: "",
  genres: "",
  year: "",
  premium: "",
};

/* ── Option button ── */
function OptionButton({ label, active, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 w-full text-left whitespace-nowrap ${
        active
          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30 scale-105"
          : "bg-slate-800/40 text-slate-400 border border-transparent hover:bg-slate-800 hover:text-indigo-400"
      }`}
    >
      {label}
    </button>
  );
}

/* ── Dropdown Container ── */
function DropdownMenu({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute top-full left-0 pt-2 z-50 min-w-[200px]"
        >
          <div 
            className="p-3 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const FilterTrigger = ({ id, icon: Icon, label, isActive, hoveredFilter, setHoveredFilter, children }) => {
  const isHovered = hoveredFilter === id;
  return (
    <div
      className="relative group"
      onMouseEnter={() => setHoveredFilter(id)}
      onMouseLeave={() => setHoveredFilter(null)}
    >
      <button
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 border ${
          isActive || isHovered
            ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-inner"
            : "bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }`}
      >
        <Icon size={16} />
        <span className="text-sm font-semibold">{label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isHovered ? "rotate-180 text-indigo-400" : "text-slate-500"
          }`}
        />
        {isActive && (
          <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
        )}
      </button>
      <DropdownMenu isOpen={isHovered}>{children}</DropdownMenu>
    </div>
  );
};

export default function HoverFilter({ filters, onChange }) {
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [localYear, setLocalYear] = useState(filters.year || "");

  React.useEffect(() => {
    if (filters.year !== localYear) {
      setLocalYear(filters.year || "");
    }
  }, [filters.year]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.year !== localYear) {
        onChange({ ...filters, year: localYear });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [localYear, filters, onChange]);

  const activeCount = Object.values(filters).filter((v) => v !== "").length;

  const handleChange = (key, value) => {
    const newVal = filters[key] === value ? "" : value;
    onChange({ ...filters, [key]: newVal });
  };

  const clearAll = () => {
    onChange({ ...INITIAL_FILTERS });
  };

  return (
    <div className="w-full bg-slate-900/40 border-b border-white/5 px-6 lg:px-12 py-8 backdrop-blur-sm sticky top-[73px] z-40">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-4 text-slate-300">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <SlidersHorizontal size={18} className="text-indigo-400" />
          </div>
          <span className="font-bold text-sm tracking-wide">Filters</span>
          {activeCount > 0 && (
            <span className="ml-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>

        <FilterTrigger hoveredFilter={hoveredFilter} setHoveredFilter={setHoveredFilter} id="category" icon={Film} label="Type" isActive={!!filters.Category}>
          <div className="grid grid-cols-1 gap-2">
            <OptionButton
              label="🎬 Movies"
              active={filters.Category === "movie"}
              onClick={() => handleChange("Category", "movie")}
            />
            <OptionButton
              label="📺 Series"
              active={filters.Category === "series"}
              onClick={() => handleChange("Category", "series")}
            />
          </div>
        </FilterTrigger>

        <FilterTrigger hoveredFilter={hoveredFilter} setHoveredFilter={setHoveredFilter} id="status" icon={Activity} label="Status" isActive={!!filters.status}>
          <div className="grid grid-cols-1 gap-2">
            <OptionButton
              label="● Active"
              active={filters.status === "active"}
              onClick={() => handleChange("status", "active")}
            />
            <OptionButton
              label="○ Inactive"
              active={filters.status === "inactive"}
              onClick={() => handleChange("status", "inactive")}
            />
          </div>
        </FilterTrigger>

        <FilterTrigger hoveredFilter={hoveredFilter} setHoveredFilter={setHoveredFilter} id="language" icon={Globe} label="Language" isActive={!!filters.language}>
          <div className="grid grid-cols-2 gap-2 w-[280px]">
            {["hindi", "english", "tamil", "telugu", "malayalam"].map((lang) => (
              <OptionButton
                key={lang}
                label={lang.charAt(0).toUpperCase() + lang.slice(1)}
                active={filters.language === lang}
                onClick={() => handleChange("language", lang)}
              />
            ))}
          </div>
        </FilterTrigger>

        <FilterTrigger hoveredFilter={hoveredFilter} setHoveredFilter={setHoveredFilter} id="genres" icon={Tag} label="Genre" isActive={!!filters.genres}>
          <div className="grid grid-cols-2 gap-2 w-[280px]">
             {["action", "comedy", "romantic", "drama", "thriller", "horror"].map((g) => (
              <OptionButton
                key={g}
                label={g.charAt(0).toUpperCase() + g.slice(1)}
                active={filters.genres === g}
                onClick={() => handleChange("genres", g)}
              />
            ))}
          </div>
        </FilterTrigger>

        <FilterTrigger hoveredFilter={hoveredFilter} setHoveredFilter={setHoveredFilter} id="premium" icon={Crown} label="Access" isActive={!!filters.premium}>
          <div className="grid grid-cols-1 gap-2">
            <OptionButton
              label="👑 Premium Only"
              active={filters.premium === "true"}
              onClick={() => handleChange("premium", "true")}
            />
            <OptionButton
              label="🆓 Free Access"
              active={filters.premium === "false"}
              onClick={() => handleChange("premium", "false")}
            />
          </div>
        </FilterTrigger>

        <FilterTrigger hoveredFilter={hoveredFilter} setHoveredFilter={setHoveredFilter} id="year" icon={Calendar} label="Year" isActive={!!filters.year}>
            <div className="p-1">
                 <input
                    type="number"
                    value={localYear}
                    onChange={(e) =>{  setLocalYear(e.target.value)}}
                    placeholder="e.g. 2024"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>
        </FilterTrigger>

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-colors border border-red-500/20 font-semibold text-sm"
            title="Clear all filters"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
