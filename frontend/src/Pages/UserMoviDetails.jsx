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
export default function userMovieDetails() {
  const [activeTab, setActiveTab] = useState("overview");
  const[movieData,setMovieData]=useState({})
   const{_id}=useParams()
   console.log(_id)
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
        return <Overview data={movieData}/>;
      case "media":
        return <Media data={{media:movieData?.media,poster:movieData?.poster}}/>;
      case "trailers":
        return <Trailers data={movieData.trailer}/>;
      case "cast":
        return <Cast movie_id={movieData?._id}/>;
      case "crew":
        return <Crew  movie_id={movieData?._id}/>;
      default:
        return <Overview  data={movieData}/>;
    }
  };
  console.log(movieData)

  return (
    <div className="movie-page">
     <MovieHero setMovieData={setMovieData} data={movieData}/>
      <MovieTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
}
