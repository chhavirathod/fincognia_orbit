import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const MicButton = ({ isListening, onClick }: MicButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full bg-accent"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      <Button
        onClick={onClick}
        className={`relative w-16 h-16 rounded-full ${
          isListening 
            ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
            : 'glass-card hover:bg-white/20'
        } transition-all duration-300 shadow-lg`}
        size="icon"
      >
        {isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </Button>
    </motion.div>
  );
};

export default MicButton;
