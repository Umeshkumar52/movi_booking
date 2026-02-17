import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const privateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading && !user)
    return (
      <div className="fixed top-0 bg-white flex justify-center items-center 0 h-screen w-screen ">
        <h1 className="text-3xl font-semibold">Loading</h1>
      </div>
    );

  return user ? (
    roles.includes(user?.role||"user") ? (
      children
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <Navigate to="/login" />
  );
};
export default privateRoute;
