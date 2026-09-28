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
  FilterIcon,
  MapPinIcon,
  SearchIcon,
  Sparkles,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import FriendCard, { getLanguageFlag } from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";
import { capitialize } from "../lib/utils.js";
import { LANGUAGES } from "../constants";
import useAuthUser from "../hooks/useAuthUser.js";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [nativeFilter, setNativeFilter] = useState("");
  const [learningFilter, setLearningFilter] = useState("");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users", searchQuery, nativeFilter, learningFilter],
    queryFn: () =>
      getRecommendedUsers({
        search: searchQuery,
        nativeLanguage: nativeFilter,
        learningLanguage: learningFilter,
      }),
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data, userId) => {
      setOutgoingRequestsIds((prev) => new Set([...prev, userId]));
      queryClient.invalidateQueries({
        queryKey: ["outgoingFriendReqs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req.recipient?._id) outgoingIds.add(req.recipient._id);
      });
    }
    setOutgoingRequestsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  const hasActiveFilters = searchQuery || nativeFilter || learningFilter;

  const handleClearFilters = () => {
    setSearchQuery("");
    setNativeFilter("");
    setLearningFilter("");
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 overflow-hidden relative bg-base-100">
      {/* Background glow animations */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="container mx-auto space-y-12 relative z-10 max-w-7xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-base-300 pb-6"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
              <span>Your Friends</span>
              <span className="badge badge-primary text-sm font-semibold">{friends.length}</span>
            </h2>
            <p className="opacity-70 mt-1 text-sm sm:text-base">
              Connect and chat with language exchange partners around the globe.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/notifications" className="btn btn-outline rounded-2xl gap-2 shadow-sm">
              <UsersIcon className="size-4 text-primary" />
              Friend Requests
            </Link>
          </motion.div>
        </motion.div>

        {/* FRIENDS SECTION */}
        <section className="space-y-6">
          {loadingFriends ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-base-200 rounded-3xl p-5 shadow-sm animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-base-300" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-base-300 rounded w-2/3" />
                      <div className="h-2 bg-base-300 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-10 rounded-xl bg-base-300" />
                </div>
              ))}
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend, index) => (
                <motion.div
                  key={friend._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FriendCard friend={friend} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* DISCOVER / RECOMMENDATIONS SECTION */}
        <section className="space-y-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Meet New Learners
              </h2>
              <p className="opacity-70 mt-1 text-sm sm:text-base">
                Discover your perfect language exchange partners based on mutual goals
              </p>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-200/80 backdrop-blur-xl border border-base-300 rounded-3xl p-4 sm:p-5 shadow-lg space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
              {/* Search Name/Location */}
              <div className="relative">
                <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-3.5 size-4 opacity-50" />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-10 h-11 rounded-2xl text-sm"
                />
              </div>

              {/* Native Language Filter */}
              <select
                value={nativeFilter}
                onChange={(e) => setNativeFilter(e.target.value)}
                className="select select-bordered w-full h-11 rounded-2xl text-sm"
              >
                <option value="">Native: All Languages</option>
                {LANGUAGES.map((lang) => (
                  <option key={`filter-native-${lang}`} value={lang.toLowerCase()}>
                    Native: {lang}
                  </option>
                ))}
              </select>

              {/* Target Learning Language Filter */}
              <select
                value={learningFilter}
                onChange={(e) => setLearningFilter(e.target.value)}
                className="select select-bordered w-full h-11 rounded-2xl text-sm"
              >
                <option value="">Learning: All Languages</option>
                {LANGUAGES.map((lang) => (
                  <option key={`filter-learning-${lang}`} value={lang.toLowerCase()}>
                    Learning: {lang}
                  </option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters ? (
                <button
                  onClick={handleClearFilters}
                  className="btn btn-outline btn-error h-11 rounded-2xl gap-2 text-xs"
                >
                  <XIcon className="size-4" />
                  Clear Filters
                </button>
              ) : (
                <div className="hidden lg:flex items-center gap-2 text-xs opacity-60 px-2">
                  <FilterIcon className="size-4 text-primary" />
                  <span>Filter learners by language pair</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* LEARNERS GRID */}
          {loadingUsers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-base-200/70 rounded-3xl p-6 shadow-sm border border-base-300 space-y-4 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-base-300" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-base-300 rounded w-2/3" />
                      <div className="h-3 bg-base-300 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-10 bg-base-300 rounded-xl" />
                </div>
              ))}
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200/80 backdrop-blur-xl border border-base-300 p-10 text-center rounded-3xl shadow-lg">
              <h3 className="font-bold text-xl mb-2">No learners match your criteria</h3>
              <p className="text-base-content/70 text-sm mb-4">
                Try adjusting your search query or language filters to find more partners.
              </p>
              {hasActiveFilters && (
                <div>
                  <button onClick={handleClearFilters} className="btn btn-primary btn-sm rounded-xl">
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendedUsers.map((user, index) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                // Check for Perfect Mutual Language Exchange Match
                const isPerfectMatch =
                  authUser?.nativeLanguage &&
                  authUser?.learningLanguage &&
                  user.nativeLanguage?.toLowerCase() === authUser.learningLanguage?.toLowerCase() &&
                  user.learningLanguage?.toLowerCase() === authUser.nativeLanguage?.toLowerCase();

                return (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="card bg-base-200/90 backdrop-blur-xl border border-base-300 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative"
                  >
                    {/* Header color banner */}
                    <div className="h-20 bg-gradient-to-r from-primary/80 via-secondary/80 to-accent/80 relative">
                      {isPerfectMatch && (
                        <div className="absolute top-3 right-3 badge badge-accent badge-sm gap-1 shadow-md font-bold text-[11px] py-2 px-3">
                          <Sparkles className="size-3 animate-spin" />
                          Perfect Match
                        </div>
                      )}
                    </div>

                    <div className="card-body p-6 space-y-4 -mt-10 relative">
                      <div className="flex items-start gap-4">
                        <div className="avatar">
                          <div className="size-20 rounded-full border-4 border-base-100 shadow-xl bg-base-300">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>

                        <div className="pt-8 flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">{user.fullName}</h3>
                          {user.location && (
                            <p className="flex items-center text-xs opacity-70 mt-0.5 truncate">
                              <MapPinIcon className="size-3 mr-1 shrink-0" />
                              {user.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Language badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-secondary badge-sm shadow-sm py-2 px-3">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage || "English")}
                        </span>
                        <span className="badge badge-outline badge-sm shadow-sm py-2 px-3">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage || "Spanish")}
                        </span>
                      </div>

                      {user.bio ? (
                        <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                          {user.bio}
                        </p>
                      ) : (
                        <p className="text-xs opacity-40 italic">
                          Excited to practice and exchange languages!
                        </p>
                      )}

                      {/* Action Button */}
                      <button
                        className={`btn w-full rounded-2xl h-11 text-sm mt-2 transition-all shadow-md ${
                          hasRequestBeenSent
                            ? "btn-disabled bg-base-300 text-base-content/60"
                            : "btn-primary hover:shadow-primary/30"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2 text-success" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
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