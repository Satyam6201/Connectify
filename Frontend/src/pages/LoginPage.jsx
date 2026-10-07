import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiGlobe, FiUserCheck, FiZap } from "react-icons/fi";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useLogin from "../hooks/useLogin";
import { demoLogin } from "../lib/api";
import toast from "react-hot-toast";

const LoginPage = () => {
  const queryClient = useQueryClient();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const { mutate: handleDemoLogin, isPending: isDemoPending } = useMutation({
    mutationFn: demoLogin,
    onSuccess: (data) => {
      toast.success(`Logged in as ${data.user?.fullName}`);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Demo login failed");
    },
  });

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

          {/* Quick Recruiter Demo Box */}
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                <FiZap className="size-3.5" />
                Recruiter & Quick Demo Mode
              </span>
              <span className="badge badge-primary badge-xs font-semibold">1-Click</span>
            </div>

            <p className="text-[11px] opacity-75 leading-tight">
              Test real-time chat, AI translation & video calls side-by-side across two tabs:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin("user1")}
                disabled={isDemoPending || isPending}
                className="btn btn-outline btn-primary btn-xs h-10 rounded-xl flex flex-col items-start justify-center p-2 text-left"
              >
                <span className="font-bold text-[11px] leading-tight">User 1: Alex</span>
                <span className="text-[9px] opacity-70 font-normal">Native: EN | Learn: ES</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("user2")}
                disabled={isDemoPending || isPending}
                className="btn btn-outline btn-secondary btn-xs h-10 rounded-xl flex flex-col items-start justify-center p-2 text-left"
              >
                <span className="font-bold text-[11px] leading-tight">User 2: Elena</span>
                <span className="text-[9px] opacity-70 font-normal">Native: ES | Learn: EN</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-4 rounded-xl py-2 px-3 text-xs">
              <span>{error.response?.data?.message || "Login failed"}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="form-control w-full space-y-1">
              <label className="label py-0.5">
                <span className="label-text font-medium text-xs">Email</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={loginData.email}
                className="input input-bordered w-full h-10 rounded-xl text-xs"
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
                className="input input-bordered w-full h-10 rounded-xl text-xs"
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
              className="btn btn-primary w-full h-10 rounded-xl text-xs font-semibold mt-1"
              disabled={isPending || isDemoPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing in...
                </>
              ) : (
                "Sign In with Credentials"
              )}
            </button>

            <div className="text-center pt-1">
              <p className="text-xs">
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
              Connect with native speakers, practice with Gemini AI, and start instant HD video calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;