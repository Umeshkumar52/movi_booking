import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import instance from '../utils/axiosInstance'
import { AuthContext } from '../context/AuthProvider'
import { generateToken } from '../utils/firebase'
import { Loader2, Mail, Lock, UserPlus, User } from "lucide-react";

function Register() {
  const navigate = useNavigate()
  const [permission, setPermission] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useContext(AuthContext)
  const [userData, setUserData] = useState({
    FullName: "",
    Email: "",
    Password: ""
  })

  function userDataChangeHandler(event) {
    const { name, value } = event.target
    setUserData({
      ...userData,
      [name]: value
    })
  }

    const formatText = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

  // register handler function
  async function registerHandler(event) {
    event.preventDefault()
    
    if (!userData.FullName || !userData.Email || !userData.Password) {
      return toast.error("Please fill in all fields");
    }

    setIsSubmitting(true);
    try {
      const { data } = await instance.post("/auth/signup", userData)
      
      if (permission) {
        generateToken();
      }
      
      setUser({
        _id: data.message?._id,
        role: data.message?.role,
      })

      localStorage.setItem("user", JSON.stringify({ _id: data.message._id, role: data.message.role }))
      toast.success(`${formatText(data.message?.FullName??"User")} Account created successfully!`);
      navigate("/")
      
      setUserData({
        FullName: "",
        Email: "",
        Password: ""
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setPermission(true);
      }
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-10 flex flex-col items-center relative z-10 transition-all">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="size-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
            <UserPlus className="text-white size-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">Join the Club</h2>
          <p className="text-slate-500 text-sm">Create your cinematic account</p>
        </div>

        <form onSubmit={registerHandler} className="w-full space-y-5">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 transition-colors group-focus-within:text-indigo-400">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="FullName"
                  onChange={userDataChangeHandler}
                  value={userData.FullName}
                  disabled={isSubmitting}
                  className="w-full bg-slate-800/30 border border-slate-700/50 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl pl-12 pr-4 py-4 transition-all placeholder:text-slate-700"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 transition-colors group-focus-within:text-indigo-400">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="Email"
                  onChange={userDataChangeHandler}
                  value={userData.Email}
                  disabled={isSubmitting}
                  className="w-full bg-slate-800/30 border border-slate-700/50 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl pl-12 pr-4 py-4 transition-all placeholder:text-slate-700"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 transition-colors group-focus-within:text-indigo-400">
                Secret Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="Password"
                  onChange={userDataChangeHandler}
                  value={userData.Password}
                  disabled={isSubmitting}
                  className="w-full bg-slate-800/30 border border-slate-700/50 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl pl-12 pr-4 py-4 transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin size-5" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register Now</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 w-full text-center">
          <p className="text-slate-500 text-sm">
            Already a member?{" "}
            <Link className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors ml-1 underline underline-offset-4" to="/login">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
