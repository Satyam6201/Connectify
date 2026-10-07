import { Link } from "react-router";
import { FiMessageSquare } from "react-icons/fi";
import LanguageFlag from "./LanguageFlag";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200/90 backdrop-blur-xl border border-base-300 shadow-md hover:shadow-xl transition-all duration-200 rounded-2xl overflow-hidden hover:-translate-y-1">
      <div className="h-16 bg-gradient-to-r from-primary/80 via-secondary/80 to-accent/80" />

      <div className="card-body p-5 -mt-8">
        <div className="flex flex-col items-center text-center">
          <div className="avatar">
            <div className="size-20 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 shadow-lg bg-base-300">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
          </div>

          <h3 className="font-bold text-lg mt-3 truncate max-w-full">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          <span className="badge badge-secondary badge-sm py-2">
            <LanguageFlag language={friend.nativeLanguage} />
            Native: {friend.nativeLanguage}
          </span>

          <span className="badge badge-outline badge-sm py-2">
            <LanguageFlag language={friend.learningLanguage} />
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <div className="mt-4">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-primary btn-sm w-full rounded-xl gap-2 font-medium shadow-sm"
          >
            <FiMessageSquare className="size-4" />
            Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;