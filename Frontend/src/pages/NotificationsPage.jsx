import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
  rejectFriendRequest,
} from "../lib/api";
import {
  FiBell,
  FiCheck,
  FiClock,
  FiMessageSquare,
  FiSend,
  FiUserCheck,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import NoNotificationsFound from "../components/NoNotificationsFound.jsx";
import { capitialize } from "../lib/utils.js";
import LanguageFlag from "../components/LanguageFlag.jsx";
import { Link } from "react-router";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("incoming");

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
      toast.success("Friend request accepted");
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
    <div className="p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-h-screen bg-base-100">
      <div className="container mx-auto max-w-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2.5">
              <FiBell className="text-primary size-6" />
              Notifications
            </h1>
            <p className="opacity-70 text-xs mt-1">
              Manage incoming and outgoing friend requests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-base-200 p-1.5 rounded-xl border border-base-300 overflow-x-auto">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`btn btn-xs sm:btn-sm rounded-lg flex-1 gap-1.5 ${
              activeTab === "incoming" ? "btn-primary shadow-sm" : "btn-ghost"
            }`}
          >
            <FiUserCheck className="size-3.5" />
            <span>Incoming</span>
            {incomingRequests.length > 0 && (
              <span className="badge badge-error badge-xs text-white font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("outgoing")}
            className={`btn btn-xs sm:btn-sm rounded-lg flex-1 gap-1.5 ${
              activeTab === "outgoing" ? "btn-primary shadow-sm" : "btn-ghost"
            }`}
          >
            <FiSend className="size-3.5" />
            <span>Sent</span>
            {outgoingRequests.length > 0 && (
              <span className="badge badge-ghost badge-xs">{outgoingRequests.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("accepted")}
            className={`btn btn-xs sm:btn-sm rounded-lg flex-1 gap-1.5 ${
              activeTab === "accepted" ? "btn-primary shadow-sm" : "btn-ghost"
            }`}
          >
            <FiBell className="size-3.5" />
            <span>New Friends</span>
            {acceptedRequests.length > 0 && (
              <span className="badge badge-success badge-xs text-white">
                {acceptedRequests.length}
              </span>
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : totalNotifications === 0 ? (
          <NoNotificationsFound />
        ) : (
          <div className="space-y-3">
            {activeTab === "incoming" && (
              <div className="space-y-3">
                {incomingRequests.length === 0 ? (
                  <div className="card bg-base-200 p-8 text-center rounded-2xl border border-base-300">
                    <p className="font-medium text-xs opacity-70">No pending incoming requests</p>
                  </div>
                ) : (
                  incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200/90 border border-base-300 shadow-sm rounded-2xl"
                    >
                      <div className="card-body p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="size-12 rounded-full border-2 border-primary bg-base-300">
                                <img
                                  src={request.sender.profilePic}
                                  alt={request.sender.fullName}
                                />
                              </div>
                            </div>

                            <div>
                              <h3 className="font-bold text-sm">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <span className="badge badge-secondary badge-xs">
                                  <LanguageFlag language={request.sender.nativeLanguage} />
                                  Native: {capitialize(request.sender.nativeLanguage || "English")}
                                </span>
                                <span className="badge badge-outline badge-xs">
                                  <LanguageFlag language={request.sender.learningLanguage} />
                                  Learning: {capitialize(request.sender.learningLanguage || "Spanish")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            <button
                              className="btn btn-ghost btn-xs rounded-lg text-error"
                              onClick={() => rejectMutation(request._id)}
                              disabled={isRejecting || isAccepting}
                            >
                              <FiX className="size-3.5 mr-1" />
                              Decline
                            </button>

                            <button
                              className="btn btn-primary btn-xs rounded-lg shadow-sm"
                              onClick={() => acceptMutation(request._id)}
                              disabled={isAccepting || isRejecting}
                            >
                              <FiCheck className="size-3.5 mr-1" />
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "outgoing" && (
              <div className="space-y-3">
                {outgoingRequests.length === 0 ? (
                  <div className="card bg-base-200 p-8 text-center rounded-2xl border border-base-300">
                    <p className="font-medium text-xs opacity-70">No pending sent requests</p>
                  </div>
                ) : (
                  outgoingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="card bg-base-200/90 border border-base-300 shadow-sm rounded-2xl"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="size-11 rounded-full border border-base-content/20 bg-base-300">
                                <img
                                  src={req.recipient?.profilePic}
                                  alt={req.recipient?.fullName}
                                />
                              </div>
                            </div>

                            <div>
                              <h3 className="font-bold text-sm">{req.recipient?.fullName}</h3>
                              <p className="text-[11px] opacity-60 flex items-center gap-1 mt-0.5">
                                <FiClock className="size-2.5" />
                                Pending response
                              </p>
                            </div>
                          </div>

                          <button
                            className="btn btn-outline btn-error btn-xs rounded-lg"
                            onClick={() => cancelMutation(req._id)}
                            disabled={isCanceling}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "accepted" && (
              <div className="space-y-3">
                {acceptedRequests.length === 0 ? (
                  <div className="card bg-base-200 p-8 text-center rounded-2xl border border-base-300">
                    <p className="font-medium text-xs opacity-70">No new connections yet</p>
                  </div>
                ) : (
                  acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200/90 border border-base-300 shadow-sm rounded-2xl"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="size-11 rounded-full border-2 border-success bg-base-300">
                                <img
                                  src={notification.recipient?.profilePic}
                                  alt={notification.recipient?.fullName}
                                />
                              </div>
                            </div>

                            <div>
                              <h3 className="font-bold text-sm">
                                {notification.recipient?.fullName}
                              </h3>
                              <p className="text-[11px] opacity-70">
                                Accepted your friend request.
                              </p>
                            </div>
                          </div>

                          <Link
                            to={`/chat/${notification.recipient?._id}`}
                            className="btn btn-primary btn-xs rounded-lg gap-1"
                          >
                            <FiMessageSquare className="size-3" />
                            Message
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;