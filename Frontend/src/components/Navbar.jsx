import { BellIcon, LogOutIcon, MenuIcon, ShipWheelIcon, XIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-base-200/80 backdrop-blur-xl border-b border-base-300 sticky top-0 z-50 h-16 flex items-center shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between w-full">

            {/* LOGO */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center gap-2.5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "linear",
                  }}
                >
                  <ShipWheelIcon className="size-8 text-primary" />
                </motion.div>

                <span
                  className={`text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent
                  bg-gradient-to-r from-primary to-secondary tracking-wider
                  ${!isChatPage ? "block" : "hidden sm:block"}`}
                >
                  Connectify
                </span>
              </Link>
            </motion.div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-3 ml-auto">

              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/notifications">
                  <button className="btn btn-ghost btn-circle relative">
                    <BellIcon className="h-6 w-6 text-base-content opacity-70" />

                    {/* Notification Dot */}
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error animate-ping"></span>
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span>
                  </button>
                </Link>
              </motion.div>

              <ThemeSelector />

              {/* USER AVATAR */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="avatar"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                    rel="noreferrer"
                  />
                </div>
              </motion.div>

              {/* LOGOUT */}
              <motion.button
                whileHover={{
                  scale: 1.08,
                  rotate: 10,
                }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-ghost btn-circle"
                onClick={logoutMutation}
              >
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
              </motion.button>
            </div>

            {/* MOBILE MENU BUTTON */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden btn btn-ghost btn-circle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="size-6" />
              ) : (
                <MenuIcon className="size-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-16 left-0 w-full bg-base-200/95 backdrop-blur-xl border-b border-base-300 z-40 shadow-xl"
          >
            <div className="flex flex-col items-center py-6 gap-5">

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="avatar"
              >
                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                  />
                </div>
              </motion.div>

              <h2 className="font-bold text-lg">
                {authUser?.fullName}
              </h2>

              <div className="flex items-center gap-4">
                <Link to="/notifications">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-primary btn-circle"
                  >
                    <BellIcon className="size-5" />
                  </motion.button>
                </Link>

                <ThemeSelector />

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="btn btn-error btn-circle"
                  onClick={logoutMutation}
                >
                  <LogOutIcon className="size-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;