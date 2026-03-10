import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import instance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const formatText = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const GoogleAuth = () => {
  const navigate = useNavigate();
  const { setLoading, setUser } = useContext(AuthContext);

  const handleLogin = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    try {
      const { data } = await instance.post("/auth/google-auth", {
        token: googleToken,
      });
     console.log(data)
      setUser(data.message);
      setLoading(false);
      toast.success(
        `${formatText(data.message?.FullName?.toUpperCase() ?? "User")} Welcome back!`
      );

      navigate("/");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Google Login failed. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
};

export default GoogleAuth;