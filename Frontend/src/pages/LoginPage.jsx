import { useState } from "react";
import { FiGlobe } from "react-icons/fi";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-base-100"
      data-theme="forest"
    >
      <div className="border border-primary/20 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-5 flex items-center gap-2.5">
            <FiGlobe className="size-8 text-primary" />
            <span className="text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Connectify
            </span>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-xs sm:text-sm opacity-70 mt-1">
              Sign in to continue your language learning journey.
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-4 rounded-xl py-2 px-3 text-xs">
              <span>{error.response?.data?.message || "Login failed"}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control w-full space-y-1">
              <label className="label py-0.5">
                <span className="label-text font-medium text-xs">Email</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={loginData.email}
                className="input input-bordered w-full h-11 rounded-xl text-sm"
                required
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-control w-full space-y-1">
              <label className="label py-0.5">
                <span className="label-text font-medium text-xs">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full h-11 rounded-xl text-sm"
                value={loginData.password}
                required
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full h-11 rounded-xl text-sm font-semibold mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs sm:text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 bg-base-200/50 items-center justify-center p-8 border-l border-base-300">
          <div className="max-w-sm text-center space-y-4">
            <div className="size-44 mx-auto aspect-square">
              <img
                src="/i.png"
                alt="Connectify"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-bold">Language Exchange & AI Assistant</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Connect with native speakers, create art with Meta AI, and start instant HD video calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;