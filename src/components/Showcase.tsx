import { motion } from "framer-motion";

const Showcase = () => {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Finance meets <span className="text-gradient">human conversation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience seamless interaction with your finances through our
            intuitive dashboard
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20 blur-3xl -z-10 animate-glow-pulse" />
          
          {/* Mockup Container */}
          <div className="glass-card p-4 rounded-3xl">
            <div className="aspect-video bg-gradient-to-br from-secondary to-card rounded-2xl flex items-center justify-center overflow-hidden">
              {/* Dashboard Preview Placeholder */}
              <div className="w-full h-full relative bg-gradient-to-br from-card/50 to-secondary/50 backdrop-blur">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                  <motion.div
                    className="w-32 h-32 rounded-full bg-accent/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="w-24 h-24 rounded-full bg-accent/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-accent/50" />
                    </div>
                  </motion.div>
                  <div className="text-center space-y-2">
                    <div className="h-8 w-64 bg-white/10 rounded-lg mx-auto" />
                    <div className="h-4 w-48 bg-white/5 rounded-lg mx-auto" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-12 w-32 bg-accent/20 rounded-lg" />
                    <div className="h-12 w-32 bg-white/10 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Showcase;
