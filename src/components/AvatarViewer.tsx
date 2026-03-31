import { motion } from "framer-motion";

interface AvatarViewerProps {
  isSpeaking: boolean;
}

const AvatarViewer = ({ isSpeaking }: AvatarViewerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full relative"
    >
      <div
        className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 ${
          isSpeaking ? "opacity-60" : "opacity-20"
        } bg-accent/40 -z-10`}
      />

      {/* WebGL avatar disabled to avoid runtime crashes from remote GLB loading. */}
      <div className="h-full w-full rounded-full border border-border/50 bg-gradient-to-b from-muted/60 to-background/70 backdrop-blur-sm flex items-center justify-center">
        <div
          className={`h-20 w-20 rounded-full transition-transform duration-300 ${
            isSpeaking ? "scale-105" : "scale-100"
          } bg-accent/30 border border-accent/50`}
        />
      </div>
    </motion.div>
  );
};

export default AvatarViewer;
