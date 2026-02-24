import "./App.css";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Admin from "./Pages/Admin";
import MoviDescription from "./Components/MoviDescription";
import MoviDetails from './Pages/MoviDetails'
import SeriesDetails from "./Pages/SeriesDetails";
import PrivateRoute from "./Authentication/PrivateRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { listenForegroundNotifications } from "./utils/notification";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthProvider";
import  UserMovieDetails  from "./pages/UserMovieDetails";
import  UserSeriesDetails  from "./pages/UserSeriesDetails";
import SeatBooking from "./Pages/SeatBooking";
import ScrollToTop from "./Components/ScrollTOp";
import AdminSeatStructure from './Pages/AdminSeatStructure'
function App() {
    const { user } = useContext(AuthContext);
useEffect(()=>{
 listenForegroundNotifications()
},[])
console.log(user)
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Routes>
        <Route
          path='/'
          element={
            <PrivateRoute roles={["admin", "user"]}>
             {user?.role=="admin"? <Admin/>:<Home />}
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />

         <Route path="/movie/details/:_id" element={<UserMovieDetails/>}>
          <Route path="booking" element={<SeatBooking/>} />
          </Route>
        <Route path="/series/details/:_id" element={<UserSeriesDetails />}>
         <Route path="booking" element={<SeatBooking/>} /></Route>
        <Route path="/admin/movie/details/:_id" element={<MoviDetails/>}>
        <Route path="show" element={<AdminSeatStructure/>} />
        </Route>
        <Route path="/admin/series/details/:_id" element={<SeriesDetails />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
