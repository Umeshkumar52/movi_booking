import { useContext, useEffect, useRef, useState } from "react";
import AddMovi from "../Components/AddMovi";
import ModifyMoviModal from "../Components/ModifyMoviModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDebounce from "../utils/debounce";
import AdminMovieCard from '../Components/AdminMovieCard'
import SeriesCard from "../Components/series/SeriesCard";
import instance from "../utils/axiosInstance";
import { Search, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";
import HoverFilter, { INITIAL_FILTERS } from "../Components/filter/HoverFilter";
import Carausel from "../Components/carausel/Carausel";

const dummyCarouselItems = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop',
    badge: 'NEW RELEASE',
    title: 'The Great Exploration',
    description: 'Discover the unseen world through our latest cinematic masterpiece. Now available in IMAX.',
    buttonText: 'Book Tickets Now',
  },
  {
    type: 'video',
    src: 'https://res.cloudinary.com/dupnunjun/video/upload/v1771325920/movies/trailers/media/lxez5w4ontr2ftd53dpn.mp4',
    badge: 'EXCLUSIVE',
    title: 'Interstellar Horizons',
    description: 'A journey beyond the stars. Experience the ultimate sci-fi adventure exclusively on our platform.',
    buttonText: 'Watch Trailer',
  },
   {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop',
    badge: 'SALE LIVE',
    title: 'Weekend Blockbuster Deals',
    description: 'Get up to 50% off on all premium seat bookings this weekend. Grab your popcorn!',
    buttonText: 'Claim Offer',
  },
  {
    type: 'video',
    src: 'http://localhost:5000/uploads/1771307712482_f752dd7b-cfb9-4cce-afbd-7e310cd533ab.mp4',
    badge: 'MUST WATCH',
    title: 'Echoes of the Wild',
    description: 'Immerse yourself in breathtaking landscapes and the raw beauty of nature like never before.',
    buttonText: 'Play Now',
  },
 
  {
    type: 'video',
    src: 'https://cdn.pixabay.com/video/2019/11/14/29165-373292415_large.mp4',
    badge: 'TRENDING',
    title: 'Cyber City Protocol',
    description: 'A futuristic thriller where hackers race against time to save the global network.',
    buttonText: 'Watch Trailer',
  },
  {
    type: 'video',
     src: 'https://res.cloudinary.com/dupnunjun/video/upload/v1771325920/movies/trailers/media/lxez5w4ontr2ftd53dpn.mp4',
    badge: 'UPCOMING',
    title: 'Neon Dreams',
    description: 'Dive deep into a world of abstract colors and surreal visuals in this upcoming psychological drama.',
    buttonText: 'Remind Me',
  }
];

export default function Home() {
const {user} = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const pageLimit =15;
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS });
  const navigate = useNavigate();
  const isFirstRender=useRef(true)
  async function getMovies() {
    try {
      const response = await instance.get(
        `/movies/${page}/${pageLimit}`,
      );
      // Fix: Replace movies instead of appending for proper pagination
      setMovies(response.data.message.data);
      const pages = Math.ceil(response.data.message.documents / pageLimit);
      setTotalDocuments(pages);
      
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
    }
  }


