// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { useEffect, useState } from "react";
// import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from "../lib/api";
// import { Link } from "react-router";
// import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
// import FriendCard, { getLanguageFlag } from "../components/FriendCard.jsx";
// import NoFriendsFound from "../components/NoFriendsFound.jsx";
// import { capitialize } from "../lib/utils.js";

// const HomePage = () => {
//   const queryClient = useQueryClient();
//   const [ outgoingRequestsIds, setOutgoingRequestsIds ] = useState(new Set());

//   const { data: friends=[], isLoading: loadingFriends } = useQuery({
//     queryKey: ["friends"],
//     queryFn: getUserFriends,
//   })

//   const { data: recommendedUsers=[], isLoading: loadingUsers } = useQuery({
//     queryKey: ["users"],
//     queryFn: getRecommendedUsers,
//   })
  
//   const { data: outgoingFriendReqs } = useQuery({
//     queryKey: ["outgoingFriendReqs"],
//     queryFn: getOutgoingFriendReqs,
//   })

//   const { mutate: sendRequestMutation, isPending } = useMutation({
//     mutationFn: sendFriendRequest,
//     onSuccess: (data, userId) => {
//       setOutgoingRequestsIds((prev) => new Set([...prev, userId]));

//       queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
//     },
//   });

//   useEffect(() => {
//     const outgoingIds = new Set();
//       if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
//         outgoingFriendReqs.forEach((req) => {
//         outgoingIds.add(req.recipient._id);
//       });
//     }
//     setOutgoingRequestsIds(outgoingIds);
//   }, [outgoingFriendReqs]);

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="container mx-auto space-y-10">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between
//         gap-4">
//           <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
//           <Link to="/notifications" className="btn btn-outline btn-sm">
//             <UsersIcon className="mr-2 size-4" />
//             Friend Requests
//           </Link>
//         </div>

