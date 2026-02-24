import { createContext, useEffect, useState } from "react";
import instance from "../utils/axiosInstance";
export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuth = async () => {
    try {
      const { data } = await instance.get("/auth/");
      console.log(data)
      setUser(data?.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    isAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading,setLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
