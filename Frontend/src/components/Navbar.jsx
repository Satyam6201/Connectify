import { BellIcon, LogOutIcon, MenuIcon, ShipWheelIcon, UserPenIcon, XIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import ThemeSelector from "./ThemeSelector";
import EditProfileModal from "./EditProfileModal";
import useLogout from "../hooks/useLogout";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser,
  });

  const pendingCount = friendRequests?.incomingReqs?.length || 0;

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

              {/* NOTIFICATIONS */}
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/notifications">
                  <button className="btn btn-ghost btn-circle relative" title="Notifications">
                    <BellIcon className="h-6 w-6 text-base-content opacity-70" />

                    {pendingCount > 0 && (
                      <>
                        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white shadow-lg animate-pulse">
                          {pendingCount}
                        </span>
                      </>
                    )}
                  </button>
                </Link>
              </motion.div>

              <ThemeSelector />

              {/* EDIT PROFILE / AVATAR */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditProfileOpen(true)}
                className="btn btn-ghost btn-circle relative avatar"
                title="Edit Profile"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                    rel="noreferrer"
                  />
                </div>
              </motion.button>

              {/* LOGOUT */}
              <motion.button
                whileHover={{
                  scale: 1.08,
                  rotate: 10,
                }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-ghost btn-circle"
                onClick={logoutMutation}
                title="Logout"
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
                <div className="relative">
                  <MenuIcon className="size-6" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-error" />
                  )}
                </div>
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
            <div className="flex flex-col items-center py-6 gap-4">

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="avatar cursor-pointer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsEditProfileOpen(true);
                }}
              >
                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                  />
                </div>
              </motion.div>

              <div className="text-center">
                <h2 className="font-bold text-lg">
                  {authUser?.fullName}
                </h2>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsEditProfileOpen(true);
                  }}
                  className="btn btn-xs btn-outline btn-primary mt-2 rounded-xl"
                >
                  <UserPenIcon className="size-3 mr-1" />
                  Edit Profile
                </button>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <Link to="/notifications" onClick={() => setMobileMenuOpen(false)}>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-primary btn-circle relative"
                  >
                    <BellIcon className="size-5" />
                    {pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                        {pendingCount}
                      </span>
                    )}
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

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        authUser={authUser}
      />
    </>
  );
};

export default Navbar;