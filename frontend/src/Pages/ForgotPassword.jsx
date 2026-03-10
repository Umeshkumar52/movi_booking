import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../utils/axiosInstance";
import { Loader2, Mail, KeyRound, ArrowLeft } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function submitHandler(event) {
    event.preventDefault();
    if (!email) {
      return toast.error("Please enter your email address");
    }

    setIsSubmitting(true);
    try {
      await instance.post("/auth/forgot-password", { Email: email });
      setIsSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-10 flex flex-col items-center relative z-10 transition-all">
        {/* Header */}
        <div className="mb-10 text-center w-full relative">
          <Link to="/login" className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="size-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
            <KeyRound className="text-white size-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">Reset Password</h2>
          <p className="text-slate-500 text-sm">
            {isSent ? "Check your email for the reset link" : "Enter your email to receive a reset link"}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={submitHandler} className="w-full space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 transition-colors group-focus-within:text-indigo-400">
                  Identity (Email)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    disabled={isSubmitting}
                    className="w-full bg-slate-800/30 border border-slate-700/50 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl pl-12 pr-4 py-4 transition-all placeholder:text-slate-700"
                    placeholder="name@example.com"
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
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-center text-sm">
              We've sent a password reset link to <br/>
              <span className="font-bold text-white">{email}</span>
            </div>
            <button
              onClick={() => setIsSent(false)}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-colors underline underline-offset-4"
            >
              Didn't receive it? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
