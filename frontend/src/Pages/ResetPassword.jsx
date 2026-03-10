import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../utils/axiosInstance";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  }

  async function submitHandler(event) {
    event.preventDefault();

    if (!passwords.password || !passwords.confirmPassword) {
      return toast.error("Please fill in all fields");
    }

    if (passwords.password !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (passwords.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setIsSubmitting(true);
    try {
      await instance.post(`/auth/reset-password/${token}`, {
        Password: passwords.password,
      });

      toast.success("Password reset successfully! You can now log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid or expired reset link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-10 flex flex-col items-center relative z-10 transition-all">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="size-16 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/20">
            <ShieldCheck className="text-white size-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">New Password</h2>
          <p className="text-slate-500 text-sm">Create a strong new password for your account</p>
        </div>

        <form onSubmit={submitHandler} className="w-full space-y-6">
          <div className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 transition-colors group-focus-within:text-emerald-400">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  onChange={changeHandler}
                  value={passwords.password}
                  disabled={isSubmitting}
                  className="w-full bg-slate-800/30 border border-slate-700/50 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-2xl pl-12 pr-4 py-4 transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 transition-colors group-focus-within:text-emerald-400">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={changeHandler}
                  value={passwords.confirmPassword}
                  disabled={isSubmitting}
                  className="w-full bg-slate-800/30 border border-slate-700/50 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-2xl pl-12 pr-4 py-4 transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-br from-emerald-600 to-indigo-700 hover:from-emerald-500 hover:to-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin size-5" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
