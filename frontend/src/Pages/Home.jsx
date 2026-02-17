import { useEffect, useState } from "react";
import AddMovi from "../Components/AddMovi";
import instance from "../utils/axiosInstance";
import UserMoviCard from "../Components/UserMoviCard";
import useDebounce from "../utils/debounce";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Home() {
  const [movies, setMovies] = useState([{_id:"12",name:"ram"}]);
  const [page, setPage] = useState(1);
  const [addNewMoviToggle, setAddNewMoviToggle] = useState(false);
  const pageLimit = 15;
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDocuments, setTotalDocuments] = useState(0);
  const navigate = useNavigate();

  // fetch movies handler
  async function getMovies() {
    try {
      const response = await instance.get(
        `/movies/${page}/${pageLimit}`,
      );
     
      setMovies(response.data.message.data);
      const pages=Math.ceil(((response.data.message.documents)/pageLimit))
      setTotalDocuments(pages);
     
    } catch (error) {
       toast.error(error?.response?.data?.message||"Something went wrong !")
    }
  }

  // Logout handler
 async function logout() {
    localStorage.removeItem("user");
    await instance.get('/auth/logout')
    navigate("/login");
  }

  // Search movies handler

  async function filterMovies() {
    try {
      const res = await instance.get(
        `/movies/search?SearchKey=${searchQuery}`,
      );
      setMovies(res.data.message);
    } catch (error) {
     toast.error(error?.response?.data?.message||"Something went wrong !")
    }
  }
  
  // debouncing
  const debounceSearch= useDebounce(searchQuery,500)
  

  useEffect(() => {
   if(!debounceSearch.trim()){
      getMovies();
      return
   }
     filterMovies();
  }, [debounceSearch]);

  // fetch data onn mount
  useEffect(() => {
    getMovies();
  }, [page]);



  return (
    <div className="flex h-screen overflow-y-auto bg-gray-100 flex-col">
      <header className="bg-gray-300/80 px-12 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img className="size-12 rounded-full border-2" src="#" alt="logo" />
          <h3 className="text-lg font-medium">Movies</h3>
        </div>
        <div className="flex items-center gap-16">
          <input
            onChange={(event) =>setSearchQuery(event.target.value)}
            type="search"
            className="border-2 focus:outline-none rounded-lg w-[30rem] p-3"
            placeholder="Search movies..."
          />

         

          <button
            onClick={logout}
            className="px-8 py-3 bg-red-600 text-white rounded-lg"
          >
            logout
          </button>
        </div>
      </header>

      <main className="flex flex-wrap gap-6 my-10 justify-center items-center ">
        {movies.map((items) => (
          <UserMoviCard key={items._id} movie={items} />
        ))}
      </main>

      {/* New movi add modal */}

      {addNewMoviToggle && (
        <AddMovi setMovies={setMovies} toggle={setAddNewMoviToggle} />
      )}

      {/* paginatioon */}

    {
      totalDocuments>1&&  <div className="flex justify-center items-center py-14 gap-4 ">
         <button disabled={page===1}
          onClick={()=>setPage(prev=>prev>1?prev-1:prev)} className=" rounded-lg px-4 disabled:text-slate-300 disabled:bg-slate-100 border-2 border-slate-200 bg-slate-300 flex justify-center items-center text-2xl  p-2">
           Prev
          </button>
        {Array.from({ length:totalDocuments }, (_, index) => (
          <button onClick={()=>setPage(index+1)} key={index} className={`${page==index+1&&"bg-slate-400"} size-8 rounded-lg border-2 border-slate-200 bg-slate-300 flex justify-center items-center text-2xl  p-2`}>
            {index+1}
          </button>
        ))}
         <button disabled={page==totalDocuments} onClick={()=>setPage(prev=>prev<totalDocuments?prev+1:prev)}
          className=" rounded-lg border-2 disabled:bg-slate-100 disabled:text-slate-300 px-4 border-slate-200 bg-slate-300 flex justify-center items-center text-2xl  p-2">
            Next
          </button>
      </div>
    }
    </div>
  );
}
