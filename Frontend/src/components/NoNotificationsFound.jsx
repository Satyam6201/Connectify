import { FiBell } from "react-icons/fi";

function NoNotificationsFound() {
  return (
    <div className="rounded-2xl bg-base-200/80 border border-base-300 shadow-md p-8 sm:p-12 text-center max-w-lg mx-auto">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
        <FiBell className="size-8" />
      </div>

      <h2 className="text-xl font-bold mb-2">No Notifications</h2>

      <p className="text-xs sm:text-sm opacity-70 leading-relaxed max-w-sm mx-auto">
        Friend requests and connection updates will appear here once other learners interact with you.
      </p>
    </div>
  );
}

export default NoNotificationsFound;