async function logout() {
     await instance.get('/auth/logout')
    navigate("/login");
  }

  async function filterMovies() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("SearchKey", searchQuery);
      Object?.entries(filters)?.forEach(([key, val]) => {
        if (val !== "" && val !== undefined) params.set(key, val);
      });
      const res = await instance.get(
        `/movies/search?${params.toString()}`,
      );
      setMovies(res.data.message);
      // Reset pagination when searching/filtering
      setTotalDocuments(0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
    }
  }
  const debounceSearch = useDebounce(searchQuery, 500);
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  useEffect(() => {
    // If filters are active, always use the search/filter API
    if (hasActiveFilters) {
      filterMovies();
      return;
    }

    if (!debounceSearch.trim()) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return; // ⛔ skip first mount
      }
      
      // If we're not on page 1, resetting to 1 will trigger the [page] effect
      // and fetch the fresh list. If we ARE on page 1, we still need to fetch.
      if (page !== 1) {
        setPage(1);
      } else {
        getMovies();
      }
      return;
    }
    filterMovies();
  }, [debounceSearch, filters]);

  useEffect(() => {
    getMovies();
  }, [page]);

  return (
    <div className="flex flex-col overflow-hidden min-h-screen bg-slate-950 text-slate-200">
      {/* Premium Sticky Header  h-[calc(100vh-73px)]*/}
      <header className="w-full fixed top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-600/10 rounded-xl">
          <h3
  onClick={() => navigate("/")}
  className="
    relative
    inline-block
    text-2xl lg:text-4xl
    font-extrabold
    tracking-widest
    uppercase
    cursor-pointer
    group
  "
>
  <span
    className="
      relative z-10
      bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600
      bg-clip-text text-transparent
      drop-shadow-[0_4px_20px_rgba(251,191,36,0.7)]
    "
  >
    🎬 FilmNest
  </span>

  {/* Shine Effect */}
  <span
    className="
      absolute top-0 left-0 w-full h-full
      bg-gradient-to-r from-transparent via-white/30 to-transparent
      translate-x-[-120%]
      group-hover:translate-x-[120%]
      transition-transform duration-1000
      skew-x-12
      pointer-events-none
    "
  />
</h3>


          </div>
        
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8 w-full md:w-auto">
          {/* Enhanced Search Bar */}
          <div className="relative w-full sm:w-80 lg:w-[600px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              onChange={(event) => setSearchQuery(event.target.value)}
              type="search"
              className="w-full bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-2xl pl-12 pr-4 py-3 placeholder-slate-500 transition-all shadow-inner"
              placeholder="Search cinematic universe..."
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
          
            <button
              onClick={logout}
              className="flex items-center justify-center p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all active:scale-90"
              title="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

    {/* <div className="h-[30rem] bg-red-400">

    </div> */}

      {/* Layout Content */}
      <div className="relative h-full flex flex-col pt-[73px]">
        {/* Top Hover Filters */}
        <HoverFilter filters={filters} onChange={setFilters} />

        {/* Main Content Grid */}
        <main className="hide-scrollbar flex-1 h-screen overflow-auto pt-[2rem] md:pt-[3rem]">
          {/* max-w-[1400px]  min-h-[70vh] */}
          {(!searchQuery && !hasActiveFilters) && (
            <div className="px-6 lg:px-10 mb-10 max-w-[1600px] mx-auto w-full">
              <Carausel items={dummyCarouselItems} />
            </div>
          )}

          <div className="mx-auto flex flex-wrap gap-8 lg:px-10 px-6 justify-center min-h-[50vh]">
            {movies.length > 0 ? (
              movies.map((item) => (
                item.Category === "series" ? (
                  <SeriesCard userType={user?.role||"user"} key={item._id} series={item} />
                ) : (
                  <AdminMovieCard userType={user?.role||"user"} key={item._id} movie={item} />
                )
              ))
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-4 w-full">
                <div className="size-20 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                  <Search size={40} className="opacity-20" />
                </div>
                <p className="text-xl font-medium tracking-wide text-center px-6">
                  No cinematic masterpieces found in this timeline
                </p>
              </div>
            )}
          </div>

          {/* navigation tabe */}
         {!searchQuery && (
        <footer className="mx-auto border-t border-white/5 mt-[4rem] bg-slate-900/50 backdrop-blur-md">
          <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12 py-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-slate-400 text-sm font-medium order-2 sm:order-1">
              Showing page <span className="text-indigo-400">{page}</span> of <span className="text-indigo-400">{totalDocuments}</span>
            </div>
            
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
                className="flex items-center justify-center size-10 rounded-xl border border-white/5 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                aria-label="Previous Page"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalDocuments }, (_, index) => {
                  const pNum = index + 1;
                  // Show current, first, last, and neighbors
                  if (
                    pNum === 1 || 
                    pNum === totalDocuments || 
                    (pNum >= page - 1 && pNum <= page + 1)
                  ) {
                    return (
                      <button
                        onClick={() => setPage(pNum)}
                        key={pNum}
                        className={`size-10 rounded-xl border transition-all font-bold flex items-center justify-center text-sm ${
                          page === pNum 
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-105" 
                            : "bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-indigo-400"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  }
                  // Show ellipsis
                  if (pNum === page - 2 || pNum === page + 2) {
                    return <span key={pNum} className="text-slate-600">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                disabled={page === totalDocuments}
                onClick={() =>
                  setPage((prev) => (prev < totalDocuments ? prev + 1 : prev))
                }
                className="flex items-center justify-center size-10 rounded-xl border border-white/5 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                aria-label="Next Page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </footer>
      )}
        </main>
      </div>

   
    </div>
  );
}
