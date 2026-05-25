import {
  BellIcon,
  HomeIcon,
  ShipWheelIcon,
  UserIcon,
} from "lucide-react";

import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: HomeIcon,
    },
    {
      path: "/friends",
      label: "Friends",
      icon: UserIcon,
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: BellIcon,
    },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
        }}
        className="w-64 bg-base-200/80 backdrop-blur-xl border-r border-base-300 
        hidden lg:flex flex-col h-screen sticky top-0 overflow-hidden"
      >
        {/* Animated Background Glow */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

        {/* LOGO */}
        {/* <motion.div
          whileHover={{ scale: 1.03 }}
          className="relative z-10 p-5 border-b border-base-300"
        >
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: "linear",
              }}
            >
              <ShipWheelIcon className="size-8 text-primary" />
            </motion.div>

            <span
              className="text-3xl font-black font-mono bg-clip-text text-transparent
              bg-gradient-to-r from-primary to-secondary tracking-wider"
            >
              Connectify
            </span>
          </Link>
        </motion.div> */}

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-3 relative z-10">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`relative overflow-hidden btn btn-ghost justify-start 
                  w-full gap-3 normal-case rounded-2xl text-base transition-all duration-300
                  ${isActive ? "btn-active shadow-lg" : "hover:bg-base-300"}`}
                >
                  {/* Active Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-primary/10 rounded-2xl"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  )}

                  <motion.div whileHover={{ rotate: 8, scale: 1.1 }}>
                    <Icon className="size-5 text-base-content opacity-80 relative z-10" />
                  </motion.div>

                  <span className="relative z-10">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* USER PROFILE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 border-t border-base-300 mt-auto relative z-10"
        >
          <motion.div
            whileHover={{
              scale: 1.02,
              y: -2,
            }}
            className="bg-base-100 rounded-2xl p-3 shadow-md flex items-center gap-3"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="absolute inset-0 rounded-full bg-success/30"
              />

              <div className="avatar relative">
                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm truncate">
                {authUser?.fullName}
              </p>

              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <motion.span
                  animate={{
                    scale: [1, 1.4, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                  className="size-2 rounded-full bg-success inline-block"
                />
                Online
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.aside>

      {/* MOBILE BOTTOM NAVBAR */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-0 left-0 right-0 lg:hidden z-50"
      >
        <div
          className="mx-4 mb-4 bg-base-200/90 backdrop-blur-2xl 
          border border-base-300 rounded-3xl shadow-2xl"
        >
          <div className="flex items-center justify-around py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ y: -3 }}
                    className={`p-3 rounded-2xl transition-all duration-300
                    ${
                      isActive
                        ? "bg-primary text-primary-content shadow-lg"
                        : "bg-transparent"
                    }`}
                  >
                    <Icon className="size-5" />
                  </motion.div>

                  <span className="text-[10px] mt-1">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;