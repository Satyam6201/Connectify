import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 120,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      className="group relative overflow-hidden rounded-3xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl" />

      <div className="relative card bg-base-200/90 backdrop-blur-xl border border-base-300 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl">
        
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear",
          }}
          className="h-24 bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_200%]"
        />

        <div className="card-body p-5 -mt-10">

          <div className="flex flex-col items-center text-center">
            
            <motion.div
              whileHover={{ rotate: 6, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="avatar"
            >
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl">
                <img src={friend.profilePic} alt={friend.fullName} />
              </div>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-bold text-xl mt-4 truncate max-w-full"
            >
              {friend.fullName}
            </motion.h3>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mt-5"
          >

            <span className="badge badge-secondary text-xs sm:text-sm px-3 py-3 font-medium shadow-md">
              {getLanguageFlag(friend.nativeLanguage)}
              Native: {friend.nativeLanguage}
            </span>

            <span className="badge badge-outline text-xs sm:text-sm px-3 py-3 font-medium shadow-md">
              {getLanguageFlag(friend.learningLanguage)}
              Learning: {friend.learningLanguage}
            </span>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6"
          >
            <Link
              to={`/chat/${friend._id}`}
              className="btn btn-primary w-full rounded-2xl text-sm sm:text-base shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              <MessageCircle className="size-4" />
              Message
            </Link>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <motion.img
        whileHover={{ scale: 1.2 }}
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block rounded-sm"
      />
    );
  }

  return null;
}