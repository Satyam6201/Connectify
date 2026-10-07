import { useState } from "react";
import { FiGlobe } from "react-icons/fi";
import { Link } from "react-router";
import useSignup from "../hooks/useSignup";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-base-100"
      data-theme="forest"
    >
      <div className="border border-primary/20 flex flex-col lg:flex-row w-full max-w-5xl bg-base-100/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-2.5">
            <FiGlobe className="size-8 text-primary" />
            <span className="text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Connectify
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4 rounded-xl py-2 px-3 text-xs">
              <span>{error.response?.data?.message || "Registration failed"}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-xs sm:text-sm opacity-70 mt-1">
                Join Connectify to start practicing languages with learners worldwide.
              </p>
            </div>

            <div className="form-control space-y-1">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered h-11 w-full rounded-xl text-sm"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    fullName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-control space-y-1">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="input input-bordered h-11 w-full rounded-xl text-sm"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-control space-y-1">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Password</span>
              </label>
              <input
                type="password"
                placeholder="******"
                className="input input-bordered h-11 w-full rounded-xl text-sm"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    password: e.target.value,
                  })
                }
                required
              />
              <p className="text-[11px] opacity-60">At least 6 characters</p>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2.5 py-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-xs rounded"
                  required
                />
                <span className="text-xs">
                  I agree to the terms of service and privacy policy
                </span>
              </label>
            </div>

            <button
              className="btn btn-primary w-full h-11 rounded-xl text-sm font-semibold mt-1"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs sm:text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 bg-base-200/50 items-center justify-center p-8 border-l border-base-300">
          <div className="max-w-sm text-center space-y-4">
            <div className="size-48 mx-auto aspect-square">
              <img
                src="/i.png"
                alt="Connectify"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-bold">Language Exchange Platform</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Connect with partners, start conversations, and improve your speaking skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;