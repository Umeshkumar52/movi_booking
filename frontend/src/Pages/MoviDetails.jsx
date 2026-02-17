import { useEffect, useState } from "react";
import MovieTabs from "../Components/MoviTabs"
import Overview from "../components/tabs/Overview";
import Media from "../components/tabs/Media";
import Trailers from "../components/tabs/Trailers";
import Cast from "../components/tabs/Cast";
import Crew from "../components/tabs/Crew";
import MovieHero from '../Components/MovieHero'
import { useParams } from "react-router-dom";
import instance from "../utils/axiosInstance";
import { toast } from "react-toastify";
export default function MovieDetails() {
  const [activeTab, setActiveTab] = useState("overview");
  const[movieData,setMovieData]=useState(null)
   const{_id}=useParams()
  
  async function getMovi(){
  try {
    const {data}=await instance.get( `/movies/details?_id=${_id}`)
   setMovieData(data.message)
  } catch (error) {
    toast.error(error.response.data.message)
  }
   }
     useEffect(()=>{
     getMovi()
     },[])
  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview setMovieData={setMovieData} data={movieData}/>;
      case "media":
        return <Media setMovieData={setMovieData} data={{media:movieData?.media,poster:movieData?.poster}}/>;
      case "trailers":
        return <Trailers setMovieData={setMovieData} data={movieData.trailer}/>;
      case "cast":
        return <Cast movie_id={movieData?._id}/>;
      case "crew":
        return <Crew  movie_id={movieData?._id}/>;
      default:
        return <Overview  data={movieData}/>;
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 pb-20">
     <MovieHero setMovieData={setMovieData} movie={movieData}/>
      <MovieTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-4/5 mx-auto mt-8 bg-slate-900/50 rounded-xl shadow-sm border border-slate-800 min-h-[400px] p-6 text-slate-200">
        {renderTab()}
      </div>
    </div>
  );
}
