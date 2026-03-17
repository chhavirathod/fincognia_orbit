import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/hooks/useGeminiChat';
import { Bot, User } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  isThinking: boolean;
}

const ChatPanel = ({ messages, isThinking }: ChatPanelProps) => {
  // Show only the last 4 messages
  const recentMessages = messages.slice(-4);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-4 rounded-2xl w-80 max-h-96 overflow-y-auto"
    >
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Recent Conversation</h3>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {recentMessages.map((message, index) => (
            <motion.div
              key={`${message.timestamp.getTime()}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-accent" />
                </div>
              )}
              
              <div
                className={`px-3 py-2 rounded-xl max-w-[220px] ${
                  message.role === 'user'
                    ? 'bg-accent/20 text-white'
                    : 'bg-white/5 text-foreground'
                }`}
              >
                <p className="text-xs leading-relaxed">{message.content}</p>
              </div>
              
              {message.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 items-center text-muted-foreground text-xs"
          >
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot className="w-3 h-3 text-accent" />
            </div>
            <span>Thinking...</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatPanel;