//         {loadingFriends ? (
//           <div className="flex justify-center py-12">
//             <span className="loading loading-spinner loading-lg" />
//           </div>
//         ) : friends.length === 0 ? (
//           <NoFriendsFound />
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {friends.map((friend) => (
//               <FriendCard key={friend._id} friend={friend} />
//             ))}
//           </div>
//         )}

//         <section>
//           <div className="mb-6 sm:mb-8">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
//                 <p className="opacity-70">
//                   Discover perfect language exchange partners based on your profile
//                 </p>
//               </div>
//             </div>
//           </div>

//           {loadingUsers ? (
//             <div className="flex justify-center py-12">
//               <span className="loading loading-spinner loading-lg" />
//             </div>
//           ) : recommendedUsers.length === 0 ? (
//             <div className="card bg-base-200 p-6 text-center">
//               <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
//               <p className="text-base-content opacity-70">
//                 Check back later for new language partners!
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {recommendedUsers.map((user) => {
//                 const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

//                 return (
//                   <div key={user._id} className="card bg-base-200 hover:shadow-lg transition-all duration-300">
//                     <div className="card-body p-5 space-y-4">
//                       <div className="flex items-center gap-3">
//                         <div className="avatar size-16 rounded-full">
//                           <img src={user.profilePic} alt={user.fullName} />
//                         </div>

//                         <div>
//                           <h3 className="font-semibold text-lg">{user.fullName}</h3>
//                           {user.location && (
//                             <div className="flex items-center text-xs opacity-70 mt-1">
//                               <MapPinIcon className="size-3 mr-1" />
//                               {user.location}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* LANGUAGES WITH FLAGS */}
//                       <div className="flex flex-wrap gap-1.5">

//                         <span className="badge badge-secondary">
//                           {getLanguageFlag(user.nativeLanguage)}
//                           Native: {capitialize(user.nativeLanguage)}
//                         </span>

//                         <span className="badge badge-outline">
//                           {getLanguageFlag(user.learningLanguage)}
//                           Learning: {capitialize(user.learningLanguage)}
//                         </span>

//                       </div>

//                       {user.bio && <p className="text-sm opacity-70">{user.bio}</p> }

//                       {/* Action Button */}
//                       <button
//                         className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
//                         onClick={() => sendRequestMutation(user._id)}
//                         disabled={hasRequestBeenSent || isPending}
//                       >
//                       {hasRequestBeenSent ? (
//                         <>
//                           <CheckCircleIcon className="size-4 mr-2" />
//                           Request Sent
//                         </>
//                         ) : (
//                         <>
//                         <UserPlusIcon className="size-4 mr-2" />
//                         Send Friend Request
//                         </>
//                       )}
//                       </button>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )} 
//         </section>
//       </div>
//     </div>
//   )
// }

// export default HomePage;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";

import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { motion } from "framer-motion";

import FriendCard, { getLanguageFlag } from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";
import { capitialize } from "../lib/utils.js";

const HomePage = () => {
  const queryClient = useQueryClient();

  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(
    new Set()
  );

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } =
    useQuery({
      queryKey: ["users"],
      queryFn: getRecommendedUsers,
    });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,

    onSuccess: (data, userId) => {
      setOutgoingRequestsIds(
        (prev) => new Set([...prev, userId])
      );

      queryClient.invalidateQueries({
        queryKey: ["outgoingFriendReqs"],
      });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();

    if (
      outgoingFriendReqs &&
      outgoingFriendReqs.length > 0
    ) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
    }

    setOutgoingRequestsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-hidden relative">

      {/* BACKGROUND BLUR EFFECTS */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="container mx-auto space-y-12 relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Your Friends
            </h2>

            <p className="opacity-70 mt-2 text-sm sm:text-base">
              Connect with language partners around the world.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              to="/notifications"
              className="btn btn-outline rounded-2xl"
            >
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
          </motion.div>
        </motion.div>

        {/* FRIENDS SECTION */}
        <section className="space-y-6">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-bold">
              Friends List
            </h3>
          </motion.div>

          {loadingFriends ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    repeatType: "reverse",
                  }}
                  className="bg-base-200 rounded-3xl p-5 shadow-lg space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-base-300"></div>

                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-base-300 rounded w-2/3"></div>
                      <div className="h-2 bg-base-300 rounded w-1/3"></div>
                    </div>
                  </div>

                  <div className="h-10 rounded-xl bg-base-300"></div>
                </motion.div>
              ))}
            </div>

          ) : friends.length === 0 ? (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <NoFriendsFound />
            </motion.div>

          ) : (

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {friends.map((friend, index) => (
                <motion.div
                  key={friend._id}
                  initial={{
                    opacity: 0,
                    y: 40,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                  }}
                >
                  <FriendCard friend={friend} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* RECOMMENDED USERS */}
        <section className="relative">

  <motion.div
    animate={{
      opacity: [0.2, 0.4, 0.2],
      scale: [1, 1.1, 1],
    }}
    transition={{
      repeat: Infinity,
      duration: 8,
    }}
    className="absolute -top-10 -left-10 w-72 h-72 bg-primary/10 blur-3xl rounded-full"
  />

  <motion.div
    animate={{
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.15, 1],
    }}
    transition={{
      repeat: Infinity,
      duration: 10,
    }}
    className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full"
  />

  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="mb-10 relative z-10"
  >
    <motion.h2
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        repeat: Infinity,
        duration: 8,
        ease: "linear",
      }}
      className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_200%] bg-clip-text text-transparent"
    >
      Meet New Learners
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="opacity-70 mt-3 text-sm sm:text-base"
    >
      Discover perfect language exchange partners
      based on your profile
    </motion.p>
  </motion.div>

  {loadingUsers ? (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.4, 1, 0.4],
            y: [0, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            delay: i * 0.1,
          }}
          className="bg-base-200/70 backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-base-300 space-y-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-base-300"></div>

            <div className="flex-1 space-y-3">
              <div className="h-3 bg-base-300 rounded w-2/3"></div>
              <div className="h-2 bg-base-300 rounded w-1/3"></div>
            </div>
          </div>

          <div className="h-10 bg-base-300 rounded-xl"></div>
        </motion.div>
      ))}
    </div>

  ) : recommendedUsers.length === 0 ? (

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring" }}
      className="card bg-base-200/80 backdrop-blur-xl border border-base-300 p-10 text-center rounded-3xl shadow-2xl"
    >
      <motion.h3
        animate={{ y: [0, -3, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="font-bold text-xl mb-2"
      >
        No recommendations available
      </motion.h3>

      <p className="text-base-content/70">
        Check back later for new language partners!
      </p>
    </motion.div>

  ) : (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">

      {recommendedUsers.map((user, index) => {
        const hasRequestBeenSent =
          outgoingRequestsIds.has(user._id);

        return (
          <motion.div
            key={user._id}
            initial={{
              opacity: 0,
              y: 80,
              scale: 0.85,
              rotateX: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
            }}
            transition={{
              delay: index * 0.08,
              duration: 0.6,
              type: "spring",
              stiffness: 120,
            }}
            whileHover={{
              y: -12,
              scale: 1.03,
              rotateY: 4,
            }}
            className="group relative"
          >

            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl"
            />

            <div className="relative card bg-base-200/75 backdrop-blur-2xl border border-base-300 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">

              <motion.div
                animate={{
                  backgroundPosition: [
                    "0% 50%",
                    "100% 50%",
                    "0% 50%",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "linear",
                }}
                className="h-28 bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_200%] relative"
              >

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: "linear",
                  }}
                  className="absolute top-4 right-4 w-12 h-12 border border-white/20 rounded-full"
                />
              </motion.div>

              <div className="card-body p-6 space-y-5 relative">

                <div className="flex items-start gap-4 -mt-16">

                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: 4,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="avatar"
                  >
                    <div className="size-24 rounded-full border-[5px] border-base-100 shadow-2xl">
                      <img
                        src={user.profilePic}
                        alt={user.fullName}
                      />
                    </div>
                  </motion.div>

                  <div className="pt-14">
                    <motion.h3
                      whileHover={{ scale: 1.03 }}
                      className="font-black text-xl"
                    >
                      {user.fullName}
                    </motion.h3>

                    {user.location && (
                      <motion.div
                        animate={{
                          x: [0, 2, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                        }}
                        className="flex items-center text-xs opacity-70 mt-1"
                      >
                        <MapPinIcon className="size-3 mr-1" />
                        {user.location}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">

                  <motion.span
                    whileHover={{
                      scale: 1.08,
                    }}
                    className="badge badge-secondary badge-lg shadow-lg"
                  >
                    {getLanguageFlag(user.nativeLanguage)}
                    Native:
                    {" "}
                    {capitialize(
                      user.nativeLanguage
                    )}
                  </motion.span>

                  <motion.span
                    whileHover={{
                      scale: 1.08,
                    }}
                    className="badge badge-outline badge-lg shadow-lg"
                  >
                    {getLanguageFlag(
                      user.learningLanguage
                    )}
                    Learning:
                    {" "}
                    {capitialize(
                      user.learningLanguage
                    )}
                  </motion.span>
                </div>

                {user.bio && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm opacity-70 leading-relaxed"
                  >
                    {user.bio}
                  </motion.p>
                )}

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow:
                      "0px 0px 25px rgba(99,102,241,0.4)",
                  }}
                  className={`btn w-full rounded-2xl mt-2 transition-all duration-300 ${
                    hasRequestBeenSent
                      ? "btn-disabled"
                      : "btn-primary"
                  }`}
                  onClick={() =>
                    sendRequestMutation(user._id)
                  }
                  disabled={
                    hasRequestBeenSent || isPending
                  }
                >
                  {hasRequestBeenSent ? (
                    <>
                      <CheckCircleIcon className="size-4 mr-2" />
                      Request Sent
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="size-4 mr-2" />
                      Send Friend Request
                    </>
                  )}
                </motion.button>

              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  )}
</section>
      </div>
    </div>
  );
};

export default HomePage;