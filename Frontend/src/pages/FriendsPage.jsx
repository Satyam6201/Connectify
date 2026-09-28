import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFriends, removeFriend } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, PhoneCall, SearchIcon, Sparkles, Trash2Icon, UserXIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";

const FriendsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [friendToRemove, setFriendToRemove] = useState(null);

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { mutate: removeFriendMutation, isPending: isRemoving } = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed successfully");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setFriendToRemove(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    },
  });

  const filteredFriends = friends.filter((friend) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      friend.fullName?.toLowerCase().includes(term) ||
      friend.nativeLanguage?.toLowerCase().includes(term) ||
      friend.learningLanguage?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-base-300 pb-6"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3">
                <Sparkles className="text-primary size-7" />
                Your Language Partners
                <span className="badge badge-primary text-sm font-semibold">{friends.length}</span>
              </h1>
              <p className="text-base-content/70 mt-1 text-sm sm:text-base">
                Start real-time conversations, video calls, or manage your connection network.
              </p>
            </div>

            {/* SEARCH INPUT */}
            {friends.length > 0 && (
              <div className="relative w-full md:w-72">
                <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-3.5 size-4 opacity-50" />
                <input
                  type="text"
                  placeholder="Search friends or language..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full pl-10 h-11 rounded-2xl text-sm"
                />
              </div>
            )}
          </motion.div>

          {/* SKELETON LOADING */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-base-200 rounded-3xl p-6 space-y-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-base-300" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-base-300 rounded w-2/3" />
                      <div className="h-3 bg-base-300 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-10 rounded-2xl bg-base-300" />
                </div>
              ))}
            </div>
          ) : friends.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto">
              <div className="size-28 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <UserXIcon className="size-12 text-primary opacity-80" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No Friends Added Yet</h2>
              <p className="text-base-content/70 text-sm mb-6">
                Explore recommended language partners on the Home feed and send a friend request to start chatting!
              </p>
              <button onClick={() => navigate("/")} className="btn btn-primary rounded-2xl px-6">
                Discover Language Partners
              </button>
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center rounded-3xl max-w-md mx-auto">
              <p className="font-semibold">No friends matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="btn btn-sm btn-ghost mt-3 rounded-xl"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* FRIENDS GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFriends.map((friend, index) => (
                <motion.div
                  key={friend._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card bg-base-200/90 backdrop-blur-xl border border-base-300 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Top gradient strip */}
                  <div className="h-20 bg-gradient-to-r from-primary via-secondary to-accent relative" />

                  <div className="card-body p-6 space-y-4 -mt-10 relative">
                    <div className="flex items-start justify-between">
                      <div className="avatar">
                        <div className="size-20 rounded-full border-4 border-base-100 shadow-xl bg-base-300">
                          <img src={friend.profilePic} alt={friend.fullName} />
                        </div>
                      </div>

                      {/* Unfriend dropdown action */}
                      <button
                        onClick={() => setFriendToRemove(friend)}
                        className="btn btn-ghost btn-circle btn-sm text-error opacity-70 hover:opacity-100"
                        title="Remove Friend"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold truncate">{friend.fullName}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="badge badge-secondary badge-sm py-2">
                          {getLanguageFlag(friend.nativeLanguage)}
                          Native: {capitialize(friend.nativeLanguage || "English")}
                        </span>
                        <span className="badge badge-outline badge-sm py-2">
                          {getLanguageFlag(friend.learningLanguage)}
                          Learning: {capitialize(friend.learningLanguage || "Spanish")}
                        </span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => navigate(`/chat/${friend._id}`)}
                        className="btn btn-primary btn-sm rounded-xl h-10 gap-2 text-xs"
                      >
                        <MessageCircle className="size-4" />
                        Chat
                      </button>

                      <button
                        onClick={() => navigate(`/chat/${friend._id}`)}
                        className="btn btn-outline btn-sm rounded-xl h-10 gap-2 text-xs"
                      >
                        <PhoneCall className="size-4 text-success" />
                        Video Call
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* REMOVE FRIEND CONFIRMATION MODAL */}
      <AnimatePresence>
        {friendToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-base-200 border border-base-300 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <h3 className="font-bold text-lg text-error flex items-center gap-2">
                <Trash2Icon className="size-5" />
                Remove Friend?
              </h3>
              <p className="text-sm opacity-80">
                Are you sure you want to remove <strong>{friendToRemove.fullName}</strong> from your
                friends list?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setFriendToRemove(null)}
                  className="btn btn-ghost btn-sm rounded-xl"
                  disabled={isRemoving}
                >
                  Cancel
                </button>
                <button
                  onClick={() => removeFriendMutation(friendToRemove._id)}
                  className="btn btn-error btn-sm rounded-xl px-4"
                  disabled={isRemoving}
                >
                  {isRemoving ? "Removing..." : "Yes, Remove"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendsPage;