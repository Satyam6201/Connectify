import { FiVideo } from "react-icons/fi";

function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 border-b border-base-300 flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0 right-0 z-20 pointer-events-none">
      <button
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white rounded-xl shadow-lg gap-2 pointer-events-auto font-semibold px-4 hover:scale-105 active:scale-95 transition-transform"
        title="Start Video Call"
      >
        <FiVideo className="size-4" />
        <span className="hidden sm:inline text-xs">Video Call</span>
      </button>
    </div>
  );
}

export default CallButton;