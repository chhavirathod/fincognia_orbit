import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center relative"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full" />
        
        <div className="relative glass-card p-12 md:p-16 rounded-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start your conversational
            <br />
            <span className="text-gradient">banking journey</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Experience the future of finance where AI understands your needs and
            responds in real-time.
          </p>
          <Button
            size="lg"
            variant="hero"
            onClick={() => navigate("/app")}
            className="text-lg px-12 py-7 h-auto group"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
