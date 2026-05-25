import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
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
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden relative bg-base-100"
      data-theme="forest"
    >
      {/* Animated Background */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
        className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
        className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
      />

      {/* MAIN CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.7,
          type: "spring",
        }}
        className="relative z-10 border border-primary/20 flex flex-col lg:flex-row w-full 
        max-w-6xl bg-base-100/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* LEFT SIDE */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-1/2 p-5 sm:p-8 lg:p-10 flex flex-col justify-center"
        >
          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="mb-6 flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: "linear",
              }}
            >
              <ShipWheelIcon className="size-10 text-primary" />
            </motion.div>

            <span
              className="text-3xl sm:text-4xl font-black font-mono bg-clip-text text-transparent
              bg-gradient-to-r from-primary to-secondary tracking-wider"
            >
              Connectify
            </span>
          </motion.div>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-error mb-5"
            >
              <span>{error.response?.data?.message}</span>
            </motion.div>
          )}

          {/* FORM */}
          <form onSubmit={handleSignup} className="space-y-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold">
                Create an Account
              </h2>

              <p className="text-sm sm:text-base opacity-70 mt-2">
                Join Connectify and start your language learning journey.
              </p>
            </motion.div>

            {/* FULL NAME */}
            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>

              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered h-12 w-full rounded-xl focus:outline-none focus:border-primary transition-all"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    fullName: e.target.value,
                  })
                }
                required
              />
            </motion.div>

            {/* EMAIL */}
            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>

              <input
                type="email"
                placeholder="john@gmail.com"
                className="input input-bordered h-12 w-full rounded-xl focus:outline-none focus:border-primary transition-all"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    email: e.target.value,
                  })
                }
                required
              />
            </motion.div>

            {/* PASSWORD */}
            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <input
                type="password"
                placeholder="******"
                className="input input-bordered h-12 w-full rounded-xl focus:outline-none focus:border-primary transition-all"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    password: e.target.value,
                  })
                }
                required
              />

              <p className="text-xs opacity-70 mt-2">
                Password must be at least 6 characters long
              </p>
            </motion.div>

            {/* CHECKBOX */}
            <motion.div
              whileHover={{ x: 3 }}
              className="form-control"
            >
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  required
                />

                <span className="text-xs sm:text-sm leading-relaxed">
                  I agree to the{" "}
                  <span className="text-primary hover:underline cursor-pointer">
                    terms of service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary hover:underline cursor-pointer">
                    privacy policy
                  </span>
                </span>
              </label>
            </motion.div>

            {/* BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 0px 20px rgba(0,255,150,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary w-full h-12 rounded-xl text-base"
              type="submit"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>

            {/* LOGIN */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center pt-2"
            >
              <p className="text-sm sm:text-base">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:flex w-full lg:w-1/2 bg-primary/5 items-center justify-center relative overflow-hidden"
        >
          {/* Floating Animation */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            className="max-w-md p-10"
          >
            {/* IMAGE */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative aspect-square max-w-sm mx-auto"
            >
              <img
                src="/i.png"
                alt="Connectify"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* TEXT */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-4 mt-8"
            >
              <h2 className="text-2xl font-bold leading-snug">
                Connect with language partners worldwide
              </h2>

              <p className="opacity-70 text-base leading-relaxed">
                Practice conversations, make friends, and improve your
                communication skills together in real time.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;