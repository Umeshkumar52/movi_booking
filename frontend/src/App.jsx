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
function App() {
    const { user, loading } = useContext(AuthContext);
useEffect(()=>{
 listenForegroundNotifications()
},[])
  return (
    <BrowserRouter>
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
        {/* <Route
          path="/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <Admin />
            </PrivateRoute>
          }
        /> */}
        <Route path="/movie/details/:_id" element={<MoviDetails/>} />
        <Route path="/series/details/:_id" element={<SeriesDetails />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
