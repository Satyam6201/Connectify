import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest } from "../lib/api";
import { showFriendRequestToast } from "../lib/notificationToast";
import useAuthUser from "./useAuthUser";

export const useRealtimeNotifications = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const previousRequestIdsRef = useRef(new Set());
  const isFirstLoadRef = useRef(true);

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser?.isOnboarded,
    refetchInterval: 10000,
  });

  const { mutate: acceptReq } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const { mutate: rejectReq } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  useEffect(() => {
    if (!friendRequests?.incomingReqs) return;

    const currentIncoming = friendRequests.incomingReqs;
    const currentIds = new Set(currentIncoming.map((r) => r._id));

    if (!isFirstLoadRef.current) {
      currentIncoming.forEach((request) => {
        if (!previousRequestIdsRef.current.has(request._id)) {
          showFriendRequestToast({
            senderName: request.sender?.fullName || "A user",
            senderAvatar: request.sender?.profilePic,
            onAccept: () => acceptReq(request._id),
            onDecline: () => rejectReq(request._id),
          });
        }
      });
    } else {
      isFirstLoadRef.current = false;
    }

    previousRequestIdsRef.current = currentIds;
  }, [friendRequests, acceptReq, rejectReq]);
};

export default useRealtimeNotifications;
