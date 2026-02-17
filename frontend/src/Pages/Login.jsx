import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthProvider";
import { generateToken } from "../utils/firebase";

function Login() {

  const navigate = useNavigate();
  const [permission, setPermission] = useState(false);
  const { setLoading, setUser } = useContext(AuthContext);
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });

  function loginDataChangeHandler(event) {
    event.preventDefault();
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  async function loginHandler(event) {
    event.preventDefault();
    try {
      const { Email, Password } = loginData;
      if (!Email || !Password) {
        toast.error("All fields are required");
      }
      const { data } = await instance.post("/auth/login", loginData);
      if (permission) {
        generateToken();
      }
      setUser({
        _id: data.message?._id,
        role: data.message?.role,
      });
      setLoading(false)

      if (data.message?.role === "admin") {
        navigate("/");
      } else if (data.message?.role === "user") {
        navigate("/");
      }
      setLoginData({
        Email: "",
        Password: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
    }
  }

  // firebese messing generate token
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setPermission((prev) => !prev);
      }
    });
  }, []);


  return (
    <div className="w-screen h-screen bg-gray-300 flex items-center justify-center">
      <div className="w-full bg-white shadow-xl gap-6 rounded-lg px-10 pt-10 pb-16 lg:max-w-[30vw] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-medium">Login</h2>
        <form className="w-full space-y-4">
          <div className="flex flex-col gap-2 items-start">
            <label htmlFor="Email" className="text-base font-medium">
              Email{" "}
            </label>
            <input
              type="email"
              name="Email"
              onChange={loginDataChangeHandler}
              value={loginData.Email}
              className="w-full focus:outline-none border-2 text-base border-gray-300 rounded-lg p-2"
              placeholder="Enter Your E-mail"
            />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <label htmlFor="Password" className="text-base font-medium">
              Password{" "}
            </label>
            <input
              type="password"
              name="Password"
              onChange={loginDataChangeHandler}
              value={loginData.Password}
              className="w-full focus:outline-none border-2 text-base border-gray-300 rounded-lg p-2"
              placeholder="Password"
            />
          </div>
          <div>
            <p className=" font-medium">
              {" "}
              don't have an account
              <Link className="text-indigo-500 italic" to="/signup">
                Sign Up
              </Link>
            </p>
          </div>
          <button
            onClick={loginHandler}
            className="bg-indigo-600 flex justify-self-end rounded-lg mt-8 px-8 py-2 text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
