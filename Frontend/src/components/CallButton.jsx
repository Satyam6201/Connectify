import { VideoIcon } from "lucide-react";
import { motion } from "framer-motion";

function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 border-b border-base-300 flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0 right-0 z-20 pointer-events-none">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white rounded-2xl shadow-lg gap-2 pointer-events-auto font-semibold px-4"
        title="Start Video Call"
      >
        <VideoIcon className="size-4" />
        <span className="hidden sm:inline text-xs">Video Call</span>
      </motion.button>
    </div>
  );
}

export default CallButton;