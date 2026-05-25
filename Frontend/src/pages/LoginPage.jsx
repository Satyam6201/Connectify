import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
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
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden relative"
      data-theme="forest"
    >
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 border border-primary/20 flex flex-col lg:flex-row w-full max-w-6xl mx-auto 
        bg-base-100/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* LOGIN FORM SECTION */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center"
        >
          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="mb-8 flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <ShipWheelIcon className="size-10 text-primary" />
            </motion.div>

            <span
              className="text-3xl sm:text-4xl font-black font-mono bg-clip-text text-transparent bg-gradient-to-r
              from-primary to-secondary tracking-wider"
            >
              Connectify
            </span>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-error mb-5"
            >
              <span>{error.response.data.message}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold">
                Welcome Back
              </h2>

              <p className="text-sm sm:text-base opacity-70 mt-2">
                Sign in to continue your language journey with friends worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="form-control w-full space-y-2"
            >
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>

              <input
                type="email"
                placeholder="hello@example.com"
                value={loginData.email}
                className="input input-bordered w-full h-12 rounded-xl focus:outline-none focus:border-primary transition-all duration-300"
                required
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="form-control w-full space-y-2"
            >
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full h-12 rounded-xl focus:outline-none focus:border-primary transition-all duration-300"
                value={loginData.password}
                required
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
              />
            </motion.div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 0px 25px rgba(34,197,94,0.35)",
              }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="btn btn-primary w-full h-12 rounded-xl text-base font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center pt-2"
            >
              <p className="text-sm sm:text-base">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary font-semibold hover:underline"
                >
                  Create one
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 items-center justify-center relative overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />

          <div className="relative z-10 max-w-lg p-10">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              className="relative aspect-square max-w-md mx-auto"
            >
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* TEXT */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center space-y-4 mt-6"
            >
              <h2 className="text-2xl font-bold">
                Connect with people around the world
              </h2>

              <p className="opacity-70 leading-relaxed">
                Practice conversations, make new friends, and improve your
                language skills with real-time messaging and video calls.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;