import { motion } from "framer-motion";
import { Users, Sparkles, MessageCircleHeart } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[2rem] border border-base-300 bg-base-200/80 backdrop-blur-xl shadow-2xl"
    >
      <div className="absolute top-0 left-0 w-60 h-60 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-14 sm:px-10 sm:py-20">
        
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
          }}
          className="relative mb-8"
        >
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-2xl">
            <Users className="size-14 sm:size-16 text-white" />
          </div>

          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="text-warning size-8" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-4xl font-black mb-4"
        >
          No Friends Yet
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-xl text-sm sm:text-lg leading-relaxed text-base-content/70"
        >
          Start connecting with language partners around the world and build meaningful conversations together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <div className="badge badge-primary badge-lg px-5 py-4 gap-2">
            <MessageCircleHeart className="size-4" />
            Real-time Chat
          </div>

          <div className="badge badge-secondary badge-lg px-5 py-4">
            New Connections
          </div>

          <div className="badge badge-outline badge-lg px-5 py-4">
            Global Friends
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary mt-10 rounded-2xl px-8"
        >
          Discover People
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoFriendsFound;