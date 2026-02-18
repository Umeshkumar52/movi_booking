import { useEffect, useRef, useState } from "react";
import AddMovi from "../Components/AddMovi";
import ModifyMoviModal from "../Components/ModifyMoviModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDebounce from "../utils/debounce";
import AdminMovieCard from '../Components/AdminMovieCard'
import SeriesCard from "../Components/series/SeriesCard";
import instance from "../utils/axiosInstance";
import { Search, Plus, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import AdminFilters, { INITIAL_FILTERS } from "../Components/AdminFilters";

export default function Admin() {
  const [movies, setMovies] = useState([]);
  const [editModal, setEditModal] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [page, setPage] = useState(1);
  const [addNewMoviToggle, setAddNewMoviToggle] = useState(false);
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
      Object.entries(filters).forEach(([key, val]) => {
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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-600/10 rounded-xl">
             <h3 className="text-2xl lg:text-3xl bg-gradient-to-r from-white via-indigo-400 to-purple-400 bg-clip-text text-transparent font-black tracking-tight cursor-pointer" onClick={() => navigate('/')}>
               Movi Admin
             </h3>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8 w-full md:w-auto">
          {/* Enhanced Search Bar */}
          <div className="relative w-full sm:w-80 lg:w-[400px] group">
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
              onClick={() => setAddNewMoviToggle((prev) => !prev)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
            >
              <Plus size={20} />
              Add Movie
            </button>
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

      {/* Sidebar + Content Layout */}
      <div className="relative h-full flex flex-1">
        {/* Left Sidebar Filters */}
        <AdminFilters filters={filters} onChange={setFilters} />

        {/* Main Content Grid */}
        <main className="flex-1 px-6 lg:px-10 py-8">
          {/* max-w-[1400px]  min-h-[70vh] */}
          <div className=" mx-auto flex flex-wrap gap-8 justify-center min-h-[100vh]">
            {movies.length > 0 ? (
              movies.map((item) => (
                item.Category === "series" ? (
                  <SeriesCard key={item._id} series={item} />
                ) : (
                  <AdminMovieCard key={item._id} movie={item} />
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
        </main>
      </div>

      {/* Modals */}
      {editModal && (
        <ModifyMoviModal
          setMovies={setMovies}
          _id={editModal}
          editModalData={editModalData}
          setEditModal={setEditModal}
        />
      )}

      {addNewMoviToggle && (
        <AddMovi setAddNewMoviToggle={setAddNewMoviToggle} setMovies={setMovies} toggle={setAddNewMoviToggle} />
      )}

      {/* Premium Pagination Bar */}
      {!searchQuery && (
        <footer className="mt-auto border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
          <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12 py-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-slate-400 text-sm pl-[10rem] font-medium order-2 sm:order-1">
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
    </div>
  );
}
