import { FiBell, FiEdit3, FiGlobe, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import ThemeSelector from "./ThemeSelector";
import EditProfileModal from "./EditProfileModal";
import useLogout from "../hooks/useLogout";
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
      <nav className="bg-base-200/80 backdrop-blur-xl border-b border-base-300 sticky top-0 z-50 h-16 flex items-center shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2.5">
              <FiGlobe className="size-7 text-primary" />
              <span
                className={`text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider ${
                  !isChatPage ? "block" : "hidden sm:block"
                }`}
              >
                Connectify
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2.5 ml-auto">
              <Link to="/notifications">
                <button className="btn btn-ghost btn-circle relative" title="Notifications">
                  <FiBell className="size-5 text-base-content opacity-75" />
                  {pendingCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </Link>

              <ThemeSelector />

              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="btn btn-ghost btn-circle avatar"
                title="Edit Profile"
              >
                <div className="w-9 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-1">
                  <img src={authUser?.profilePic} alt="User Avatar" />
                </div>
              </button>

              <button
                className="btn btn-ghost btn-circle text-error/80 hover:text-error"
                onClick={logoutMutation}
                title="Logout"
              >
                <FiLogOut className="size-5" />
              </button>
            </div>

            <button
              className="md:hidden btn btn-ghost btn-circle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className="size-5" />
              ) : (
                <div className="relative">
                  <FiMenu className="size-5" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-error" />
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-base-200/95 backdrop-blur-xl border-b border-base-300 z-40 shadow-xl transition-all">
          <div className="flex flex-col items-center py-5 gap-3">
            <div
              className="avatar cursor-pointer"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsEditProfileOpen(true);
              }}
            >
              <div className="w-16 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                <img src={authUser?.profilePic} alt="Avatar" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="font-bold text-base">{authUser?.fullName}</h2>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsEditProfileOpen(true);
                }}
                className="btn btn-xs btn-outline btn-primary mt-2 rounded-lg gap-1"
              >
                <FiEdit3 className="size-3" />
                Edit Profile
              </button>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <Link to="/notifications" onClick={() => setMobileMenuOpen(false)}>
                <button className="btn btn-primary btn-sm btn-circle relative">
                  <FiBell className="size-4" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </Link>

              <ThemeSelector />

              <button className="btn btn-error btn-sm btn-circle" onClick={logoutMutation}>
                <FiLogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        authUser={authUser}
      />
    </>
  );
};

export default Navbar;