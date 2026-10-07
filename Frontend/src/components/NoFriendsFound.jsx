import { FiUsers } from "react-icons/fi";
import { Link } from "react-router";

const NoFriendsFound = () => {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-200/80 backdrop-blur-xl shadow-md p-8 sm:p-12 text-center max-w-xl mx-auto">
      <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
        <FiUsers className="size-10" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-2">No Friends Added Yet</h2>

      <p className="text-sm opacity-70 leading-relaxed max-w-md mx-auto mb-6">
        Connect with language learners from around the world and start practicing conversations together.
      </p>

      <a href="#discover-learners" className="btn btn-primary btn-sm rounded-xl px-5">
        Discover Learners
      </a>
    </div>
  );
};

export default NoFriendsFound;