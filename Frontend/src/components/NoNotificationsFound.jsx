import { BellIcon, Sparkles, WifiIcon } from "lucide-react";
import { motion } from "framer-motion";

function NoNotificationsFound() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-base-100 min-h-[70vh] flex items-center justify-center px-4 sm:px-6">

      <div className="absolute top-10 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
        }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="relative bg-base-200/70 backdrop-blur-xl border border-base-300 shadow-2xl rounded-[2rem] p-8 sm:p-12 text-center overflow-hidden">

          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="relative mx-auto mb-8"
          >
            <div className="size-28 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-2xl mx-auto relative">

              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="absolute inset-0 rounded-full border border-primary/40"
              />

              <motion.div
                animate={{ scale: [1, 1.7, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                }}
                className="absolute inset-0 rounded-full border border-secondary/30"
              />

              <BellIcon className="size-14 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-4xl font-black mb-4">
              No Notifications Yet
            </h2>

            <p className="text-sm sm:text-base opacity-70 leading-relaxed max-w-md mx-auto">
              Friend requests, messages, and activity updates will appear here
              once people start interacting with you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 mt-8 flex-wrap"
          >
            <div className="badge badge-primary badge-lg gap-2 p-4">
              <Sparkles className="size-4" />
              Real-time Updates
            </div>

            <div className="badge badge-secondary badge-lg gap-2 p-4">
              <WifiIcon className="size-4" />
              Instant Alerts
            </div>
          </motion.div>

          <motion.div
            animate={{
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
          />

          <motion.div
            animate={{
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-2xl"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default NoNotificationsFound;