import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Film,
  Activity,
  Globe,
  Tag,
  Calendar,
  Crown,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

const INITIAL_FILTERS = {
  Category: "",
  status: "",
  language: "",
  genres: "",
  year: "",
  premium: "",
};

/* ── Filter Section wrapper ── */
function FilterSection({ icon: Icon, title, children }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 px-1">
        <Icon size={13} className="text-indigo-400/70" />
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ── Option button (for dropdowns displayed as button groups) ── */
function OptionButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-[12px] font-semibold transition-all duration-150 w-full text-left ${
        active
          ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10"
          : "bg-slate-800/40 text-slate-400 border border-transparent hover:bg-slate-800/80 hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

/* ── Text input field ── */
function FilterInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg px-3 py-2.5 text-[13px] font-medium placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/50 hover:border-slate-600 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
}

export default function AdminFilters({ filters, onChange }) {
  const [collapsed, setCollapsed] = useState(false);

  const activeCount = Object.values(filters).filter((v) => v !== "").length;

  const handleChange = (key, value) => {
    // toggle off if same value clicked
    const newVal = filters[key] === value ? "" : value;
    onChange({ ...filters, [key]: newVal });
  };

  const handleInput = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  // Multi-select: toggle value in a comma-separated string
const handleMultiChange = (key, value) => {
  onChange({
    ...filters,
    [key]: filters[key] === value ? "" : value, // toggle single select
  });
};


  const clearAll = () => {
    onChange({ ...INITIAL_FILTERS });
  };

  /* ── Collapsed sidebar: just icons ── */
  if (collapsed) {
    return (
      <aside className="hidden lg:flex flex-col items-center w-14 bg-slate-900/60 border-r border-white/[0.04] py-6 gap-4 shrink-0 sticky top-0  h-[calc(100vh-73px)] ">
      
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
          title="Show Filters"
        >
          <PanelLeft size={18} />
        </button>
        <div className="w-6 h-px bg-slate-800 mt-1" />
        <div className="relative p-2 rounded-lg text-slate-600">
          <SlidersHorizontal size={16} />
          {activeCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-indigo-600 text-[9px] text-white font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
      </aside>
    );
  }

  /* ── Full sidebar ── */
  return (
    <aside className="sticky top-0 w-[260px] z-20 shrink-0 bg-gradient-to-b from-slate-900/80 to-slate-900/60 border-r border-white/[0.04] hidden lg:flex flex-col sticky top-[73px] h-[calc(100vh-73px)]">
      {/* custom scrollbar hide */}

      {/* Header */}
      <div className="bg-slate-900/95 border-b border-white/[0.04] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-indigo-600/15 flex items-center justify-center">
            <SlidersHorizontal size={14} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Filters</h3>
            {activeCount > 0 && (
              <p className="text-[10px] text-indigo-400/80 font-medium">
                {activeCount} active
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
          title="Collapse Sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Clear All */}
      {activeCount > 0 && (
        <div className="px-4 pt-3">
          <button
            onClick={clearAll}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400 text-[11px] font-semibold hover:bg-red-500/15 hover:border-red-500/25 transition-all"
          >
            <RotateCcw size={11} />
            Clear All Filters
          </button>
        </div>
      )}

      {/* Filter Sections */}
      <div className="px-4 py-5 space-y-6 flex-1">
        {/* ── Category ── */}
        <FilterSection icon={Film} title="Content Type">
          <div className="grid grid-cols-2 gap-1.5">
            <OptionButton
              label="🎬 Movie"
              active={filters.Category === "movie"}
              onClick={() => handleChange("Category", "movie")}
            />
            <OptionButton
              label="📺 Series"
              active={filters.Category === "series"}
              onClick={() => handleChange("Category", "series")}
            />
          </div>
        </FilterSection>

        {/* ── Status ── */}
        <FilterSection icon={Activity} title="Status">
          <div className="grid grid-cols-2 gap-1.5">
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
        </FilterSection>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

        {/* ── Language ── */}
        <FilterSection icon={Globe} title="Language">
          <div className="grid grid-cols-2 gap-1.5">
            {["hindi", "english", "tamil", "telugu", "malayalam"].map(
              (lang) => (
                <OptionButton
                  key={lang}
                  label={lang.charAt(0).toUpperCase() + lang.slice(1)}
                 active={filters.language === lang}
onClick={() => handleChange("language", lang)}

                />
              ),
            )}
          </div>
        </FilterSection>

        {/* ── Genres ── */}
        <FilterSection icon={Tag} title="Genre">
          <div className="grid grid-cols-2 gap-1.5">
            {[
              "action",
              "comedy",
              "romantic",
              "drama",
              "thriller",
              "horror",
            ].map((g) => (
              <OptionButton
                key={g}
                label={g.charAt(0).toUpperCase() + g.slice(1)}
               active={filters.genres === g}
onClick={() => handleChange("genres", g)}

              />
            ))}
          </div>
        </FilterSection>

        {/* ── Year ── */}
        <FilterSection icon={Calendar} title="Release Year">
          <FilterInput
            value={filters.year}
            onChange={(v) => handleInput("year", v)}
            placeholder="e.g. 2024"
            type="number"
          />
        </FilterSection>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

        {/* ── Premium ── */}
        <FilterSection icon={Crown} title="Premium">
          <div className="grid grid-cols-2 gap-1.5">
            <OptionButton
              label="👑 Premium"
              active={filters.premium === "true"}
              onClick={() => handleChange("premium", "true")}
            />
            <OptionButton
              label="🆓 Free"
              active={filters.premium === "false"}
              onClick={() => handleChange("premium", "false")}
            />
          </div>
        </FilterSection>
      </div>

      {/* Footer summary */}
      <div className="bg-slate-900/95 border-t border-white/[0.04] px-4 py-3">
        <p className="text-[11px] text-slate-500 text-center font-medium">
          {activeCount > 0 ? `Showing filtered results` : "No filters applied"}
        </p>
      </div>
    </aside>
  );
}

export { INITIAL_FILTERS };

// ***************

// import { useState } from "react";
// import {
//   SlidersHorizontal,
//   X,
//   RotateCcw,
//   Film,
//   Activity,
//   Globe,
//   Tag,
//   Calendar,
//   Crown,
//   ChevronDown,
//   PanelLeftClose,
//   PanelLeft,
// } from "lucide-react";

// const INITIAL_FILTERS = {
//   Category: "",
//   status: "",
//   language: "",
//   genres: "",
//   year: "",
//   premium: "",
// };

// /* ── Filter Section wrapper ── */
// function FilterSection({ icon: Icon, title, children }) {
//   return (
//     <div className="space-y-2.5">
//       <div className="flex items-center gap-2 px-1">
//         <Icon size={13} className="text-indigo-400/70" />
//         <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
//           {title}
//         </span>
//       </div>
//       {children}
//     </div>
//   );
// }

// /* ── Option button (for dropdowns displayed as button groups) ── */
// function OptionButton({ label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-3 py-2 rounded-lg text-[12px] font-semibold transition-all duration-150 w-full text-left ${
//         active
//           ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10"
//           : "bg-slate-800/40 text-slate-400 border border-transparent hover:bg-slate-800/80 hover:text-slate-200"
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// /* ── Text input field ── */
// function FilterInput({ value, onChange, placeholder, type = "text" }) {
//   return (
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-lg px-3 py-2.5 text-[13px] font-medium placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/50 hover:border-slate-600 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//     />
//   );
// }

// export default function AdminFilters({ filters, onChange }) {
//   const [collapsed, setCollapsed] = useState(false);

//   const activeCount = Object.values(filters).filter((v) => v !== "").length;

//   const handleChange = (key, value) => {
//     // toggle off if same value clicked
//     const newVal = filters[key] === value ? "" : value;
//     onChange({ ...filters, [key]: newVal });
//   };

//   const handleInput = (key, value) => {
//     onChange({ ...filters, [key]: value });
//   };

//   // Multi-select: toggle value in a comma-separated string
//   const handleMultiChange = (key, value) => {
//     const current = filters[key] ? filters[key].split(",") : [];
//     const idx = current.indexOf(value);
//     if (idx >= 0) {
//       current.splice(idx, 1);
//     } else {
//       current.push(value);
//     }
//     onChange({ ...filters, [key]: current.join(",") });
//   };

//   const clearAll = () => {
//     onChange({ ...INITIAL_FILTERS });
//   };

//   /* ── Collapsed sidebar: just icons ── */
//   if (collapsed) {
//     return (
//       <aside className="hidden lg:flex flex-col items-center w-14 bg-slate-900/60 border-r border-white/[0.04] py-6 gap-4 shrink-0 sticky top-[73px] h-[calc(100vh-73px)]">
//         <button
//           onClick={() => setCollapsed(false)}
//           className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
//           title="Show Filters"
//         >
//           <PanelLeft size={18} />
//         </button>
//         <div className="w-6 h-px bg-slate-800 mt-1" />
//         <div className="relative p-2 rounded-lg text-slate-600">
//           <SlidersHorizontal size={16} />
//           {activeCount > 0 && (
//             <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-indigo-600 text-[9px] text-white font-bold flex items-center justify-center">
//               {activeCount}
//             </span>
//           )}
//         </div>
//       </aside>
//     );
//   }

//   /* ── Full sidebar ── */
//   return (
//     <aside className="sticky top-0 w-[260px] z-20 shrink-0 bg-gradient-to-b from-slate-900/80 to-slate-900/60 border-r border-white/[0.04] hidden lg:flex flex-col sticky top-[73px] h-[calc(100vh-73px)]">
//       {/* custom scrollbar hide */}

//       {/* Header */}
//       <div className="bg-slate-900/95 border-b border-white/[0.04] px-4 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-2.5">
//           <div className="size-7 rounded-lg bg-indigo-600/15 flex items-center justify-center">
//             <SlidersHorizontal size={14} className="text-indigo-400" />
//           </div>
//           <div>
//             <h3 className="text-sm font-bold text-slate-200">Filters</h3>
//             {activeCount > 0 && (
//               <p className="text-[10px] text-indigo-400/80 font-medium">
//                 {activeCount} active
//               </p>
//             )}
//           </div>
//         </div>
//         <button
//           onClick={() => setCollapsed(true)}
//           className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
//           title="Collapse Sidebar"
//         >
//           <PanelLeftClose size={16} />
//         </button>
//       </div>

//       {/* Clear All */}
//       {activeCount > 0 && (
//         <div className="px-4 pt-3">
//           <button
//             onClick={clearAll}
//             className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400 text-[11px] font-semibold hover:bg-red-500/15 hover:border-red-500/25 transition-all"
//           >
//             <RotateCcw size={11} />
//             Clear All Filters
//           </button>
//         </div>
//       )}

//       {/* Filter Sections */}
//       <div className="px-4 py-5 space-y-6 flex-1">
//         {/* ── Category ── */}
//         <FilterSection icon={Film} title="Content Type">
//           <div className="grid grid-cols-2 gap-1.5">
//             <OptionButton
//               label="🎬 Movie"
//               active={filters.Category === "movie"}
//               onClick={() => handleChange("Category", "movie")}
//             />
//             <OptionButton
//               label="📺 Series"
//               active={filters.Category === "series"}
//               onClick={() => handleChange("Category", "series")}
//             />
//           </div>
//         </FilterSection>

//         {/* ── Status ── */}
//         <FilterSection icon={Activity} title="Status">
//           <div className="grid grid-cols-2 gap-1.5">
//             <OptionButton
//               label="● Active"
//               active={filters.status === "active"}
//               onClick={() => handleChange("status", "active")}
//             />
//             <OptionButton
//               label="○ Inactive"
//               active={filters.status === "inactive"}
//               onClick={() => handleChange("status", "inactive")}
//             />
//           </div>
//         </FilterSection>

//         {/* ── Divider ── */}
//         <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

//         {/* ── Language ── */}
//         <FilterSection icon={Globe} title="Language">
//           <div className="grid grid-cols-2 gap-1.5">
//             {["hindi", "english", "tamil", "telugu", "malayalam"].map((lang) => (
//               <OptionButton
//                 key={lang}
//                 label={lang.charAt(0).toUpperCase() + lang.slice(1)}
//                 active={filters.language.split(",").includes(lang)}
//                 onClick={() => handleMultiChange("language", lang)}
//               />
//             ))}
//           </div>
//         </FilterSection>

//         {/* ── Genres ── */}
//         <FilterSection icon={Tag} title="Genre">
//           <div className="grid grid-cols-2 gap-1.5">
//             {["action", "comedy", "romantic", "drama", "thriller", "horror"].map((g) => (
//               <OptionButton
//                 key={g}
//                 label={g.charAt(0).toUpperCase() + g.slice(1)}
//                 active={filters.genres.split(",").includes(g)}
//                 onClick={() => handleMultiChange("genres", g)}
//               />
//             ))}
//           </div>
//         </FilterSection>

//         {/* ── Year ── */}
//         <FilterSection icon={Calendar} title="Release Year">
//           <FilterInput
//             value={filters.year}
//             onChange={(v) => handleInput("year", v)}
//             placeholder="e.g. 2024"
//             type="number"
//           />
//         </FilterSection>

//         {/* ── Divider ── */}
//         <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

//         {/* ── Premium ── */}
//         <FilterSection icon={Crown} title="Premium">
//           <div className="grid grid-cols-2 gap-1.5">
//             <OptionButton
//               label="👑 Premium"
//               active={filters.premium === "true"}
//               onClick={() => handleChange("premium", "true")}
//             />
//             <OptionButton
//               label="🆓 Free"
//               active={filters.premium === "false"}
//               onClick={() => handleChange("premium", "false")}
//             />
//           </div>
//         </FilterSection>
//       </div>

//       {/* Footer summary */}
//       <div className="bg-slate-900/95 border-t border-white/[0.04] px-4 py-3">
//         <p className="text-[11px] text-slate-500 text-center font-medium">
//           {activeCount > 0
//             ? `Showing filtered results`
//             : "No filters applied"}
//         </p>
//       </div>
//     </aside>
//   );
// }

// export { INITIAL_FILTERS };
