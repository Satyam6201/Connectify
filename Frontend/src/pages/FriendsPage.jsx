import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

const FriendsPage = () => {
  const navigate = useNavigate();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const handleMessage = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden">
      
      {/* Animated Background Blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-2">
                <Sparkles className="text-primary animate-spin-slow" />
                Your Friends
              </h1>

              <p className="text-base-content/70 mt-2">
                Connect, chat and start conversations instantly.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="badge badge-primary badge-lg p-4"
            >
              {friends.length} Friends
            </motion.div>
          </motion.div>

          {/* LOADING SKELETON */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    repeatType: "reverse",
                  }}
                  className="bg-base-200 rounded-3xl p-5 space-y-5 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-base-300" />

                    <div className="flex-1 space-y-3">
                      <div className="h-4 rounded bg-base-300 w-2/3"></div>
                      <div className="h-3 rounded bg-base-300 w-1/3"></div>
                    </div>
                  </div>

                  <div className="h-12 rounded-xl bg-base-300"></div>
                </motion.div>
              ))}
            </div>
          ) : friends.length === 0 ? (

            /* EMPTY STATE */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <motion.img
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                src="https://cdn-icons-png.flaticon.com/512/6598/6598519.png"
                alt="No Friends"
                className="w-40 mb-6 opacity-80"
              />

              <h2 className="text-2xl font-bold mb-2">
                No Friends Yet
              </h2>

              <p className="text-base-content/70 max-w-md">
                Start sending friend requests and build your community.
              </p>
            </motion.div>

          ) : (

            /* FRIENDS GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              {friends.map((friend, index) => (
                <motion.div
                  key={friend._id}
                  initial={{ opacity: 0, y: 80, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    type: "spring",
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -5,
                  }}
                  className="group relative bg-base-200/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-base-300 shadow-xl hover:shadow-2xl transition-all duration-500"
                >

                  {/* TOP GRADIENT */}
                  <div className="h-24 bg-gradient-to-r from-primary to-secondary relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 12,
                        ease: "linear",
                      }}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full border-2 border-white/30"
                    />
                  </div>

                  {/* PROFILE */}
                  <div className="px-6 pb-6 relative">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className="-mt-10 mb-4"
                    >
                      <img
                        src={friend.profilePic}
                        alt={friend.fullName}
                        className="w-20 h-20 rounded-full border-4 border-base-100 object-cover shadow-lg"
                      />
                    </motion.div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">
                        {friend.fullName}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-primary">
                          {friend.nativeLanguage}
                        </span>

                        <span className="badge badge-secondary">
                          Learning {friend.learningLanguage}
                        </span>
                      </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-6 flex gap-3">
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleMessage(friend._id)}
                        className="btn btn-primary flex-1 rounded-2xl"
                      >
                        <MessageCircle className="size-4" />
                        Message
                      </motion.button>

                    </div>
                  </div>

                  {/* HOVER GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;