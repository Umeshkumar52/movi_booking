import { useEffect, useRef, useState } from "react";
import AddMovi from "../Components/AddMovi";
import UserMoviCard from "../Components/UserMoviCard";
import ModifyMoviModal from "../Components/ModifyMoviModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDebounce from "../utils/debounce";
import AdminMovieCard from '../Components/AdminMovieCard'
import instance from "../utils/axiosInstance";
export default function Admin() {
  const [movies, setMovies] = useState([]);
  const [editModal, setEditModal] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [page, setPage] = useState(1);
  const [addNewMoviToggle, setAddNewMoviToggle] = useState(false);
  const pageLimit = 30;
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDocuments, setTotalDocuments] = useState(0);
  const navigate = useNavigate();
  const isFirstRender=useRef(true)
  async function getMovies() {
    try {
      const response = await instance.get(
        `/movies/${page}/${pageLimit}`,
      );
      setMovies((prev) => [...prev, ...response.data.message.data]);
      const pages = Math.ceil(response.data.message.documents / pageLimit);
      setTotalDocuments(pages);
      setTotalDocuments(pages);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
    }
  }
  async function deleteMoviHandler(_id) {
    try {
      const res = await instance.delete(
        `/movies/delete?_id=${_id}`,
      );
      setMovies((prev) => prev.filter((item) => item._id !== _id));
      toast("Post Deleted");
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
      const res = await instance.get(
        `/movies/search?SearchKey=${searchQuery}`,
      );
      setMovies(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
    }
  }
  const debounceSearch = useDebounce(searchQuery, 500);
  useEffect(() => {
    if (!debounceSearch.trim()) {
      if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // ⛔ skip first mount
    }
      getMovies()
      return;
    }
    filterMovies();
    
  }, [debounceSearch]);

  useEffect(() => {
    getMovies();
  }, [page]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 px-12 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl bg-gradient-to-r from-red-600 to-indigo-600 bg-clip-text text-transparent font-bold">Admin dashboard</h3>
        </div>
        <div className="flex items-center gap-16">
          <input
            onChange={(event) => setSearchQuery(event.target.value)}
            type="search"
            className="bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 rounded-lg w-120 p-3 placeholder-slate-400"
            placeholder="Search movies..."
          />
          <button
            onClick={() => setAddNewMoviToggle((prev) => !prev)}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Add New
          </button>
          <button
            onClick={logout}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            logout
          </button>
        </div>
      </header>
      <main className="flex flex-wrap gap-6 my-10 justify-center items-center ">
        {movies.map((items) => (
          <AdminMovieCard
            key={items._id}
            movie={items}
          />
        ))}
      </main>

      {/* movies edit modal */}

      {editModal && (
        <ModifyMoviModal
          setMovies={setMovies}
          _id={editModal}
          editModalData={editModalData}
          setEditModal={setEditModal}
        />
      )}

      {/* New movi add modal */}

      {addNewMoviToggle && (
        <AddMovi setAddNewMoviToggle={setAddNewMoviToggle} setMovies={setMovies} toggle={setAddNewMoviToggle} />
      )}

      {/* paginatioon */}

      {totalDocuments > 1 && (
        <div className="flex justify-center items-center py-14 gap-4 ">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
            className="rounded-lg px-4 disabled:text-slate-600 disabled:bg-slate-900/50 border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 transition-colors flex justify-center items-center text-xl p-2"
          >
            Prev
          </button>
          {Array.from({ length: totalDocuments }, (_, index) => (
            <button
              onClick={() => setPage(index + 1)}
              key={index}
              className={`${
                page == index + 1 ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              } size-10 rounded-lg border flex justify-center items-center text-lg transition-colors`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={page == totalDocuments}
            onClick={() =>
              setPage((prev) => (prev < totalDocuments ? prev + 1 : prev))
            }
            className="rounded-lg px-4 disabled:text-slate-600 disabled:bg-slate-900/50 border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 transition-colors flex justify-center items-center text-xl p-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
