import toast from "react-hot-toast";
import { FiBell, FiCheck, FiMessageSquare, FiPhoneCall, FiX } from "react-icons/fi";

export const showFriendRequestToast = ({ senderName, senderAvatar, onAccept, onDecline }) => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-base-200/95 backdrop-blur-2xl border border-primary/30 shadow-2xl rounded-2xl pointer-events-auto flex flex-col p-4 ring-1 ring-black/5 transition-all duration-300`}
      >
        <div className="flex items-start gap-3">
          <div className="avatar relative">
            <div className="size-11 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
              <img src={senderAvatar} alt={senderName} />
            </div>
            <span className="absolute bottom-0 right-0 size-3.5 rounded-full bg-primary ring-2 ring-base-100 flex items-center justify-center text-white">
              <FiBell className="size-2" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{senderName}</p>
            <p className="text-xs text-base-content/70 mt-0.5">Sent you a friend request</p>
          </div>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="btn btn-ghost btn-circle btn-xs opacity-60 hover:opacity-100"
          >
            <FiX className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-base-300">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              if (onDecline) onDecline();
            }}
            className="btn btn-ghost btn-xs rounded-xl px-3"
          >
            Decline
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              if (onAccept) onAccept();
            }}
            className="btn btn-primary btn-xs rounded-xl px-3 gap-1 font-semibold"
          >
            <FiCheck className="size-3" />
            Accept
          </button>
        </div>
      </div>
    ),
    { duration: 6000, position: "top-right" }
  );
};

export const showMessageToast = ({ senderName, senderAvatar, messageText, onClick }) => {
  return toast.custom(
    (t) => (
      <div
        onClick={() => {
          toast.dismiss(t.id);
          if (onClick) onClick();
        }}
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-base-200/95 backdrop-blur-2xl border border-secondary/30 shadow-2xl rounded-2xl pointer-events-auto p-4 cursor-pointer hover:bg-base-300/80 transition-all duration-300 ring-1 ring-black/5`}
      >
        <div className="flex items-center gap-3">
          <div className="avatar relative">
            <div className="size-11 rounded-full ring-2 ring-secondary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
              <img src={senderAvatar} alt={senderName} />
            </div>
            <span className="absolute bottom-0 right-0 size-3.5 rounded-full bg-secondary ring-2 ring-base-100 flex items-center justify-center text-white">
              <FiMessageSquare className="size-2" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold truncate">{senderName}</p>
              <span className="text-[10px] opacity-60">Just now</span>
            </div>
            <p className="text-xs text-base-content/80 mt-0.5 line-clamp-1">
              {messageText || "New message received"}
            </p>
          </div>
        </div>
      </div>
    ),
    { duration: 5000, position: "top-right" }
  );
};

export const showVideoCallToast = ({ callerName, callerAvatar, onJoin }) => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-base-200/95 backdrop-blur-2xl border-2 border-success shadow-2xl rounded-2xl pointer-events-auto p-4 ring-1 ring-black/5`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar relative">
              <div className="size-11 rounded-full ring-2 ring-success ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
                <img src={callerAvatar} alt={callerName} />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold">{callerName}</p>
              <p className="text-xs text-success font-medium flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block animate-pulse" />
                Incoming Video Call
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="btn btn-ghost btn-circle btn-sm text-error"
            >
              <FiX className="size-4" />
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                if (onJoin) onJoin();
              }}
              className="btn btn-success btn-sm rounded-xl text-white font-bold gap-1 shadow-lg"
            >
              <FiPhoneCall className="size-3.5" />
              Join
            </button>
          </div>
        </div>
      </div>
    ),
    { duration: 10000, position: "top-center" }
  );
};
