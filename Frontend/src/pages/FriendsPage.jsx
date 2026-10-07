import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFriends, removeFriend } from "../lib/api";
import {
  FiMessageSquare,
  FiPhoneCall,
  FiSearch,
  FiTrash2,
  FiUserX,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { capitialize } from "../lib/utils";
import LanguageFlag from "../components/LanguageFlag";

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
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-base-300 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
              <span>Friends</span>
              <span className="badge badge-primary badge-sm font-semibold">{friends.length}</span>
            </h1>
            <p className="text-base-content/70 mt-1 text-xs sm:text-sm">
              Start chats, initiate video calls, or manage connections.
            </p>
          </div>

          {friends.length > 0 && (
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute top-1/2 -translate-y-1/2 left-3 size-4 opacity-50" />
              <input
                type="text"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-9 h-10 rounded-xl text-xs"
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-base-200 rounded-2xl p-5 space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-base-300" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-base-300 rounded w-2/3" />
                    <div className="h-2 bg-base-300 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-9 rounded-xl bg-base-300" />
              </div>
            ))}
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <FiUserX className="size-10 opacity-80" />
            </div>
            <h2 className="text-xl font-bold mb-1">No Friends Yet</h2>
            <p className="text-base-content/70 text-xs mb-5">
              Explore recommended learners on the Home page to start connecting.
            </p>
            <button onClick={() => navigate("/")} className="btn btn-primary btn-sm rounded-xl px-5">
              Discover Learners
            </button>
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center rounded-2xl max-w-sm mx-auto">
            <p className="font-medium text-xs">No friends matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-xs btn-ghost mt-2 rounded-lg"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="card bg-base-200/90 border border-base-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-14 bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70" />

                <div className="card-body p-4 space-y-3 -mt-7">
                  <div className="flex items-start justify-between">
                    <div className="avatar">
                      <div className="size-14 rounded-full border-2 border-base-100 shadow-md bg-base-300">
                        <img src={friend.profilePic} alt={friend.fullName} />
                      </div>
                    </div>

                    <button
                      onClick={() => setFriendToRemove(friend)}
                      className="btn btn-ghost btn-circle btn-xs text-error opacity-60 hover:opacity-100"
                      title="Remove Friend"
                    >
                      <FiTrash2 className="size-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold truncate">{friend.fullName}</h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="badge badge-secondary badge-xs py-1.5">
                        <LanguageFlag language={friend.nativeLanguage} />
                        Native: {capitialize(friend.nativeLanguage || "English")}
                      </span>
                      <span className="badge badge-outline badge-xs py-1.5">
                        <LanguageFlag language={friend.learningLanguage} />
                        Learning: {capitialize(friend.learningLanguage || "Spanish")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => navigate(`/chat/${friend._id}`)}
                      className="btn btn-primary btn-xs rounded-lg h-8 gap-1 text-xs"
                    >
                      <FiMessageSquare className="size-3" />
                      Chat
                    </button>

                    <button
                      onClick={() => navigate(`/chat/${friend._id}`)}
                      className="btn btn-outline btn-xs rounded-lg h-8 gap-1 text-xs"
                    >
                      <FiPhoneCall className="size-3 text-success" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {friendToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-base-200 border border-base-300 rounded-2xl p-5 max-w-xs w-full shadow-xl space-y-3">
            <h3 className="font-bold text-base text-error flex items-center gap-1.5">
              <FiTrash2 className="size-4" />
              Remove Friend
            </h3>
            <p className="text-xs opacity-80">
              Are you sure you want to remove <strong>{friendToRemove.fullName}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setFriendToRemove(null)}
                className="btn btn-ghost btn-xs rounded-lg"
                disabled={isRemoving}
              >
                Cancel
              </button>
              <button
                onClick={() => removeFriendMutation(friendToRemove._id)}
                className="btn btn-error btn-xs rounded-lg px-3"
                disabled={isRemoving}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;