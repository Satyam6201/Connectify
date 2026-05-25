import { LoaderIcon } from "lucide-react";
import { motion } from "framer-motion";

function ChatLoader() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative bg-base-100"
        >

            {/* Animated Background Blur */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute w-72 h-72 bg-primary/20 rounded-full blur-3xl"
            />

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.7,
                    type: "spring",
                }}
                className="relative z-10 flex flex-col items-center justify-center"
            >

                {/* Loader Ring */}
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="relative"
                >
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-125" />

                    <div className="relative bg-base-200 p-6 rounded-full shadow-2xl border border-base-300">
                        <LoaderIcon className="size-10 sm:size-12 text-primary animate-spin" />
                    </div>
                </motion.div>

                {/* Animated Text */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        y: [0, -2, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                    className="mt-6 text-center text-base sm:text-lg md:text-xl font-semibold tracking-wide"
                >
                    Connecting to chat...
                </motion.p>

                {/* Dots Animation */}
                <div className="flex gap-2 mt-4">
                    {[0, 1, 2].map((dot) => (
                        <motion.div
                            key={dot}
                            animate={{
                                y: [0, -8, 0],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: dot * 0.2,
                            }}
                            className="w-3 h-3 rounded-full bg-primary"
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ChatLoader;