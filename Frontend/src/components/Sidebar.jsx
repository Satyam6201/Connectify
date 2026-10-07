import { FiBell, FiHome, FiUsers } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser,
  });

  const pendingCount = friendRequests?.incomingReqs?.length || 0;

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: FiHome,
    },
    {
      path: "/meta-ai",
      label: "Meta AI & Image Gen",
      icon: IoSparklesOutline,
      highlight: true,
    },
    {
      path: "/friends",
      label: "Friends",
      icon: FiUsers,
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: FiBell,
      badge: pendingCount > 0 ? pendingCount : null,
    },
  ];

  return (
    <>
      <aside className="w-60 bg-base-200/80 backdrop-blur-xl border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 overflow-hidden">
        <nav className="flex-1 p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`btn btn-ghost justify-start w-full gap-2.5 normal-case rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "btn-active shadow-sm"
                    : item.highlight
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-base-300"
                }`}
              >
                <Icon className="size-4 opacity-90" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="badge badge-error badge-sm text-white font-bold">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="badge badge-primary badge-xs font-semibold">AI</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-base-300 mt-auto">
          <div className="bg-base-100 rounded-xl p-2.5 shadow-sm flex items-center gap-2.5">
            <div className="avatar">
              <div className="w-10 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-1">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-xs truncate">{authUser?.fullName}</p>
              <p className="text-[11px] text-success flex items-center gap-1 mt-0.5">
                <span className="size-1.5 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50">
        <div className="mx-3 mb-3 bg-base-200/90 backdrop-blur-2xl border border-base-300 rounded-2xl shadow-xl">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center p-1.5"
                >
                  <div
                    className={`p-2 rounded-xl transition-all relative ${
                      isActive ? "bg-primary text-primary-content" : "bg-transparent"
                    }`}
                  >
                    <Icon className="size-4" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-error text-[8px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5">{item.label.replace(" & Image Gen", "")}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;