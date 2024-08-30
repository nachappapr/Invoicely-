import { motion } from "framer-motion";

const AnimatedLoader = ({ className }: { className?: string }) => {
  return (
    <div className="flex space-x-[4px]">
      <motion.div
        className={`h-2 w-2 rounded-full bg-indigo-1000 ${className}`}
        animate={{ y: ["100%", "-100%", "100%"] }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      <motion.div
        className={`h-2 w-2 rounded-full bg-indigo-1000 ${className}`}
        animate={{ y: ["100%", "-100%", "100%"] }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
          delay: 0.2,
        }}
      />
      <motion.div
        className={`h-2 w-2 rounded-full bg-indigo-1000 ${className}`}
        animate={{ y: ["100%", "-100%", "100%"] }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
          delay: 0.4,
        }}
      />
    </div>
  );
};

export default AnimatedLoader;
