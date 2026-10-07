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
  FiCheckCircle,
  FiFilter,
  FiMapPin,
  FiSearch,
  FiUserPlus,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";

import FriendCard from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";
import LanguageFlag from "../components/LanguageFlag.jsx";
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
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-base-100">
      <div className="container mx-auto space-y-10 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
              <span>Friends</span>
              <span className="badge badge-primary badge-sm font-semibold">{friends.length}</span>
            </h1>
            <p className="opacity-70 mt-1 text-xs sm:text-sm">
              Connect and chat with language exchange partners.
            </p>
          </div>

          <Link to="/notifications" className="btn btn-outline btn-sm rounded-xl gap-2">
            <FiUsers className="size-4 text-primary" />
            Friend Requests
          </Link>
        </div>

        <section className="space-y-4">
          {loadingFriends ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-base-200 rounded-2xl p-4 shadow-sm animate-pulse space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-base-300" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-base-300 rounded w-2/3" />
                      <div className="h-2 bg-base-300 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-8 rounded-xl bg-base-300" />
                </div>
              ))}
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        <section id="discover-learners" className="space-y-6 pt-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Discover Learners</h2>
            <p className="opacity-70 mt-1 text-xs sm:text-sm">
              Find language exchange partners based on learning goals
            </p>
          </div>

          <div className="bg-base-200/80 backdrop-blur-xl border border-base-300 rounded-2xl p-3.5 sm:p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center">
              <div className="relative">
                <FiSearch className="absolute top-1/2 -translate-y-1/2 left-3 size-4 opacity-50" />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-9 h-10 rounded-xl text-xs"
                />
              </div>

              <select
                value={nativeFilter}
                onChange={(e) => setNativeFilter(e.target.value)}
                className="select select-bordered w-full h-10 min-h-0 rounded-xl text-xs"
              >
                <option value="">Native: All</option>
                {LANGUAGES.map((lang) => (
                  <option key={`filter-native-${lang}`} value={lang.toLowerCase()}>
                    Native: {lang}
                  </option>
                ))}
              </select>

              <select
                value={learningFilter}
                onChange={(e) => setLearningFilter(e.target.value)}
                className="select select-bordered w-full h-10 min-h-0 rounded-xl text-xs"
              >
                <option value="">Learning: All</option>
                {LANGUAGES.map((lang) => (
                  <option key={`filter-learning-${lang}`} value={lang.toLowerCase()}>
                    Learning: {lang}
                  </option>
                ))}
              </select>

              {hasActiveFilters ? (
                <button
                  onClick={handleClearFilters}
                  className="btn btn-outline btn-error btn-sm h-10 rounded-xl gap-1.5 text-xs"
                >
                  <FiX className="size-3.5" />
                  Clear Filters
                </button>
              ) : (
                <div className="hidden lg:flex items-center gap-2 text-xs opacity-60 px-2">
                  <FiFilter className="size-3.5 text-primary" />
                  <span>Filter by language pair</span>
                </div>
              )}
            </div>
          </div>

          {loadingUsers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-base-200/70 rounded-2xl p-5 shadow-sm border border-base-300 space-y-3 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-base-300" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-base-300 rounded w-2/3" />
                      <div className="h-2 bg-base-300 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-9 bg-base-300 rounded-xl" />
                </div>
              ))}
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 border border-base-300 p-8 text-center rounded-2xl shadow-sm">
              <h3 className="font-bold text-base mb-1">No learners found</h3>
              <p className="text-base-content/70 text-xs mb-3">
                Try adjusting your search query or language filters.
              </p>
              {hasActiveFilters && (
                <div>
                  <button onClick={handleClearFilters} className="btn btn-primary btn-xs rounded-lg">
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                const isPerfectMatch =
                  authUser?.nativeLanguage &&
                  authUser?.learningLanguage &&
                  user.nativeLanguage?.toLowerCase() === authUser.learningLanguage?.toLowerCase() &&
                  user.learningLanguage?.toLowerCase() === authUser.nativeLanguage?.toLowerCase();

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200/90 backdrop-blur-xl border border-base-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all relative hover:-translate-y-0.5"
                  >
                    <div className="h-16 bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70 relative">
                      {isPerfectMatch && (
                        <div className="absolute top-2.5 right-2.5 badge badge-accent badge-xs gap-1 shadow-sm font-semibold py-1.5 px-2">
                          <IoSparklesOutline className="size-3" />
                          Match
                        </div>
                      )}
                    </div>

                    <div className="card-body p-4 space-y-3 -mt-8 relative">
                      <div className="flex items-start gap-3">
                        <div className="avatar">
                          <div className="size-16 rounded-full border-2 border-base-100 shadow-md bg-base-300">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>

                        <div className="pt-6 flex-1 min-w-0">
                          <h3 className="font-bold text-base truncate">{user.fullName}</h3>
                          {user.location && (
                            <p className="flex items-center text-xs opacity-60 mt-0.5 truncate">
                              <FiMapPin className="size-3 mr-1 shrink-0" />
                              {user.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary badge-xs py-2 px-2.5">
                          <LanguageFlag language={user.nativeLanguage} />
                          Native: {capitialize(user.nativeLanguage || "English")}
                        </span>
                        <span className="badge badge-outline badge-xs py-2 px-2.5">
                          <LanguageFlag language={user.learningLanguage} />
                          Learning: {capitialize(user.learningLanguage || "Spanish")}
                        </span>
                      </div>

                      {user.bio ? (
                        <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                          {user.bio}
                        </p>
                      ) : (
                        <p className="text-xs opacity-40 italic">
                          Practicing and exchanging languages.
                        </p>
                      )}

                      <button
                        className={`btn btn-sm w-full rounded-xl h-10 text-xs mt-1 transition-all ${
                          hasRequestBeenSent
                            ? "btn-disabled bg-base-300 text-base-content/60"
                            : "btn-primary shadow-sm"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <FiCheckCircle className="size-3.5 mr-1.5 text-success" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <FiUserPlus className="size-3.5 mr-1.5" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
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