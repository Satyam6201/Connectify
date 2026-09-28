import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
  rejectFriendRequest,
} from "../lib/api";
import {
  BellIcon,
  CheckIcon,
  ClockIcon,
  MessageSquareIcon,
  SendIcon,
  UserCheckIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import NoNotificationsFound from "../components/NoNotificationsFound.jsx";
import { getLanguageFlag } from "../components/FriendCard.jsx";
import { capitialize } from "../lib/utils.js";
import { Link } from "react-router";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("incoming"); // 'incoming' | 'outgoing' | 'accepted'

  const { data: friendRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: outgoingRequests = [], isLoading: loadingOutgoing } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: acceptMutation, isPending: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to accept request");
    },
  });

  const { mutate: rejectMutation, isPending: isRejecting } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast.success("Friend request declined");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to decline request");
    },
  });

  const { mutate: cancelMutation, isPending: isCanceling } = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      toast.success("Outgoing request cancelled");
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to cancel request");
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  const totalNotifications =
    incomingRequests.length + outgoingRequests.length + acceptedRequests.length;

  const isLoading = loadingRequests || loadingOutgoing;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-base-100">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* PAGE TITLE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300 pb-5">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <BellIcon className="text-primary size-7" />
              Notifications & Requests
            </h1>
            <p className="opacity-70 text-sm mt-1">
              Manage incoming friend invites and track outgoing connection requests.
            </p>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex items-center gap-2 bg-base-200 p-1.5 rounded-2xl border border-base-300 overflow-x-auto">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`btn btn-sm rounded-xl flex-1 gap-2 ${
              activeTab === "incoming" ? "btn-primary shadow-md" : "btn-ghost"
            }`}
          >
            <UserCheckIcon className="size-4" />
            <span>Incoming</span>
            {incomingRequests.length > 0 && (
              <span className="badge badge-error badge-sm text-white font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("outgoing")}
            className={`btn btn-sm rounded-xl flex-1 gap-2 ${
              activeTab === "outgoing" ? "btn-primary shadow-md" : "btn-ghost"
            }`}
          >
            <SendIcon className="size-4" />
            <span>Sent Requests</span>
            {outgoingRequests.length > 0 && (
              <span className="badge badge-ghost badge-sm">{outgoingRequests.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("accepted")}
            className={`btn btn-sm rounded-xl flex-1 gap-2 ${
              activeTab === "accepted" ? "btn-primary shadow-md" : "btn-ghost"
            }`}
          >
            <BellIcon className="size-4" />
            <span>New Friends</span>
            {acceptedRequests.length > 0 && (
              <span className="badge badge-success badge-sm text-white">
                {acceptedRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB CONTENT */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : totalNotifications === 0 ? (
          <NoNotificationsFound />
        ) : (
          <AnimatePresence mode="wait">
            {/* INCOMING TAB */}
            {activeTab === "incoming" && (
              <motion.div
                key="incoming-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {incomingRequests.length === 0 ? (
                  <div className="card bg-base-200 p-10 text-center rounded-3xl border border-base-300">
                    <p className="font-medium opacity-70">No pending incoming friend requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {incomingRequests.map((request) => (
                      <div
                        key={request._id}
                        className="card bg-base-200/90 backdrop-blur-xl border border-base-300 shadow-md hover:shadow-lg transition-all rounded-3xl"
                      >
                        <div className="card-body p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="avatar">
                                <div className="size-16 rounded-full border-2 border-primary bg-base-300">
                                  <img
                                    src={request.sender.profilePic}
                                    alt={request.sender.fullName}
                                  />
                                </div>
                              </div>

                              <div>
                                <h3 className="font-bold text-lg">{request.sender.fullName}</h3>
                                {request.sender.location && (
                                  <p className="text-xs opacity-60 mt-0.5">
                                    {request.sender.location}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  <span className="badge badge-secondary badge-sm">
                                    {getLanguageFlag(request.sender.nativeLanguage)}
                                    Native: {capitialize(request.sender.nativeLanguage || "English")}
                                  </span>
                                  <span className="badge badge-outline badge-sm">
                                    {getLanguageFlag(request.sender.learningLanguage)}
                                    Learning: {capitialize(request.sender.learningLanguage || "Spanish")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Accept & Reject Buttons */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <button
                                className="btn btn-ghost btn-sm rounded-xl text-error hover:bg-error/10 gap-1.5"
                                onClick={() => rejectMutation(request._id)}
                                disabled={isRejecting || isAccepting}
                              >
                                <XIcon className="size-4" />
                                Decline
                              </button>

                              <button
                                className="btn btn-primary btn-sm rounded-xl gap-1.5 shadow-md"
                                onClick={() => acceptMutation(request._id)}
                                disabled={isAccepting || isRejecting}
                              >
                                <CheckIcon className="size-4" />
                                Accept
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* OUTGOING TAB */}
            {activeTab === "outgoing" && (
              <motion.div
                key="outgoing-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {outgoingRequests.length === 0 ? (
                  <div className="card bg-base-200 p-10 text-center rounded-3xl border border-base-300">
                    <p className="font-medium opacity-70">No pending outgoing friend requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {outgoingRequests.map((req) => (
                      <div
                        key={req._id}
                        className="card bg-base-200/90 backdrop-blur-xl border border-base-300 shadow-md rounded-3xl"
                      >
                        <div className="card-body p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="avatar">
                                <div className="size-14 rounded-full border-2 border-base-content/20 bg-base-300">
                                  <img
                                    src={req.recipient?.profilePic}
                                    alt={req.recipient?.fullName}
                                  />
                                </div>
                              </div>

                              <div>
                                <h3 className="font-bold">{req.recipient?.fullName}</h3>
                                <p className="text-xs opacity-60 flex items-center gap-1 mt-0.5">
                                  <ClockIcon className="size-3" />
                                  Pending response
                                </p>
                              </div>
                            </div>

                            <button
                              className="btn btn-outline btn-error btn-sm rounded-xl"
                              onClick={() => cancelMutation(req._id)}
                              disabled={isCanceling}
                            >
                              Cancel Request
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ACCEPTED / NEW FRIENDS TAB */}
            {activeTab === "accepted" && (
              <motion.div
                key="accepted-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {acceptedRequests.length === 0 ? (
                  <div className="card bg-base-200 p-10 text-center rounded-3xl border border-base-300">
                    <p className="font-medium opacity-70">No recently accepted connections</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {acceptedRequests.map((notification) => (
                      <div
                        key={notification._id}
                        className="card bg-base-200/90 backdrop-blur-xl border border-base-300 shadow-md rounded-3xl"
                      >
                        <div className="card-body p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="avatar">
                                <div className="size-14 rounded-full border-2 border-success bg-base-300">
                                  <img
                                    src={notification.recipient?.profilePic}
                                    alt={notification.recipient?.fullName}
                                  />
                                </div>
                              </div>

                              <div>
                                <h3 className="font-bold">
                                  {notification.recipient?.fullName}
                                </h3>
                                <p className="text-xs opacity-75 mt-0.5">
                                  Accepted your friend request! You can now chat and video call.
                                </p>
                              </div>
                            </div>

                            <Link
                              to={`/chat/${notification.recipient?._id}`}
                              className="btn btn-primary btn-sm rounded-xl gap-2 shadow-md"
                            >
                              <MessageSquareIcon className="size-4" />
                              Say Hi
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;